#!/usr/bin/env python3
"""Consistent PostgreSQL/MinIO/Redis/RabbitMQ backup to encrypted remote restic.
Requires .production/backup.env, a previously initialized remote repository.
Briefly stops running SEEK writers and object/queue stores; always restarts them.
"""
import datetime
import fcntl
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

os.umask(0o077)

ROOT = Path(__file__).resolve().parents[1]
ENV = ROOT / '.production/backup.env'
COMPOSE = ['docker', 'compose', '--env-file', str(ROOT / '.env.production'), '-f', str(ROOT / 'docker-compose.prod.yml')]

def run(args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)

def output(args):
    return subprocess.check_output(args, text=True).strip()

def main():
    if not ENV.exists() or ENV.stat().st_mode & 0o077:
        raise SystemExit('Create .production/backup.env with permissions 0600 first')
    config = dict(line.split('=', 1) for line in ENV.read_text().splitlines() if line and not line.startswith('#') and '=' in line)
    if not config.get('RESTIC_PASSWORD') or not config.get('RESTIC_REPOSITORY', '').startswith(('s3:', 'sftp:')):
        raise SystemExit('An encrypted, remote S3/SFTP restic repository is required')
    # This script supports S3 with env credentials. SFTP requires separately mounted SSH configuration.
    if config['RESTIC_REPOSITORY'].startswith('sftp:'):
        raise SystemExit('Use the S3 backend; SSH mount configuration is not configured')
    lock = open(ROOT / '.production/backup.lock', 'w')
    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    restic_image = config.get('RESTIC_IMAGE', 'restic/restic:0.18.1')
    restic = ['docker', 'run', '--rm', '--env-file', str(ENV), restic_image]
    # Confirm remote credentials before interrupting application traffic.
    run(restic + ['cat', 'config'], stdout=subprocess.DEVNULL)
    running = output(COMPOSE + ['ps', '--services', '--status', 'running']).splitlines()
    if 'postgres' not in running:
        raise SystemExit('Production postgres must be running')
    container_ids = {s: output(COMPOSE + ['ps', '-q', s]) for s in running}
    writers = [s for s in running if s not in ('postgres', 'minio', 'redis', 'rabbitmq') and not s.endswith('-migrate')]
    stores = [s for s in ('minio', 'redis', 'rabbitmq') if s in running]
    root = ROOT / '.backups'
    root.mkdir(mode=0o700, exist_ok=True)
    stage = Path(tempfile.mkdtemp(prefix='snapshot-', dir=root))
    stopped = []
    try:
        for group in (writers, stores):
            if group:
                stopped.extend(group)
                run(COMPOSE + ['stop', '-t', '60'] + group, stdout=subprocess.DEVNULL)
        with open(stage / 'postgres.sql', 'wb') as sql:
            run(COMPOSE + ['exec', '-T', 'postgres', 'sh', '-c', 'pg_dumpall -U "$POSTGRES_USER"'], stdout=sql)
        for service in stores:
            cid = output(COMPOSE + ['ps', '-a', '-q', service])
            mounts = json.loads(output(['docker', 'inspect', '--format', '{{json .Mounts}}', cid]))
            for mount in mounts:
                if mount['Type'] != 'volume':
                    continue
                volume = mount['Name']
                with open(stage / (service + '.tar.gz'), 'wb') as archive:
                    run(['docker','run','--rm','--network','none','--mount',f'type=volume,src={volume},dst=/source,readonly',
                         '--entrypoint','tar',restic_image,'-czf','-','-C','/source','.'], stdout=archive)
        (stage / 'manifest.json').write_text(json.dumps({'createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'stores':stores,'databaseFormat':'pg_dumpall','consistency':'all SEEK writers and stores stopped'}, indent=2))
    finally:
        # Start dependencies first, then only the workloads that were running before.
        for group in (stores, writers):
            if group and any(s in stopped for s in group):
                run(['docker', 'start'] + [container_ids[s] for s in group if s in stopped])
    try:
        run(['docker','run','--rm','--env-file',str(ENV),'--mount',f'type=bind,src={stage},dst=/snapshot,readonly',restic_image,
             'backup','--host','seek-production','--tag','seek-consistent','/snapshot'])
        run(restic + ['forget','--host','seek-production','--tag','seek-consistent','--keep-within','14d','--prune'])
        run(restic + ['check'])
    except Exception:
        print('Remote backup failed; protected local snapshot retained at', stage)
        raise
    else:
        shutil.rmtree(stage)
        print('Encrypted remote backup completed and checked.')

if __name__ == '__main__':
    main()
