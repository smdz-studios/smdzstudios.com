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


def probe(service):
    started = time.monotonic()
    code = None
    state = 'failed'
    metadata = None
    try:
        req = urllib.request.Request(service['url'], headers={'User-Agent': 'SMDZ-Studios-Uptime/1.1', 'Accept': 'application/json' if 'invite' in service or service.get('json_probe') else 'text/html,*/*'})
        with urllib.request.urlopen(req, timeout=15) as response:
            code = response.status
            state = http_state(code, response.headers)
            if service.get('json_probe') and state == 'up':
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
    services = {}
    for name, result in results.items():
        samples = [sample for sample in previous['services'].get(name, []) if now-90*86400 <= sample[0] <= now]
        if samples and samples[-1][0] == now:
            samples.pop()
        samples.append([now, *result])
        services[name] = samples
        print(name, *result)
    data = {'version': 1, 'updated': now, 'intervalMinutes': 60, 'services': services}
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix('.tmp')
    temporary.write_text(json.dumps(data, separators=(',', ':'))+'\n')
    temporary.replace(destination)


if __name__ == '__main__':
    main()
