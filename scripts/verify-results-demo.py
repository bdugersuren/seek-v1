import json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def inspect(name):
 return json.loads(subprocess.check_output(['docker','inspect',name]))[0]
auth=inspect('seek-verify-auth-1')
assert auth['Config']['Labels']['com.docker.compose.project']=='seek-verify'
env=dict(x.split('=',1) for x in auth['Config']['Env'])
x={'environment':'seek-verify','authUrl':env['DATABASE_URL'],'verificationAddress':inspect('seek-verify-tls')['NetworkSettings']['Networks']['seek-verify_backend']['IPAddress'],'admin':json.loads((root/'.production/evidence/audience-ui/test-user.json').read_text())}
subprocess.run(['docker','cp',str(root/'scripts/test-results-demo.cjs'),'seek-check:/app/scripts/test-results-demo.cjs'],check=True)
r=subprocess.run(['docker','exec','-i','seek-check','node','/app/scripts/test-results-demo.cjs'],input=json.dumps(x),text=True)
raise SystemExit(r.returncode)
