"""Offline unit tests for the deployment asset probe (no external requests)."""
import importlib.util
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('full_site_acceptance',Path(__file__).with_name('full_site_acceptance.py'))
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class FakeResponse:
    def __init__(self,status,body,content_type='application/octet-stream'):
        self.status=status
        self._body=body
        self.headers={'content-type':content_type}
    def body(self): return self._body

class FakeRequest:
    def __init__(self,fixtures): self.fixtures=fixtures
    def get(self,url,headers=None,timeout=None):
        return self.fixtures[url.rsplit('/',1)[-1]]

class AssetProbeTests(unittest.TestCase):
    def test_magic_signatures_detect_expected_first_party_media(self):
        self.assertTrue(mod.has_signature(b'\x00\x00\x00\x18ftypisom\x00\x00', 'mp4'))
        self.assertTrue(mod.has_signature(b'\xff\xd8\xff\xe0JPEG', 'jpeg'))
        self.assertTrue(mod.has_signature(b'%PDF-1.7\nfoo', 'pdf'))
        self.assertTrue(mod.has_signature(b'RIFF\x00\x00\x00\x00WEBP', 'webp'))
    def test_html_rewrite_cannot_masquerade_as_present_media(self):
        body=b'<!doctype html><html><body>Welcome</body></html>'
        for kind in ['mp4','jpeg','pdf','webp']:
            self.assertFalse(mod.has_signature(body,kind),kind)
    def test_static_media_probe_reports_status_and_payload_errors(self):
        fixtures={}
        valid={
            'mp4':b'\x00\x00\x00\x18ftypisom'+b'\x00'*16,
            'jpeg':b'\xff\xd8\xff\xe0JPEG',
            'pdf':b'%PDF-1.7\n',
            'webp':b'RIFF\x00\x00\x00\x00WEBP',
        }
        for path,kind in mod.STATIC_ASSETS:
            fixtures[path.rsplit('/',1)[-1]]=FakeResponse(206,valid[kind])
        report={'static_assets':[]}
        self.assertEqual(mod.probe_static_assets(FakeRequest(fixtures),'http://127.0.0.1:4173',report),0)
        self.assertEqual(len(report['static_assets']),10)
        self.assertTrue(all(entry['ok'] for entry in report['static_assets']))
        fixtures['mulyankan-system-walkthrough-presenter.mp4']=FakeResponse(200,b'<html>SPA fallback</html>','text/html')
        report={'static_assets':[]}
        self.assertEqual(mod.probe_static_assets(FakeRequest(fixtures),'http://127.0.0.1:4173',report),1)
        self.assertFalse(report['static_assets'][0]['ok'])
    def test_unknown_asset_type_rejected(self):
        with self.assertRaises(ValueError): mod.has_signature(b'file','unknown')

if __name__=='__main__':unittest.main()
