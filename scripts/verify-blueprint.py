import json,subprocess,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def row(name):
 r=json.loads(subprocess.check_output(['docker','inspect',name]))[0]
 assert r['Config']['Labels']['com.docker.compose.project']=='seek-verify'
 return r
def env(name):return dict(v.split('=',1) for v in row(name)['Config']['Env'])
x={'environment':'seek-verify','assessmentUrl':env('seek-verify-assessment-1')['ASSESSMENT_DATABASE_URL'],'browser':'--browser' in sys.argv}
if '--migrate' in sys.argv:
 subprocess.run(['docker','exec','-e','ASSESSMENT_DATABASE_URL='+x['assessmentUrl'],'seek-check','sh','-c','cd /app/services/assessment && pnpm exec prisma migrate deploy'],check=True)
if x['browser']:
 x['authUrl']=env('seek-verify-auth-1')['DATABASE_URL']
 x['verificationAddress']=json.loads(subprocess.check_output(['docker','inspect','seek-verify-tls']))[0]['NetworkSettings']['Networks']['seek-verify_backend']['IPAddress']
 subprocess.run(['docker','cp',str(root/'scripts/test-blueprint-browser.cjs'),'seek-check:/app/scripts/test-blueprint-browser.cjs'],check=True)
subprocess.run(['docker','cp',str(root/'scripts/test-blueprint-workflow.cjs'),'seek-check:/app/scripts/test-blueprint-workflow.cjs'],check=True)
r=subprocess.run(['docker','exec','-i','-e','TS_NODE_PROJECT=/app/services/assessment/tsconfig.json','seek-check','node','/app/scripts/test-blueprint-workflow.cjs'],input=json.dumps(x),text=True)
raise SystemExit(r.returncode)
