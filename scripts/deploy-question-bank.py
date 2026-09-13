"""Deploy only the four verified question-bank services; never reset data."""
import datetime
import json
import os
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / '.production/evidence/question-bank'
IMAGES = {
    'assessment': ('SEEK_ASSESSMENT_IMAGE', 'seek-backend:question-bank-release-20260912'),
    'execution': ('SEEK_EXECUTION_IMAGE', 'seek-backend:question-bank-release-20260912'),
    'portal-web': ('SEEK_PORTAL_IMAGE', 'seek-portal-web:question-bank-complete-20260912'),
    'assessment-web': ('SEEK_ASSESSMENT_WEB_IMAGE', 'seek-assessment-web:question-bank-release-20260912'),
}

def run(args, **kwargs):
    return subprocess.run(args, cwd=ROOT, check=True, **kwargs)

def snapshot():
    ids = subprocess.check_output(['docker','ps','-q','--filter','label=com.docker.compose.project=seek'], text=True).split()
    rows = json.loads(subprocess.check_output(['docker','inspect',*ids]))
    return {row['Config']['Labels']['com.docker.compose.service']: {
        'id':row['Id'], 'image':row['Config']['Image'],
        'health':row['State'].get('Health',{}).get('Status'),
    } for row in rows}

def main():
    gate = json.loads((EVIDENCE / 'release-verified.json').read_text())
    if not gate.get('verified'):
        raise RuntimeError('Release verification is not complete')
    for _, image in IMAGES.values():
        actual = json.loads(subprocess.check_output(['docker','image','inspect',image]))[0]['Id']
        if gate['images'].get(image) != actual:
            raise RuntimeError('Verified image does not match: '+image)
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d-%H%M%S')
    backup = EVIDENCE / ('production-before-'+stamp)
    backup.mkdir(parents=True, mode=0o700)
    before = snapshot()
    (backup/'services.json').write_text(json.dumps(before,indent=2))
    for database, table in [('assessment_db','question'),('execution_db','quiz_attempt')]:
        path=backup/(database+'.dump')
        with path.open('wb') as output:
            run(['docker','exec','seek-postgres-1','pg_dump','-U','seek_admin','-d',database,'-Fc'],stdout=output)
        os.chmod(path,0o600)
        temporary='qb_check_'+database+'_'+stamp.replace('-','_')
        run(['docker','exec','seek-verify-postgres-1','createdb','-U','seek_admin',temporary])
        try:
            with path.open('rb') as source:
                run(['docker','exec','-i','seek-verify-postgres-1','pg_restore','-U','seek_admin','--no-owner','--no-acl','--exit-on-error','-d',temporary],stdin=source)
            with (backup/(database+'-restore.txt')).open('w') as output:
                run(['docker','exec','seek-verify-postgres-1','psql','-U','seek_admin','-d',temporary,'-Atc','SELECT count(*) FROM '+table],stdout=output)
        finally:
            assert temporary.startswith('qb_check_')
            run(['docker','exec','seek-verify-postgres-1','dropdb','-U','seek_admin',temporary])
    config=ROOT/'.env.production'
    original=config.read_text()
    shutil.copyfile(config,backup/'env-before')
    os.chmod(backup/'env-before',0o600)
    updated=original
    for key,image in IMAGES.values():
        if re.search('^'+key+'=',updated,re.M):
            updated=re.sub('^'+key+'=.*$',key+'='+image,updated,flags=re.M)
        else:
            updated+='\n'+key+'='+image+'\n'
    compose=['docker','compose','--env-file','.env.production','-f','docker-compose.prod.yml']
    config.write_text(updated)
    try:
        run(['python3','scripts/preflight-production.py'])
        run(compose+['up','-d','--no-deps','--no-build','--pull','never','--wait','--wait-timeout','120',*IMAGES])
        after=snapshot()
        for name, row in before.items():
            if name not in IMAGES and after.get(name,{}).get('id')!=row['id']:
                raise RuntimeError('An unrelated service changed: '+name)
        if any(row['health']!='healthy' for row in after.values()):
            raise RuntimeError('Production service is not healthy')
        (EVIDENCE/'production-result.json').write_text(json.dumps({'backup':str(backup),'services':after},indent=2))
        print('Deployed four verified services. All',len(after),'production services healthy. Backup:',backup.name)
    except Exception:
        active=subprocess.check_output(['docker','exec','seek-postgres-1','psql','-U','seek_admin','-d','execution_db','-Atc',"SELECT count(*) FROM quiz_attempt a WHERE a.status IN ('CREATED','IN_PROGRESS') AND EXISTS (SELECT 1 FROM attempt_question q WHERE q.\"attemptId\"=a.id AND q.\"questionTypeCodeSnapshot\" IN ('matching','matrix'))"],text=True).strip()
        if active!='0':
            raise RuntimeError('New structured attempts are active; preserve the new runtime and repair forward')
        config.write_text(original)
        run(compose+['up','-d','--no-deps','--no-build','--pull','never','--wait','--wait-timeout','120',*IMAGES])
        raise

if __name__=='__main__':
    main()
