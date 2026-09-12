#!/usr/bin/env python3
"""Read-only production checks. Never prints expanded configuration or secrets."""
import argparse
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
INGRESS = {'portal-web': ('seek-portal-web', 8081), 'assessment-web': ('seek-assessment-web', 8082), 'gateway': ('seek-gateway', 3010), 'minio': ('seek-minio', 9000)}

def run(*args):
    return subprocess.run(args, cwd=ROOT, capture_output=True, text=True)

def validate_model(model):
    errors = []
    if model.get('name') != 'seek': errors.append('Compose project must be seek, not verification')
    services = model['services']
    exposed = {name for name, service in services.items() if 'proxy_net' in service.get('networks', {})}
    if exposed != set(INGRESS): errors.append('Exactly four production ingress services must join proxy_net')
    if any(s.get('ports') for s in services.values()): errors.append('Production services must not publish host ports')
    for name, (alias, _) in INGRESS.items():
        if alias not in services.get(name, {}).get('networks', {}).get('proxy_net', {}).get('aliases', []): errors.append('Missing production alias: ' + alias)
    if services.get('auth', {}).get('environment', {}).get('AUTH_EMAIL_DELIVERY_MODE') != 'smtp': errors.append('Production auth must use real SMTP')
    return errors

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--env-file', type=Path, default=ROOT / '.env.production')
    args = p.parse_args()
    failures = []
    if not args.env_file.is_file():
        print('FAIL: production environment file missing'); return 1
    if args.env_file.stat().st_mode & 0o077: failures.append('Production environment file must have mode 0600')
    # Capture expanded config in memory; never print it or raw Compose errors.
    raw = run('docker','compose','--env-file',str(args.env_file),'-f','docker-compose.prod.yml','config','--format','json')
    if raw.returncode:
        # Compose errors can contain substituted data; emit only a generic diagnostic.
        failures.append('Compose validation failed; required production settings may be missing (check SMTP_HOST, SMTP_USER, SMTP_PASSWORD)')
    else:
        model = json.loads(raw.stdout)
        failures.extend(validate_model(model))
        for image in sorted({s['image'] for s in model['services'].values() if s.get('image')}):
            if run('docker','image','inspect',image).returncode: failures.append('Required image is not available locally: '+image)
    network = run('docker','network','inspect','proxy_net')
    if network.returncode: failures.append('External proxy_net is missing')
    else:
        n=json.loads(network.stdout)[0]
        if n['IPAM']['Config'] != [{'Subnet':'172.20.0.0/16','IPRange':'172.20.240.0/20','Gateway':'172.20.0.1'}]: failures.append('proxy_net IPAM mismatch')
    npm = run('docker','inspect','infra-npm')
    if npm.returncode: failures.append('infra-npm is missing')
    else:
        n=json.loads(npm.stdout)[0]
        if not n['State']['Running'] or n['State'].get('Health',{}).get('Status') != 'healthy': failures.append('infra-npm is not healthy')
    for problem in failures: print('FAIL:',problem)
    if not failures: print('PASS: infrastructure preflight. This does not certify application release readiness, SMTP delivery or data migration.')
    return int(bool(failures))

if __name__ == '__main__': raise SystemExit(main())
