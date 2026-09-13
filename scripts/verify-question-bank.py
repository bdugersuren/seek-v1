import subprocess,json,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def env(name):
 row=json.loads(subprocess.check_output(['docker','inspect',name]))[0]
 assert row['Config']['Labels'].get('com.docker.compose.project')=='seek-verify', 'Verification containers only'
 return dict(x.split('=',1) for x in row['Config']['Env'])
x={'environment':'seek-verify','assessmentUrl':env('seek-verify-assessment-1')['ASSESSMENT_DATABASE_URL'],'executionUrl':env('seek-verify-execution-1')['EXECUTION_DATABASE_URL']}
subprocess.run(['docker','cp',str(root/'scripts/test-question-bank.cjs'),'seek-check:/app/scripts/test-question-bank.cjs'],check=True)
x['browser']='--browser' in sys.argv
if x['browser']:
 x['authUrl']=env('seek-verify-auth-1')['DATABASE_URL']
 x['verificationAddress']=json.loads(subprocess.check_output(['docker','inspect','seek-verify-tls']))[0]['NetworkSettings']['Networks']['seek-verify_backend']['IPAddress']
 subprocess.run(['docker','cp',str(root/'scripts/test-question-bank-browser.cjs'),'seek-check:/app/scripts/test-question-bank-browser.cjs'],check=True)
p=subprocess.run(['docker','exec','-i','-e','TS_NODE_PROJECT=/app/services/assessment/tsconfig.json','seek-check','node','/app/scripts/test-question-bank.cjs'],input=json.dumps(x),text=True)
raise SystemExit(p.returncode)
