// Verification only. Private test credentials and DB URL arrive on stdin.
const assert=require('node:assert/strict'),fs=require('fs'),{createRequire}=require('module');
const input=JSON.parse(fs.readFileSync(0,'utf8'));
if(input.environment!=='seek-verify')throw Error('Verification only');
process.env.ASSESSMENT_DATABASE_URL=input.databaseUrl;
const r=createRequire('/app/services/assessment/package.json'),{PrismaClient}=r('./generated/prisma-client');
const p=new PrismaClient(),key='ACCESS_'+Date.now();let a,d,g,f,c,c2,t,dl,cl;const qids=[],bids=[],quizIds=[];
const base='http://gateway:3010/api/v1';
async function api(token,path,method='GET',body){const res=await fetch(base+path,{method,headers:{authorization:'Bearer '+token,Origin:'https://seek.mn','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return {status:res.status,data:await res.json().catch(()=>null)};}
async function login(credentials){const res=await fetch(base+'/auth/login',{method:'POST',headers:{Origin:'https://seek.mn','Content-Type':'application/json'},body:JSON.stringify(credentials)});assert.equal(res.status,201);return (await res.json()).accessToken;}
(async()=>{
 a=await p.audienceType.create({data:{code:key,name:key}});d=await p.difficultyScale.create({data:{code:key,name:key}});g=await p.cognitiveFramework.create({data:{code:key,name:key}});f=await p.competenceFramework.create({data:{code:key,name:key,version:'1'}});
 dl=await p.difficultyLevel.create({data:{difficultyScaleId:d.id,code:'EASY',name:'Easy',rank:1}});cl=await p.cognitiveLevel.create({data:{cognitiveFrameworkId:g.id,code:'REMEMBER',name:'Remember',rank:1}});
 const cd={name:key,audienceTypeId:a.id,difficultyScaleId:d.id,cognitiveFrameworkId:g.id,competenceFrameworkId:f.id};c=await p.assessmentContext.create({data:{...cd,code:key}});c2=await p.assessmentContext.create({data:{...cd,name:key+'_OTHER',code:key+'_OTHER'}});t=await p.topic.create({data:{code:key,title:'Assigned topic',assessmentContextId:c.id}});
 const admin=await login(input.admin),assessor=await login(input.assessor);
 const users=await api(admin,'/auth/admin/users');assert.equal(users.status,200);const user=users.data.find(u=>u.email===input.assessor.email);assert(user);
 const listPath='/assessment/questions/metadata/assessment-contexts';
 assert(!(await api(assessor,listPath)).data.some(x=>x.id===c.id));
 assert.equal((await api(assessor,'/assessment/context-access/'+c.id,'POST',{userId:user.id})).status,403);
 let res=await api(admin,'/assessment/context-access/'+c.id,'POST',{userId:user.id});assert.equal(res.status,201,JSON.stringify(res.data));
 assert.equal((await api(admin,'/assessment/context-access/'+c.id,'POST',{userId:user.id})).status,201);assert.equal(await p.assessorContextGrant.count({where:{contextId:c.id,userId:user.id}}),1);
 assert((await api(assessor,listPath)).data.some(x=>x.id===c.id));assert(!(await api(assessor,listPath)).data.some(x=>x.id===c2.id));assert.equal((await api(assessor,listPath+'?assessmentContextId='+c2.id)).status,403);
 assert((await api(assessor,'/assessment/questions/metadata/audience-types')).data.some(x=>x.id===a.id));assert.equal((await api(assessor,'/assessment/questions/metadata/audience-types','POST',{name:'Forbidden',code:key+'_BAD'})).status,403);
 // Minimal modal draft: no fabricated topic or metadata is required.
 const draftBody={code:key+'_DRAFT',body:'Draft',type:'SINGLE_CHOICE',assessmentContextId:c.id,topicMappings:[]};
 assert.equal((await api(assessor,'/assessment/questions','POST',{...draftBody,assessmentContextId:c2.id})).status,403);
 let draftResponse=await api(assessor,'/assessment/questions','POST',draftBody);assert.equal(draftResponse.status,201,JSON.stringify(draftResponse.data));const draft=draftResponse.data;qids.push(draft.id);
 assert.equal((await p.question.findUnique({where:{id:draft.id}})).assessmentContextId,c.id);
 assert.equal((await api(assessor,'/assessment/questions/'+draft.id)).status,200);
 assert((await api(assessor,'/assessment/questions?assessmentContextId='+c.id)).data.some(x=>x.id===draft.id));
 assert.equal((await api(assessor,'/assessment/questions/'+draft.id,'PUT',{body:'Saved draft',topicMappings:[]})).status,200);
 assert.equal((await api(assessor,'/assessment/questions/'+draft.id+'/workflow','POST',{action:'approval_requested',newStatus:'pending'})).status,400);
 assert.equal((await api(assessor,'/assessment/questions/'+draft.id,'PUT',{assessmentContextId:c2.id})).status,403);
 const mapping={topicId:t.id,assessmentContextId:c.id,difficulty:dl.id,bloomLevel:cl.id,weight:1};
 assert.equal((await api(assessor,'/assessment/questions/'+draft.id,'PUT',{topicMappings:[mapping]})).status,200);
 assert.equal(await p.topicQuestionClassification.count({where:{questionId:draft.id}}),1);
 res=await api(assessor,'/assessment/questions','POST',{code:key,body:'Test',type:'SHORT_TEXT',ownerUserId:'spoofed',topicMappings:[mapping]});assert.equal(res.status,201,JSON.stringify(res.data));const q=res.data;qids.push(q.id);assert.equal((await p.question.findUnique({where:{id:q.id}})).ownerUserId,user.id);
 res=await api(assessor,'/assessment/questions?assessmentContextId='+c.id+'&ownerUserId=spoofed');assert.equal(res.status,200);assert(res.data.some(x=>x.id===q.id),'own question survives client owner filter');
 assert.equal((await api(assessor,'/assessment/questions/'+q.id,'PUT',{topicMappings:[{...mapping,assessmentContextId:c2.id}]})).status,403);assert.equal((await api(assessor,'/assessment/questions/'+q.id,'PUT',{body:'Updated'})).status,200);
 const other=await p.question.create({data:{code:key+'_OTHER',createdBy:'other',ownerUserId:'other',assessmentContextId:c.id}});qids.push(other.id);assert.equal((await api(assessor,'/assessment/questions/'+other.id)).status,403);
 assert.equal((await api(assessor,'/assessment/questions/'+q.id+'/workflow','POST',{action:'approve',newStatus:'approved',actorUserId:'fake'})).status,403);assert.equal((await api(assessor,'/assessment/questions/'+q.id+'/workflow','POST',{action:'approval_requested',newStatus:'pending',actorUserId:'fake'})).status,201);assert.equal((await p.questionWorkflowEvent.findFirst({where:{questionId:q.id}})).actorUserId,user.id);
 res=await api(assessor,'/assessment/blueprints','POST',{name:key,code:key,assessmentContextId:c.id,sections:[{name:'Section',randomPickCount:1,pointsPerQuestion:1,selectedQuestionIds:[q.id]}]});assert.equal(res.status,201,JSON.stringify(res.data));const b=res.data;bids.push(b.id);assert.equal((await api(assessor,'/assessment/blueprints/'+b.id,'PUT',{assessmentContextId:c2.id})).status,403);
 res=await api(assessor,'/assessment/quizzes','POST',{title:key,blueprintId:b.id,durationMinutes:10});assert.equal(res.status,201,JSON.stringify(res.data));quizIds.push(res.data.id);assert.equal((await p.quizRevision.findFirst({where:{quizId:res.data.id}})).assessmentContextId,c.id);assert.equal((await api(assessor,'/assessment/quizzes/'+res.data.id)).status,200);
 await p.assessmentContext.update({where:{id:c.id},data:{isActive:false}});assert(!(await api(assessor,listPath)).data.some(x=>x.id===c.id));await p.assessmentContext.update({where:{id:c.id},data:{isActive:true}});
 assert.equal((await api(admin,'/assessment/context-access/'+c.id+'/'+user.id,'DELETE')).status,200);assert.equal((await api(assessor,'/assessment/questions/'+q.id)).status,403);assert.equal((await api(assessor,'/assessment/blueprints/'+b.id)).status,403);assert(!(await api(assessor,listPath)).data.some(x=>x.id===c.id));
 assert.equal((await api(assessor,'/assessment/questions/'+draft.id)).status,403);
 console.log('PASS API: grants/revocation, isolation, ownership, draft CRUD, workflow permissions');
 if(input.apiOnly) return;
 const {chromium}=require('@playwright/test');assert.equal((await require('dns').promises.lookup('seek.mn')).address,input.verificationAddress);
 const browser=await chromium.launch({headless:true});try{
  async function pageFor(credentials,path){const context=await browser.newContext({ignoreHTTPSErrors:true});const page=await context.newPage();await page.goto('https://seek.mn/login');await page.locator('input[type=email]').fill(credentials.email);await page.locator('input[type=password]').fill(credentials.password);await page.locator('button[type=submit]').click();await page.waitForURL(url=>!url.pathname.endsWith('/login'));await page.goto('https://seek.mn'+path);return page;}
  const adm=await pageFor(input.admin,'/superadmin/assessment-contexts');await adm.getByText(key,{exact:true}).first().click();await adm.getByRole('combobox',{name:'ASSESSOR хэрэглэгч сонгох'}).selectOption(user.id);await adm.getByRole('button',{name:'Эрх оноох',exact:true}).click();await adm.getByRole('button',{name:'Эрх цуцлах',exact:true}).waitFor();
  const assess=await pageFor(input.assessor,'/assessor/context');await assess.getByRole('link').filter({hasText:key}).first().click();await assess.waitForLoadState('networkidle');assert(!await assess.getByRole('alert').filter({hasText:'эрх хүрэлцэхгүй'}).count());assert(assess.url().includes(c.id));assert.equal(await assess.locator('a[href="/admin/metadata/topics"]').count(),0);assert.equal(await assess.locator('a[href="/assessor/db-management"]').count(),0);await assess.screenshot({path:'/tmp/context-access-dashboard.png',fullPage:true});
  await assess.goto('https://seek.mn/assessor/context/'+c.id+'/question-bank');
  await assess.getByRole('button',{name:'+ Даалгавар нэмэх',exact:true}).click();
  const createdPromise=assess.waitForResponse(r=>r.url().endsWith('/api/v1/assessment/questions')&&r.request().method()==='POST');
  await assess.getByRole('button',{name:'Үргэлжлүүлэх',exact:true}).click();
  const createdResponse=await createdPromise;assert.equal(createdResponse.status(),201);const created=await createdResponse.json();qids.push(created.id);
  await assess.waitForURL('**/question-bank/'+created.id);await assess.waitForLoadState('networkidle');
  const metadataFailures=[];assess.on('response',r=>{if(r.url().includes('/metadata/')&&r.status()>=400)metadataFailures.push(r.url());});
  await assess.reload();await assess.waitForLoadState('networkidle');
  assert.deepEqual(metadataFailures,[]);
  const savedPromise=assess.waitForResponse(r=>r.url().endsWith('/questions/'+created.id)&&r.request().method()==='PUT');
  await assess.keyboard.press('Control+s');const savedResponse=await savedPromise;assert.equal(savedResponse.status(),200,await savedResponse.text());
  assert.equal((await p.question.findUnique({where:{id:created.id}})).assessmentContextId,c.id);
  assert.equal(await p.topicQuestionClassification.count({where:{questionId:created.id}}),0);
  await assess.screenshot({path:'/tmp/question-draft-editor.png',fullPage:true});
  adm.on('dialog',d=>d.accept());await adm.getByRole('button',{name:'Эрх цуцлах',exact:true}).click();await adm.getByText('Энэ контекстэд хэрэглэгч оноогоогүй.',{exact:true}).waitFor();await assess.goto('https://seek.mn/assessor/context');await assess.getByText('Танд ашиглах боломжтой контекст одоогоор алга',{exact:true}).waitFor();
 }finally{await browser.close();}
 console.log('PASS browser: admin assignment/revocation and assessor context dashboard');
})().finally(async()=>{
 const rs=await p.quizRevision.findMany({where:{quizId:{in:quizIds}},select:{id:true}});const rids=rs.map(x=>x.id);const secs=await p.quizRevisionSection.findMany({where:{quizRevisionId:{in:rids}},select:{id:true}});
 await p.quizRevisionQuestion.deleteMany({where:{revisionSectionId:{in:secs.map(x=>x.id)}}});await p.quizRevisionSection.deleteMany({where:{quizRevisionId:{in:rids}}});await p.quizRevision.deleteMany({where:{id:{in:rids}}});await p.quiz.deleteMany({where:{id:{in:quizIds}}});
 const bs=await p.quizSection.findMany({where:{templateId:{in:bids}},select:{id:true}});await p.sectionQuestion.deleteMany({where:{sectionId:{in:bs.map(x=>x.id)}}});await p.quizSection.deleteMany({where:{templateId:{in:bids}}});await p.quizTemplate.deleteMany({where:{id:{in:bids}}});
 const cs=await p.topicQuestionClassification.findMany({where:{questionId:{in:qids}},select:{id:true}});await p.cognitiveLevelClassification.deleteMany({where:{classificationId:{in:cs.map(x=>x.id)}}});await p.topicQuestionCompetence.deleteMany({where:{classificationId:{in:cs.map(x=>x.id)}}});await p.topicQuestionClassification.deleteMany({where:{questionId:{in:qids}}});await p.questionWorkflowEvent.deleteMany({where:{questionId:{in:qids}}});await p.questionVersion.deleteMany({where:{questionId:{in:qids}}});await p.question.deleteMany({where:{id:{in:qids}}});
 if(t)await p.topic.delete({where:{id:t.id}});for(const x of [c,c2])if(x){await p.assessorContextGrant.deleteMany({where:{contextId:x.id}});await p.assessmentContext.delete({where:{id:x.id}});}if(dl)await p.difficultyLevel.delete({where:{id:dl.id}});if(cl)await p.cognitiveLevel.delete({where:{id:cl.id}});if(f)await p.competenceFramework.delete({where:{id:f.id}});if(g)await p.cognitiveFramework.delete({where:{id:g.id}});if(d)await p.difficultyScale.delete({where:{id:d.id}});if(a)await p.audienceType.delete({where:{id:a.id}});await p.$disconnect();
}).catch(e=>{console.error(e.message);process.exitCode=1;});
