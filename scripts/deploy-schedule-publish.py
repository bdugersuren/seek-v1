"""Deploy the verified assessment-only publication fix; retain all data and other services."""
import datetime,json,os,re,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
EVIDENCE=ROOT/'.production/evidence/schedule-publish'
IMAGE='seek-backend:schedule-publish-20260913'
def run(args,**kw): return subprocess.run(args,cwd=ROOT,check=True,**kw)
def snapshot():
 ids=subprocess.check_output(['docker','ps','-q','--filter','label=com.docker.compose.project=seek'],text=True).split()
 return {r['Config']['Labels']['com.docker.compose.service']:{'id':r['Id'],'image':r['Config']['Image'],'imageId':r['Image'],'health':r['State'].get('Health',{}).get('Status')} for r in json.loads(subprocess.check_output(['docker','inspect',*ids]))}
def main():
 gate=json.loads((EVIDENCE/'release-verified.json').read_text())
 assert gate['verified'] and gate['imageId']==json.loads(subprocess.check_output(['docker','image','inspect',IMAGE]))[0]['Id']
 before=snapshot();assert len(before)==14 and all(r['health']=='healthy' for r in before.values())
 backup=EVIDENCE/('production-before-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d-%H%M%S'));backup.mkdir(mode=0o700)
 (backup/'services.json').write_text(json.dumps(before,indent=2))
 with (backup/'assessment.dump').open('wb') as f: run(['docker','exec','seek-postgres-1','pg_dump','-U','seek_admin','-d','assessment_db','-Fc'],stdout=f)
 os.chmod(backup/'assessment.dump',0o600)
 config=ROOT/'.env.production';original=config.read_text();(backup/'env-before').write_text(original);os.chmod(backup/'env-before',0o600)
 assert re.search('^SEEK_ASSESSMENT_IMAGE=',original,re.M)
 compose=['docker','compose','--env-file','.env.production','-f','docker-compose.prod.yml']
 config.write_text(re.sub('^SEEK_ASSESSMENT_IMAGE=.*$','SEEK_ASSESSMENT_IMAGE='+IMAGE,original,flags=re.M))
 try:
  run(['python3','scripts/preflight-production.py'])
  run(compose+['up','-d','--no-deps','--no-build','--pull','never','--wait','--wait-timeout','120','assessment'])
  after=snapshot();assert set(after)==set(before) and all(r['health']=='healthy' for r in after.values())
  assert after['assessment']['imageId']==gate['imageId']
  assert all(after[k]['id']==r['id'] for k,r in before.items() if k!='assessment')
  (EVIDENCE/'production-result.json').write_text(json.dumps({'backup':str(backup),'services':after},indent=2))
  print('PASS assessment-only rollout; all 14 services healthy; 13 unrelated containers unchanged. No migration or schedule publication performed.')
 except Exception:
  config.write_text(original)
  run(compose+['up','-d','--no-deps','--no-build','--pull','never','--wait','--wait-timeout','120','assessment'])
  raise
if __name__=='__main__': main()
