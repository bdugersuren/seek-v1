// Runs only against the isolated seek-verify databases. Secrets arrive on stdin.
const fs=require('fs'),assert=require('node:assert/strict'),{createRequire}=require('module');
const input=JSON.parse(fs.readFileSync(0,'utf8'));assert.equal(input.environment,'seek-verify');
process.env.DATABASE_URL=input.authUrl;process.env.NODE_ENV='test';process.env.ASSESSMENT_DATABASE_URL=input.assessmentUrl;process.env.EXECUTION_DATABASE_URL=input.executionUrl;process.env.CANDIDATE_INTERNAL_SECRET='candidate-test-only-01234567890123456789';
require('/app/services/assessment/node_modules/ts-node/register/transpile-only');
const ar=createRequire('/app/services/assessment/package.json'),er=createRequire('/app/services/execution/package.json');
const A=ar('./generated/prisma-client').PrismaClient,E=er('./generated/prisma-client').PrismaClient;const a=new A(),e=new E();
const {CandidateController}=ar('./src/candidate.controller'),{CandidateAttemptService}=er('./src/candidate-attempt.service'),{CryptoKMSService}=er('./src/infrastructure/crypto-kms.service'),{PrismaAttemptStateStore}=er('./src/infrastructure/prisma-state-store'),{ExecutionService}=er('./src/execution.service'),{SseService}=er('./src/infrastructure/sse.service'),{GradingService}=er('./src/grading.service');
const auth=input.browser?new (createRequire('/app/services/auth/package.json')('@prisma/client').PrismaClient)():null;const credentials={};
const questionType=input.questionType || 'SINGLE_CHOICE';
const correctAnswer=input.wrong?(['MATCHING','MATRIX'].includes(questionType)?{A:'R1',B:'R2'}:'B'):(['MATCHING','MATRIX'].includes(questionType)?{A:'R2',B:'R1'}:'A');
const expectedScore=input.wrong?0:2;
const key='CANDIDATE_TEST_'+Date.now(),ids={};const actor={headers:{'x-user-id':key+'_admin','x-user-roles':'SUPER_ADMIN'}};const owner=key+'_owner',other=key+'_other';
(async()=>{try{
 if(input.browser){const bcrypt=createRequire('/app/services/auth/package.json')('bcryptjs');const role=await auth.role.findUnique({where:{name:'SUPER_ADMIN'}});input.admin={email:key.toLowerCase()+'_admin@example.test',password:require('crypto').randomBytes(24).toString('base64url')};await auth.userAccount.create({data:{id:actor.headers['x-user-id'],email:input.admin.email,isEmailVerified:true,status:'ACTIVE',credentials:{create:{value:await bcrypt.hash(input.admin.password,10)}},roles:{create:{roleId:role.id}}}});}
 if(input.browser){const role=await auth.role.findUnique({where:{name:'CANDIDATE'}});assert(role);const bcrypt=createRequire('/app/services/auth/package.json')('bcryptjs');for(const id of [owner,other]){const password=require('crypto').randomBytes(24).toString('base64url');credentials[id]={email:id.toLowerCase()+'@example.test',password};await auth.userAccount.create({data:{id,email:credentials[id].email,isEmailVerified:true,status:'ACTIVE',credentials:{create:{value:await bcrypt.hash(password,10)}},roles:{create:{roleId:role.id}}}});}}

 ids.a=(await a.audienceType.create({data:{code:key,name:key}})).id;ids.d=(await a.difficultyScale.create({data:{code:key,name:key}})).id;ids.f=(await a.cognitiveFramework.create({data:{code:key,name:key}})).id;ids.c=(await a.competenceFramework.create({data:{code:key,name:key,version:'1'}})).id;
 ids.context=(await a.assessmentContext.create({data:{code:key,name:key,audienceTypeId:ids.a,difficultyScaleId:ids.d,cognitiveFrameworkId:ids.f,competenceFrameworkId:ids.c}})).id;
 ids.question=(await a.question.create({data:{code:key,createdBy:actor.headers['x-user-id'],assessmentContextId:ids.context}})).id;
 ids.version=(await a.questionVersion.create({data:{questionId:ids.question,versionNumber:1,versionStatus:'PUBLISHED',type:questionType,body:'Choose the correct answer',tags:[],createdBy:actor.headers['x-user-id'],defaultMaxScore:2,scoringConfig:questionType==='MATCHING'?{scoringMode:'combination',rightOptions:[{id:'R1',value:'One'},{id:'R2',value:'Two'}],combinations:[{ids:['A:R2','B:R1'],score:2}]}:questionType==='MATRIX'?{scoringMode:'per_option',matrixColumns:[{id:'R1',label:'One'},{id:'R2',label:'Two'}]}:{scoringMode:'per_option'},payload:{options:[{optionKey:'A',value:'Correct',isCorrect:true,score:questionType==='SINGLE_CHOICE'?2:1,matchRules:{matchValue:'R2'}},{optionKey:'B',value:'Wrong',isCorrect:questionType!=='SINGLE_CHOICE',score:questionType==='SINGLE_CHOICE'?0:1,matchRules:{matchValue:'R1'}}]}}})).id;
 ids.template=(await a.quizTemplate.create({data:{code:key,name:key,defaultDurationMinutes:20,defaultPassingScore:1,assessmentContextId:ids.context,createdBy:actor.headers['x-user-id']}})).id;
 ids.quiz=(await a.quiz.create({data:{code:key,title:key,templateId:ids.template,createdBy:actor.headers['x-user-id']}})).id;
 ids.rev=(await a.quizRevision.create({data:{quizId:ids.quiz,revisionNumber:1,revisionStatus:'PUBLISHED',assessmentContextId:ids.context,title:key,durationMinutes:20,passingScore:1,createdBy:actor.headers['x-user-id']}})).id;
 ids.sec=(await a.quizRevisionSection.create({data:{quizRevisionId:ids.rev,title:'Section',sectionMode:'FIXED',orderIndex:1,questionCount:1,maxScorePerQuestion:2,selectionStrategy:'RANDOM'}})).id;
 await a.quizRevisionQuestion.create({data:{revisionSectionId:ids.sec,questionId:ids.question,questionVersionId:ids.version,orderIndex:1,maxScore:2}});
 ids.schedule=(await a.quizSchedule.create({data:{quizRevisionId:ids.rev,code:key,name:key,status:'OPEN',availableFrom:new Date(Date.now()-60000),availableUntil:new Date(Date.now()+3600000),createdBy:actor.headers['x-user-id']}})).id;
 const controller=new CandidateController(a);await controller.assign(actor,ids.schedule,{userId:owner});
 const kms=new CryptoKMSService();const creation=new CandidateAttemptService(e,kms);creation.prepare=(scheduleId,userId)=>controller.prepare({headers:{'x-candidate-internal-secret':process.env.CANDIDATE_INTERNAL_SECRET}},{scheduleId,userId});
 await assert.rejects(creation.create(ids.schedule,other),x=>x.status===403);
 const [one,two]=await Promise.all([creation.create(ids.schedule,owner),creation.create(ids.schedule,owner)]);assert.equal(one.attemptId,two.attemptId);ids.attempt=one.attemptId;
 const publisher=new Proxy({},{get:()=>async()=>{throw Error('Transactional mutations must enqueue rather than publish directly');}});
 const runtime=new ExecutionService(new PrismaAttemptStateStore(e),publisher,new SseService(),null);
 assert.equal((await runtime.getSession(ids.attempt)).questions.length,0);
 await runtime.acknowledgeInstructions(ids.attempt,{instructionHash:'candidate-instructions-v1'});
 await runtime.startAttempt(ids.attempt);const end=(await runtime.getSession(ids.attempt)).session.endsAt;await runtime.startAttempt(ids.attempt);assert.equal((await runtime.getSession(ids.attempt)).session.endsAt,end);
 const session=await runtime.getSession(ids.attempt);assert.equal(session.questions.length,1);assert(!JSON.stringify(session).includes('isCorrect'));assert(!JSON.stringify(session).includes('gradingConfigCipher'));
 const save=v=>runtime.autosave({attemptId:ids.attempt,idempotencyKey:'save-'+v,localVersion:v,changedAnswers:{[ids.question]:v===10?correctAnswer:'B'},clientSavedAt:new Date().toISOString()});await save(10);await assert.rejects(save(9),x=>x.status===409);assert.deepEqual((await e.attemptStateSnapshot.findUnique({where:{attemptId:ids.attempt}})).answers[ids.question],correctAnswer);
 const request={attemptId:ids.attempt,idempotencyKey:'submit',reason:'user_submit',submittedAt:new Date().toISOString(),finalSnapshot:{attemptId:ids.attempt,answers:{[ids.question]:correctAnswer},markedForReview:{},localVersion:10,serverVersion:1,pendingSubmit:false}};
 const results=await Promise.all([runtime.submit(request),runtime.submit(request)]);assert(results.every(x=>x.accepted));assert.equal(results[0].receiptId,results[1].receiptId);assert.equal(await e.attemptSubmission.count({where:{attemptId:ids.attempt}}),1);assert((await runtime.getReceipt(ids.attempt)).submitted);assert.equal(await e.outboxEvent.count({where:{aggregateId:ids.attempt,eventType:'publishScoringRequested'}}),1);
 const grading=new GradingService(e,kms);await grading.grade(ids.attempt);assert.equal((await grading.read(ids.attempt)).status,'AWAITING_RELEASE');const current=await e.quizAttempt.findUnique({where:{id:ids.attempt}});await grading.review(ids.attempt,actor.headers['x-user-id'],{expectedRevision:current.rowVersion,publish:true});const result=await grading.read(ids.attempt);assert.equal(result.status,'PUBLISHED');assert.equal(result.totalScore,expectedScore);
 const {QuestionStatisticsController}=er('./src/question-statistics');const statistics=new QuestionStatisticsController(e);await assert.rejects(statistics.read({headers:{}},{versionIds:[ids.version]}),x=>x.status===403);const summary=await statistics.read({headers:{'x-candidate-internal-secret':process.env.CANDIDATE_INTERNAL_SECRET}},{versionIds:[ids.version,'no-such-version']});assert.equal(summary.items[0].gradedCount,1);assert.equal(summary.items[0].correctCount,input.wrong?0:1);assert.equal(summary.items[0].usageCount,1);assert.equal(summary.items[0].averagePercentage,input.wrong?0:100);assert.equal(summary.items[1].gradedCount,0);
 const assignment=await a.quizUserAssignment.findUnique({where:{scheduleId_userId:{scheduleId:ids.schedule,userId:owner}}});await controller.revoke(actor,assignment.id);await assert.rejects(creation.create(ids.schedule,owner),x=>x.status===403);
 if(input.browser)await require('./test-candidate-browser.cjs')({input,key,ids,owner,other,a,e,auth,credentials});
 console.log('PASS PostgreSQL candidate workflow: assignment scope, concurrent creation/start/submit, hidden questions/keys, stale save, durable receipt/outbox, grading/release, revocation.');
}finally{
 if(ids.schedule){const attempts=await e.quizAttempt.findMany({where:{scheduleId:ids.schedule},select:{id:true}});await e.outboxEvent.deleteMany({where:{aggregateId:{in:attempts.map(x=>x.id)}}});await e.quizAttempt.deleteMany({where:{scheduleId:ids.schedule}});}
 if(ids.schedule)await a.assessmentWorkflowEvent.deleteMany({where:{aggregateType:'schedule',aggregateId:ids.schedule}});
 if(ids.schedule)await a.quizSchedule.deleteMany({where:{id:ids.schedule}});
 if(ids.quiz)await a.quiz.deleteMany({where:{id:ids.quiz}});
 if(ids.template)await a.quizTemplate.deleteMany({where:{id:ids.template}});
 if(ids.question)await a.question.deleteMany({where:{id:ids.question}});
 if(ids.context)await a.assessmentContext.deleteMany({where:{id:ids.context}});
 for(const [model,id] of [['audienceType',ids.a],['difficultyScale',ids.d],['cognitiveFramework',ids.f],['competenceFramework',ids.c]])if(id)await a[model].deleteMany({where:{id}});
 if(auth){await auth.userAccount.deleteMany({where:{id:{in:[owner,other,actor.headers['x-user-id']]}}});await auth.$disconnect();}
 await a.$disconnect();await e.$disconnect();}})().catch(error=>{console.error(error.message);process.exit(1)});
