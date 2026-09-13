"""Run publication and candidate regression only in the isolated verification project."""
import json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def row(name):
 r=json.loads(subprocess.check_output(['docker','inspect',name]))[0]
 assert r['Config']['Labels']['com.docker.compose.project']=='seek-verify'
 return r
def env(name): return dict(v.split('=',1) for v in row(name)['Config']['Env'])
x={'environment':'seek-verify','assessmentUrl':env('seek-verify-assessment-1')['ASSESSMENT_DATABASE_URL'],'executionUrl':env('seek-verify-execution-1')['EXECUTION_DATABASE_URL'],'authUrl':env('seek-verify-auth-1')['DATABASE_URL'],'browser':True,'verificationAddress':json.loads(subprocess.check_output(['docker','inspect','seek-verify-tls']))[0]['NetworkSettings']['Networks']['seek-verify_backend']['IPAddress']}
for name in ['test-candidate-workflow.cjs','test-candidate-browser.cjs']:
 subprocess.run(['docker','cp',str(root/'scripts'/name),'seek-check:/app/scripts/'+name],check=True)
r=subprocess.run(['docker','exec','-i','-e','TS_NODE_PROJECT=/app/services/assessment/tsconfig.json','seek-check','node','/app/scripts/test-candidate-workflow.cjs'],input=json.dumps(x),text=True)
raise SystemExit(r.returncode)
