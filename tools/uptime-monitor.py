import concurrent.futures
import json
import pathlib
import sys
import time
import urllib.error
import urllib.request


def http_state(code, headers):
    if headers.get('cf-mitigated', '').lower() == 'challenge' or code in (401, 403, 429):
        return 'unknown'
    return 'up' if 200 <= code < 300 else 'failed'


def validate_worker_probe(kind, payload):
    if not isinstance(payload, dict) or payload.get('ok') is not True:
        return 'failed', None
    if kind == 'rewards':
        if type(payload.get('enabled')) is not bool:
            return 'unknown', None
        return 'up', {'enabled': payload['enabled']}
    if kind == 'giveaways':
        rows = payload.get('giveaways')
        if not isinstance(rows, list) or not all(isinstance(row, dict) and isinstance(row.get('status'), str) for row in rows):
            return 'unknown', None
        return 'up', {'active': sum(row['status'] == 'active' for row in rows)}
    return 'unknown', None


def validate_tebex_status(payload, components):
    if not isinstance(payload, dict) or not isinstance(payload.get('data'), dict):
        return 'unknown', None
    page = payload['data']
    if page.get('type') != 'status_page' or not isinstance(page.get('attributes'), dict):
        return 'unknown', None
    rows = payload.get('included')
    if not isinstance(rows, list):
        return 'unknown', None
    found = {}
    for row in rows:
        if not isinstance(row, dict) or row.get('type') != 'status_page_resource':
            continue
        attrs = row.get('attributes')
        if not isinstance(attrs, dict) or attrs.get('public_name') not in components:
            continue
        name = attrs['public_name']
        if name in found:
            return 'unknown', None
        state = attrs.get('status')
        if state not in ('operational', 'degraded', 'downtime', 'maintenance', 'not_monitored') or attrs.get('status_not_updated_since'):
            state = 'unknown'
        found[name] = state
    if set(found) != set(components):
        return 'unknown', None
    values = set(found.values())
    state = 'failed' if 'downtime' in values else 'degraded' if 'degraded' in values else 'unknown' if values & {'unknown', 'not_monitored'} else 'maintenance' if 'maintenance' in values else 'up'
    return state, {'source': 'tebex_official', 'components': found}


def probe(service):
    started = time.monotonic()
    code = None
    state = 'failed'
    metadata = None
    try:
        req = urllib.request.Request(service['url'], headers={'User-Agent': 'SMDZ-Studios-Uptime/1.1', 'Accept': 'application/json' if 'invite' in service or service.get('json_probe') or service.get('status_probe') else 'text/html,*/*'})
        with urllib.request.urlopen(req, timeout=15) as response:
            code = response.status
            state = http_state(code, response.headers)
            if service.get('status_probe') == 'tebex':
                state = 'unknown'
                if 200 <= code < 300 and http_state(code, response.headers) == 'up':
                    try:
                        state, metadata = validate_tebex_status(json.loads(response.read(4_000_000)), service['components'])
                    except (ValueError, TypeError):
                        pass
            elif service.get('json_probe') and state == 'up':
                try:
                    payload = json.loads(response.read(262144))
                    state, metadata = validate_worker_probe(service['json_probe'], payload)
                except (ValueError, TypeError):
                    state = 'unknown'
            elif 'invite' in service and state == 'up':
                try:
                    payload = json.loads(response.read(131072))
                    state = 'up' if isinstance(payload, dict) and payload.get('code') == service['invite'] and payload.get('guild') else 'failed'
                except (ValueError, TypeError):
                    state = 'unknown'
            elif service.get('page_probe') and state == 'up':
                state = 'up' if code == 200 and response.read(8192).strip() else 'unknown'
    except urllib.error.HTTPError as exc:
        code = exc.code
        state = http_state(code, exc.headers)
    except (OSError, ValueError):
        state = 'failed'
    if service.get('status_probe') == 'tebex' and metadata is None:
        state = 'unknown'
    sample = [state, round((time.monotonic()-started)*1000), code]
    return sample + [metadata] if metadata is not None else sample


def main():
    config = json.loads(pathlib.Path(sys.argv[1]).read_text())
    destination = pathlib.Path(sys.argv[2])
    now = int(time.time())
    previous = json.loads(destination.read_text()) if destination.exists() else {'services': {}}
    if not isinstance(previous.get('services'), dict):
        raise ValueError('Invalid existing history')
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
        results = dict(zip(config, executor.map(probe, config.values())))
    services = {name: [sample for sample in rows if now-366*86400 <= sample[0] <= now] for name, rows in previous['services'].items() if name not in config and isinstance(rows, list)}
    for name, result in results.items():
        samples = [sample for sample in previous['services'].get(name, []) if now-366*86400 <= sample[0] <= now]
        if samples and samples[-1][0] == now:
            samples.pop()
        samples.append([now, *result])
        services[name] = samples
        print(name, *result)
    data = {'version': 1, 'updated': now, 'intervalMinutes': 10, 'services': services}
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix('.tmp')
    temporary.write_text(json.dumps(data, separators=(',', ':'))+'\n')
    temporary.replace(destination)


if __name__ == '__main__':
    main()
