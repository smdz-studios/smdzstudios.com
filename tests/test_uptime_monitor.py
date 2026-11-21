import pathlib
import sys
import unittest
import urllib.error
from unittest.mock import patch

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools'))
import uptime_monitor as monitor


def tebex_payload(webstores='operational', checkout='operational'):
    return {
        'data': {'type': 'status_page', 'attributes': {}},
        'included': [
            {'type': 'status_page_resource', 'attributes': {'public_name': 'Webstores', 'status': webstores}},
            {'type': 'status_page_resource', 'attributes': {'public_name': 'Checkout', 'status': checkout}},
        ],
    }


class Response:
    def __init__(self, body=b'OK', status=200):
        self.status = status
        self.headers = {}
        self.body = body

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def read(self, _limit=None):
        return self.body


class MonitorTests(unittest.TestCase):
    def test_http_classification(self):
        self.assertEqual(monitor.http_state(200, {}), 'up')
        self.assertEqual(monitor.http_state(500, {}), 'failed')
        self.assertEqual(monitor.http_state(403, {}), 'unknown')
        self.assertEqual(monitor.http_state(429, None), 'unknown')
        self.assertEqual(monitor.http_state(200, {'cf-mitigated': 'challenge'}), 'unknown')

    def test_rewards_disabled_is_not_outage(self):
        self.assertEqual(monitor.validate_worker_probe('rewards', {'ok': True, 'enabled': False}), ('up', {'enabled': False}))
        self.assertEqual(monitor.validate_worker_probe('rewards', {'ok': True, 'enabled': 1}), ('unknown', None))

    def test_giveaways_empty_is_not_outage(self):
        state, extra = monitor.validate_worker_probe('giveaways', {'ok': True, 'giveaways': []})
        self.assertEqual((state, extra), ('up', {'active': 0}))

    def test_official_tebex_components(self):
        cases = [
            (('operational', 'operational'), 'up'),
            (('operational', 'degraded'), 'degraded'),
            (('operational', 'maintenance'), 'maintenance'),
            (('operational', 'downtime'), 'failed'),
            (('not_monitored', 'operational'), 'unknown'),
        ]
        for (webstores, checkout), expected in cases:
            with self.subTest(webstores=webstores, checkout=checkout):
                state, metadata = monitor.validate_tebex_status(tebex_payload(webstores, checkout), ['Webstores', 'Checkout'])
                self.assertEqual(state, expected)
                self.assertEqual(metadata['components']['Checkout'], checkout)

    def test_tebex_rejects_missing_and_duplicate_components(self):
        payload = tebex_payload()
        payload['included'] = payload['included'][:1]
        self.assertEqual(monitor.validate_tebex_status(payload, ['Webstores', 'Checkout']), ('unknown', None))
        payload = tebex_payload()
        payload['included'].append(payload['included'][0])
        self.assertEqual(monitor.validate_tebex_status(payload, ['Webstores', 'Checkout']), ('unknown', None))

    @patch.object(monitor.urllib.request, 'urlopen', return_value=Response())
    def test_nonempty_page(self, _urlopen):
        sample = monitor.probe({'url': 'https://example.invalid/', 'page_probe': True})
        self.assertEqual(sample[0], 'up')
        self.assertEqual(sample[2], 200)

    @patch.object(monitor.urllib.request, 'urlopen', side_effect=urllib.error.HTTPError('https://example.invalid', 403, 'Forbidden', None, None))
    def test_blocked_page_not_marked_failed(self, _urlopen):
        sample = monitor.probe({'url': 'https://example.invalid/', 'page_probe': True})
        self.assertEqual(sample[0], 'unknown')
        self.assertEqual(sample[2], 403)


if __name__ == '__main__':
    unittest.main()
