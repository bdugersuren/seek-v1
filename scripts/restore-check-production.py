#!/usr/bin/env python3
"""Restore a downloaded backup into NEW isolated volumes. Never targets production.
Usage: python3 scripts/restore-check-production.py /absolute/path/to/snapshot
Containers/volumes are retained for inspection; printed identifiers are cleanup scope.
"""
import json
import os
from pathlib import Path
import secrets
import subprocess
import sys
import time

os.umask(0o077)
def run(args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)
def output(args):
    return subprocess.check_output(args, text=True).strip()

def main():
    if len(sys.argv) != 2:
        raise SystemExit('Pass the directory containing manifest.json, postgres.sql and minio.tar.gz')
    snapshot = Path(sys.argv[1]).resolve(strict=True)
    manifest = json.loads((snapshot / 'manifest.json').read_text())
    if manifest.get('databaseFormat') != 'pg_dumpall':
        raise SystemExit('Unsupported backup format')
    prefix = 'seek-restore-' + secrets.token_hex(6)
    postgres = prefix + '-postgres'
    network = prefix + '-network'
    run(['docker','network','create','--internal',network], stdout=subprocess.DEVNULL)
    env = dict(os.environ, POSTGRES_PASSWORD=secrets.token_hex(32))
    run(['docker','run','-d','--name',postgres,'--network',network,'-e','POSTGRES_PASSWORD',
         '-e','POSTGRES_USER=restore_admin','--mount',f'type=volume,src={prefix}-postgres-data,dst=/var/lib/postgresql/data',
         'postgres:15-alpine'], env=env, stdout=subprocess.DEVNULL)
    for _ in range(60):
        if subprocess.run(['docker','exec',postgres,'pg_isready','-h','127.0.0.1','-U','restore_admin'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0:
            break
        time.sleep(1)
    else:
        raise SystemExit('Restore postgres did not become ready: ' + postgres)
    with open(snapshot / 'postgres.sql','rb') as sql:
        run(['docker','exec','-i',postgres,'psql','-v','ON_ERROR_STOP=1','-U','restore_admin','-d','postgres'],stdin=sql,stdout=subprocess.DEVNULL)
    for service in manifest['stores']:
        if service not in ['minio','redis','rabbitmq']:
            raise SystemExit('Unexpected store in manifest')
        archive = snapshot / (service + '.tar.gz')
        if not archive.is_file():
            raise SystemExit('Missing archive: ' + service)
        run(['docker','run','--rm','--network','none','--mount',f'type=bind,src={archive},dst=/backup.tar.gz,readonly',
             '--mount',f'type=volume,src={prefix}-{service}-data,dst=/restore','--entrypoint','tar','restic/restic:0.18.1',
             '-xzf','/backup.tar.gz','-C','/restore'])
    databases = output(['docker','exec',postgres,'psql','-U','restore_admin','-d','postgres','-Atc',"SELECT datname FROM pg_database WHERE NOT datistemplate ORDER BY datname"])
    print('Restored into isolated resources:', prefix)
    print('Databases:', databases.replace('\n', ', '))
    print('Archive extraction and SQL restore passed. Application/object-content checks must also pass before accepting recovery.')

if __name__ == '__main__':
    main()
