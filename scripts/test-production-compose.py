#!/usr/bin/env python3
import json
import os
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
KEYS = ['KMS_SECRET','POSTGRES_PASSWORD','REDIS_PASSWORD','RABBITMQ_DEFAULT_PASS','MINIO_ROOT_PASSWORD','AUTH_JWT_SECRET','SMTP_HOST','SMTP_USER','SMTP_PASSWORD']
def render(missing=None):
    env = dict(os.environ)
    for key in KEYS:
        env[key] = 'integration-only-0123456789abcdef0123456789abcdef'
    if missing:
        env.pop(missing)
    return subprocess.run(['docker','compose','--env-file','/dev/null','-f',str(ROOT/'docker-compose.prod.yml'),'config','--format','json'], env=env,capture_output=True,text=True)
class ProductionComposeTests(unittest.TestCase):
    def test_network_and_runtime_boundaries(self):
        result=render(); self.assertEqual(result.returncode,0,result.stderr)
        model=json.loads(result.stdout); services=model['services']
        self.assertNotIn('nginx-proxy',services); self.assertNotIn('node-modules-init',services)
        ingress={name for name,s in services.items() if 'proxy_net' in s.get('networks',{})}
        self.assertEqual(ingress,{'portal-web','assessment-web','gateway','minio'})
        for name,s in services.items():
            self.assertFalse(s.get('ports'),name)
            env=s.get('environment',{})
            self.assertNotEqual(env.get('NODE_TLS_REJECT_UNAUTHORIZED'),'0')
            self.assertNotEqual(env.get('RUN_SEED'),'true')
            if 'build' in s:
                self.assertEqual(env.get('NODE_ENV'),'production',name)
                self.assertFalse(s.get('volumes'),name)
        for name in ['auth','profile','organisation','assessment','execution','file']:
            self.assertEqual(services[name]['depends_on'][name+'-migrate']['condition'],'service_completed_successfully')
    def test_each_secret_is_mandatory(self):
        for key in KEYS:
            with self.subTest(key=key):
                self.assertNotEqual(render(missing=key).returncode,0)
if __name__=='__main__':unittest.main()
