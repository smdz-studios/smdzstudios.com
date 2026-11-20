import concurrent.futures
import json
import pathlib
import sys
import time
import urllib.error
import urllib.request


def probe(service):
    started = time.monotonic()
    code = None
    state = 'failed'
    try:
        req = urllib.request.Request(service['url'], headers={'User-Agent': 'SMDZ-Studios-Uptime/1.0', 'Accept': 'application/json' if 'invite' in service else 'text/html,*/*'})
        with urllib.request.urlopen(req, timeout=15) as response:
            code = response.status
            state = 'up' if 200 <= code < 300 else 'failed'
            if 'invite' in service:
                payload = json.loads(response.read(131072))
                state = 'up' if state == 'up' and payload.get('code') and payload.get('guild') else 'failed'
    except urllib.error.HTTPError as exc:
        code = exc.code
        state = 'unknown' if code in (401, 403, 429) else 'failed'
    except (OSError, ValueError):
        pass
    return [state, round((time.monotonic()-started)*1000), code]


def main():
    config = json.loads(pathlib.Path(sys.argv[1]).read_text())
    destination = pathlib.Path(sys.argv[2])
    now = int(time.time())
    previous = json.loads(destination.read_text()) if destination.exists() else {'services': {}}
    if not isinstance(previous.get('services'), dict):
        raise ValueError('Invalid existing history')
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        results = dict(zip(config, executor.map(probe, config.values())))
    services = {}
    for name, result in results.items():
        samples = [sample for sample in previous['services'].get(name, []) if now-90*86400 <= sample[0] <= now]
        if samples and samples[-1][0] == now:
            samples.pop()
        samples.append([now, *result])
        services[name] = samples
        print(name, *result)
    data = {'version': 1, 'updated': now, 'intervalMinutes': 15, 'services': services}
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix('.tmp')
    temporary.write_text(json.dumps(data, separators=(',', ':'))+'\n')
    temporary.replace(destination)


if __name__ == '__main__':
    main()
