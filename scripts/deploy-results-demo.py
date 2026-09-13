"""Deploy the verified portal-only results UI; preserve service and data state."""
import json, subprocess, datetime, re, os
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
EVIDENCE=ROOT/'.production/evidence/results-demo'
IMAGE='seek-portal-web:results-demo-complete-20260912'
def run(args,**kwargs):return subprocess.run(args,cwd=ROOT,check=True,**kwargs)
def snapshot():
 ids=subprocess.check_output(['docker','ps','-q','--filter','label=com.docker.compose.project=seek'],text=True).split()
 return {r['Config']['Labels']['com.docker.compose.service']:{'id':r['Id'],'image':r['Config']['Image'],'health':r['State'].get('Health',{}).get('Status')} for r in json.loads(subprocess.check_output(['docker','inspect',*ids]))}
def main():
 gate=json.loads((EVIDENCE/'release-verified.json').read_text())
 actual=json.loads(subprocess.check_output(['docker','image','inspect',IMAGE]))[0]['Id']
 assert gate.get('verified') and gate.get('imageId')==actual,'Exact release image must pass verification'
 before=snapshot(); assert len(before)==14 and all(r['health']=='healthy' for r in before.values())
 backup=EVIDENCE/('production-before-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d-%H%M%S'));backup.mkdir(mode=0o700)
 (backup/'services.json').write_text(json.dumps(before,indent=2))
 p=ROOT/'.env.production';original=p.read_text();(backup/'env-before').write_text(original);os.chmod(backup/'env-before',0o600)
 assert len(re.findall(r'^SEEK_PORTAL_IMAGE=.*$',original,re.M))==1
 p.write_text(re.sub(r'^SEEK_PORTAL_IMAGE=.*$','SEEK_PORTAL_IMAGE='+IMAGE,original,flags=re.M))
 compose=['docker','compose','--env-file','.env.production','-f','docker-compose.prod.yml','up','-d','--no-deps','--no-build','--pull','never','--wait','--wait-timeout','120','portal-web']
 try:
  run(['python3','scripts/preflight-production.py']);run(compose)
  after=snapshot();assert len(after)==14 and all(r['health']=='healthy' for r in after.values())
  assert all(after[k]['id']==v['id'] for k,v in before.items() if k!='portal-web')
  (EVIDENCE/'production-result.json').write_text(json.dumps({'backup':str(backup),'services':after},indent=2))
  print('PASS: only portal-web replaced; all 14 services healthy; previous configuration preserved at',backup.name)
 except Exception:
  p.write_text(original);run(compose);raise
if __name__=='__main__':main()
