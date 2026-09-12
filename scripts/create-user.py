#!/usr/bin/env python3
"""Interactively create SUPER_ADMIN or ASSESSOR in the production auth service."""
import argparse
import getpass
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--role', required=True, choices=['SUPER_ADMIN', 'ASSESSOR'])
    args = parser.parse_args()
    email = input('Email: ').strip()
    password = getpass.getpass('Password (16+ characters, max 72 UTF-8 bytes): ')
    if password != getpass.getpass('Repeat password: '):
        print('Passwords do not match.', file=sys.stderr); return 1
    if len(password) < 16 or len(password.encode('utf-8')) > 72:
        print('Password length is invalid.', file=sys.stderr); return 1
    # Run the current repository version; no rebuild/restart or credential file needed.
    code = (ROOT / 'scripts/bootstrap-admin.cjs').read_text()
    code += '\nif (require.main !== module) main();\n'
    result = subprocess.run([
        'docker', 'compose', '--env-file', str(ROOT / '.env.production'),
        '-f', str(ROOT / 'docker-compose.prod.yml'), 'exec', '-T', 'auth',
        'node', '-e', code,
    ], input=json.dumps({'email':email,'password':password,'role':args.role}), text=True, cwd=ROOT)
    return result.returncode

if __name__ == '__main__':
    try: raise SystemExit(main())
    except (KeyboardInterrupt, EOFError): raise SystemExit('Cancelled.')
