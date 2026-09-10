// Real-data release smoke. Never treats mock attempts as production evidence.
const api = process.env.E2E_API_URL || 'https://quiz-api.seek.mn/api/v1';
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
const assessmentId = process.env.E2E_ASSESSMENT_ID;
if (!email || !password || !assessmentId) throw new Error('E2E_EMAIL, E2E_PASSWORD and a real E2E_ASSESSMENT_ID are required');
const origin = process.env.E2E_BASE_URL || 'https://seek.mn';
async function request(path, options = {}) {
  const response = await fetch(`${api}${path}`, {...options, headers:{Origin:origin,'Content-Type':'application/json',...options.headers}, signal:AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}
const login = await request('/auth/login', {method:'POST',body:JSON.stringify({email,password})});
const token = login.accessToken;
if (!token) throw new Error('Login did not return an access token');
const headers = {Authorization:`Bearer ${token}`};
await request('/profile/me', {headers});
await request('/assessment/catalog', {headers});
const attempt = await request('/execution/attempts', {method:'POST',headers,body:JSON.stringify({assessmentId,idempotencyKey:`release-smoke-${crypto.randomUUID()}`})});
if (!attempt.attemptId || attempt.attemptId.startsWith('mock')) throw new Error('A real attempt was not created');
const runtime = await request(`/execution/session/${encodeURIComponent(attempt.attemptId)}`, {headers});
if (runtime.session?.userId === 'candidate-001' || runtime.session?.encryptedPayload?.encryptedContent === 'mock.encrypted.payload') throw new Error('Demo runtime returned in production');
console.log('Login, profile, catalog and real attempt smoke passed. Browser autosave/submit and recovery tests remain separate release gates.');
