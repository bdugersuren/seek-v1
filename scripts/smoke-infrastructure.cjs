// Run only on the isolated seek-verify network with Mailpit, never production.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const http = require('node:http');
function storage(url, method='GET', body) {
  return new Promise((resolve,reject) => {
    const req=http.request({hostname:'minio',port:9000,path:url.pathname+url.search,method,headers:{Host:url.host,...(body?{'Content-Length':body.length,'Content-Type':'application/pdf'}:{})}},res=>{
      const parts=[];res.on('data',part=>parts.push(part));res.on('end',()=>resolve({status:res.statusCode,body:Buffer.concat(parts)}));
    });
    req.on('error',reject);req.end(body);
  });
}
const api = 'http://gateway:3010/api/v1';
async function request(path, method='GET', body, token, expected=200, extra={}) {
  const response = await fetch(api+path,{method,headers:{Origin:'https://seek.mn','Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...extra},body:body===undefined?undefined:JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(10000)});
  if (response.status !== expected) {
    const detail = await response.text();
    throw new Error(`${method} ${path}: expected ${expected}, received ${response.status}: ${detail.slice(0,200)}`);
  }
  return response;
}
async function account() {
  const email=`smoke-${crypto.randomUUID()}@example.invalid`;
  const password=crypto.randomBytes(24).toString('hex');
  await request('/auth/register','POST',{email,password},null,201);
  const messages = await fetch('http://mailpit:8025/api/v1/messages').then(r=>r.json());
  const found = messages.messages.find(m=>m.To.some(to=>to.Address===email));
  assert(found, 'Mailpit must receive the verification email');
  const message = await fetch(`http://mailpit:8025/api/v1/message/${found.ID}`).then(r=>r.json());
  const match=(message.Text || '').match(/https:\/\/seek\.mn\/[^\s]*[?&]token=([^\s&]+)/);
  assert(match, 'Verification link must use the production portal origin');
  await request('/auth/verify-email','POST',{token:decodeURIComponent(match[1])});
  const response=await request('/auth/login','POST',{email,password},null,201);
  const cookie=response.headers.get('set-cookie') || '';
  assert(cookie.includes('Secure') && cookie.includes('HttpOnly') && cookie.includes('Domain=.seek.mn'));
  return (await response.json()).accessToken;
}
(async()=>{
  const owner=await account();
  const other=await account();
  await request('/profile/me','GET',undefined,owner);
  await request('/assessment/catalog','GET',undefined,owner);
  await request('/assessment/questions','GET',undefined,owner,403);
  await request('/profile/admin/verifications','GET',undefined,owner,403);
  await request('/auth/refresh','POST',{},null,403,{Origin:'https://attacker.invalid',Cookie:'refresh_token=invalid'});
  await request('/execution/attempts','POST',{assessmentId:'english-basic'},owner,503);
  await request('/execution/session/mock-attempt-001','GET',undefined,owner,404);
  const upload = await request('/file/presigned-upload','POST',{name:'smoke.pdf',type:'IDENTITY'},owner,201).then(r=>r.json());
  const signed = new URL(upload.uploadUrl);
  assert.equal(signed.origin,'https://files.seek.mn');
  const bytes=Buffer.from('%PDF-1.4\nSEEK isolated smoke\n%%EOF');
  const put=await storage(signed,'PUT',bytes);
  assert.equal(put.status,200,'Presigned upload must succeed with the original Host header');
  await request('/file/objects/verify','POST',{storageKey:upload.storageKey,sizeBytes:bytes.length,mimeType:'application/pdf'},owner,201);
  await request('/file/objects?storageKey='+encodeURIComponent(upload.storageKey),'GET',undefined,other,400);
  const redirect=await request('/file/objects?storageKey='+encodeURIComponent(upload.storageKey),'GET',undefined,owner,302);
  const download=new URL(redirect.headers.get('location'));
  const get=await storage(download);
  assert.equal(get.status,200);assert.deepEqual(get.body,bytes);
  download.searchParams.set('X-Amz-Signature','invalid');
  const bad=await storage(download);
  assert(bad.status>=400,'Modified signatures must be rejected');
  await request('/file/objects','DELETE',{storageKey:upload.storageKey},owner,200);
  console.log('PASS: SMTP verification, login/cookie, profile/catalog, CSRF, authoring denial, mock denial, presigned upload/download, cross-user denial, signature rejection. Public HTTPS and real assessment lifecycle remain unverified.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
