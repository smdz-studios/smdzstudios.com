import concurrent.futures
import json
import pathlib
import sys
import time
import urllib.error
import urllib.request


def contains_store_content(text, brand):
    text = ' '.join(text.casefold().split())
    return brand.casefold() in text and ('built for roleplay' in text or ('fivem' in text and 'redm' in text))


def http_state(code, headers):
    if headers.get('cf-mitigated', '').lower() == 'challenge' or code in (401, 403, 429):
        return 'unknown'
    return 'up' if 200 <= code < 300 else 'failed'


def browser_probe(service):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as engine:
        try:
            browser = engine.chromium.launch(headless=True, timeout=15000)
        except Exception:
            browser = engine.chromium.launch(channel='chrome', headless=True, timeout=15000)
        try:
            page = browser.new_page()
            response = page.goto(service['url'], wait_until='domcontentloaded', timeout=20000)
            if response is None:
                return 'unknown', None
            code = response.status
            state = http_state(code, response.headers)
            if state != 'up':
                return state, code
            from urllib.parse import urlsplit
            if urlsplit(page.url).hostname != urlsplit(service['url']).hostname:
                return 'unknown', code
            try:
                page.get_by_text('Built for Roleplay', exact=False).first.wait_for(timeout=5000)
            except Exception:
                pass
            text = page.locator('body').inner_text(timeout=5000)
            return ('up' if contains_store_content(text, service['expected_brand']) else 'unknown'), code
        finally:
            browser.close()


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


def catalog_probe(url):
    code = None
    try:
        request = urllib.request.Request(url, headers={'Accept': 'application/json', 'User-Agent': 'SMDZ-Studios-Uptime/1.2'})
        with urllib.request.urlopen(request, timeout=20) as response:
            code = response.status
            if http_state(code, response.headers) != 'up':
                return {'catalog': http_state(code, response.headers), 'catalogCode': code}
            content = response.read(4_000_001)
            if len(content) > 4_000_000:
                return {'catalog': 'unknown', 'catalogCode': code}
            payload = json.loads(content)
            if not isinstance(payload, dict):
                return {'catalog': 'unknown', 'catalogCode': code}
            source = payload.get('source')
            packages = payload.get('packages')
            count = payload.get('count')
            if payload.get('ok') is True and isinstance(source, dict) and source.get('publicHeadlessApi') is True and isinstance(packages, list) and type(count) is int and count == len(packages) and count >= 0:
                return {'catalog': 'up', 'catalogCode': code, 'catalogCount': count}
            return {'catalog': 'unknown', 'catalogCode': code}
    except urllib.error.HTTPError as exc:
        return {'catalog': http_state(exc.code, exc.headers), 'catalogCode': exc.code}
    except (OSError, ValueError, TypeError):
        return {'catalog': 'unknown', 'catalogCode': code}


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
                payload = json.loads(response.read(131072))
                state = 'up' if payload.get('code') and payload.get('guild') else 'failed'
            elif service.get('browser_fallback') and state == 'up':
                from html.parser import HTMLParser
                from urllib.parse import urlsplit
                class VisibleText(HTMLParser):
                    def __init__(self):
                        super().__init__()
                        self.parts = []
                        self.ignored = False
                    def handle_starttag(self, tag, attrs):
                        if tag in ('script', 'style'):
                            self.ignored = True
                    def handle_endtag(self, tag):
                        if tag in ('script', 'style'):
                            self.ignored = False
                    def handle_data(self, data):
                        if not self.ignored:
                            self.parts.append(data)
                parser = VisibleText()
                parser.feed(response.read(2_000_000).decode('utf-8', errors='replace'))
                if urlsplit(response.geturl()).hostname != urlsplit(service['url']).hostname or not contains_store_content(' '.join(parser.parts), service['expected_brand']):
                    state = 'unknown'
    except urllib.error.HTTPError as exc:
        code = exc.code
        state = http_state(code, exc.headers)
    except (OSError, ValueError):
        pass
    if service.get('browser_fallback') and state == 'unknown' and code not in (401, 429):
        initial_code = code
        try:
            state, browser_code = browser_probe(service)
            code = browser_code if browser_code is not None else initial_code
            print('Store browser probe:', state, code)
        except Exception as exc:
            print('Store browser probe unavailable:', type(exc).__name__)
    if service.get('catalog_url') and state != 'up':
        metadata = catalog_probe(service['catalog_url'])
        print('Store catalog probe:', metadata['catalog'], metadata['catalogCode'])
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
    data = {'version': 1, 'updated': now, 'intervalMinutes': 15, 'services': services}
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix('.tmp')
    temporary.write_text(json.dumps(data, separators=(',', ':'))+'\n')
    temporary.replace(destination)


if __name__ == '__main__':
    main()
