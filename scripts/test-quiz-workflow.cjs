// Isolated PostgreSQL verification. Connection strings arrive on stdin, never logs.
const fs = require("fs"),
  assert = require("node:assert/strict"),
  { createRequire } = require("module");
const input = JSON.parse(fs.readFileSync(0, "utf8"));
assert.equal(input.environment, "seek-verify");
process.env.ASSESSMENT_DATABASE_URL = input.assessmentUrl;
process.env.NODE_ENV = "test";
require("/app/services/assessment/node_modules/ts-node/register/transpile-only");
const ar = createRequire("/app/services/assessment/package.json");
const { PrismaClient } = ar("./generated/prisma-client"),
  db = new PrismaClient();
const { QuestionService } = ar("./src/question.service"),
  { transitionQuestion, validateContent } = ar("./src/question-workflow"),
  { questionBank } = ar("./src/question-bank");
const auth = input.browser
  ? new (createRequire("/app/services/auth/package.json")(
      "@prisma/client",
    ).PrismaClient)({ datasources: { db: { url: input.authUrl } } })
  : null;
let credentials,adminCredentials;
const key = "QUIZ_" + Date.now(),
  ids = {},
  created = [];
const owner = { id: key, roles: ["ASSESSOR"] };
(async () => {
  try {
    if (auth) {
      const role = await auth.role.findUnique({ where: { name: "ASSESSOR" } });
      credentials = {
        email: key.toLowerCase() + "@example.test",
        password: require("crypto").randomBytes(24).toString("base64url"),
      };
      const bcrypt = createRequire("/app/services/auth/package.json")(
        "bcryptjs",
      );
      await auth.userAccount.create({
        data: {
          id: owner.id,
          email: credentials.email,
          isEmailVerified: true,
          status: "ACTIVE",
          credentials: {
            create: { value: await bcrypt.hash(credentials.password, 10) },
          },
          roles: { create: { roleId: role.id } },
        },
      });
    }
    ids.a = (
      await db.audienceType.create({ data: { code: key, name: key } })
    ).id;
    ids.d = (
      await db.difficultyScale.create({ data: { code: key, name: key } })
    ).id;
    ids.f = (
      await db.cognitiveFramework.create({ data: { code: key, name: key } })
    ).id;
    ids.c = (
      await db.competenceFramework.create({
        data: { code: key, name: key, version: "1" },
      })
    ).id;
    ids.context = (
      await db.assessmentContext.create({
        data: {
          code: key,
          name: key,
          audienceTypeId: ids.a,
          difficultyScaleId: ids.d,
          cognitiveFrameworkId: ids.f,
          competenceFrameworkId: ids.c,
        },
      })
    ).id;
    ids.level = (
      await db.difficultyLevel.create({
        data: {
          difficultyScaleId: ids.d,
          code: "D_CUSTOM",
          name: "Тусгай түвшин",
          rank: 1,
        },
      })
    ).id;
    ids.cognitive = (
      await db.cognitiveLevel.create({
        data: {
          cognitiveFrameworkId: ids.f,
          code: "C_CUSTOM",
          name: "Танин мэдэх",
          rank: 1,
        },
      })
    ).id;
    ids.topic = (
      await db.topic.create({
        data: { assessmentContextId: ids.context, code: key, title: key },
      })
    ).id;
    await db.assessorContextGrant.create({
      data: { contextId: ids.context, userId: owner.id, assignedBy: "test" },
    });
    const {BlueprintService}=ar('./src/blueprint.service');
    const {QuizService}=ar('./src/quiz.service');
    const bs=new BlueprintService(db), qs=new QuizService(db);
    const addQuestion=async(index)=>{
      const q=await new QuestionService(db).create({code:key+'_Q'+index,title:'Сангийн асуулт '+index,body:'2 + 2 = ?',type:'SINGLE_CHOICE',assessmentContextId:ids.context,ownerUserId:owner.id,defaultMaxScore:2,defaultMinScore:0,defaultTimeSeconds:60,payload:{options:[{optionKey:'a',value:'4',isCorrect:true,score:2},{optionKey:'b',value:'5',isCorrect:false,score:0}]},topicMappings:[{topicId:ids.topic,assessmentContextId:ids.context,difficulty:ids.level,bloomLevel:ids.cognitive,cognitiveLevels:[{cognitiveLevelId:ids.cognitive,weight:1}]}]});
      created.push(q.id);const v=(await new QuestionService(db).findOne(q.id)).versions[0];
      const cs=await db.topicQuestionClassification.findMany({where:{questionId:q.id},include:{assessmentContext:true,topic:true,difficultyLevel:true}});
      await db.questionVersion.update({where:{id:v.id},data:{versionStatus:'PUBLISHED',classificationSnapshot:JSON.parse(JSON.stringify(cs))}});
      await db.question.update({where:{id:q.id},data:{currentPublishedVersionId:v.id,lifecycleStatus:'ACTIVE'}});return q.id;
    };
    for(let i=0;i<6;i++)await addQuestion(i);
    const fixed={name:'Сонгосон сан',sectionMode:'FIXED',selectedQuestionIds:created.slice(0,2),randomPickCount:1,pointsPerQuestion:2,selectionRules:{schemaVersion:1}};
    const rule={name:'Дүрмийн сан',sectionMode:'RULE_BASED',selectedQuestionIds:[],randomPickCount:2,pointsPerQuestion:3,selectionRules:{schemaVersion:1,topicIds:[ids.topic],types:['SINGLE_CHOICE'],difficultyLevelIds:[ids.level]}};
    let bp=await bs.create({name:key,code:key,description:'Roundtrip',assessmentContextId:ids.context,topicId:ids.topic,defaultDurationMinutes:37,defaultPassingScore:82.5,createdBy:owner.id,sections:[fixed,rule]});
    const admin={id:key+'_ADMIN',roles:['SUPER_ADMIN']};
    const uuid=()=>require('crypto').randomUUID();
    const create={createdBy:owner.id,title:key+' Quiz',blueprintId:bp.id,expectedBlueprintVersion:bp.version,requestId:uuid(),passingScore:81.5,durationMinutes:41,maxAttempts:3};
    const [one,two]=await Promise.all([qs.create(create),qs.create(create)]);assert.equal(one.id,two.id);let q=one;
    await assert.rejects(qs.create({...create,title:'changed'}),e=>e.status===409);
    assert.equal(q.selectedRevision.passingScore.toString(),'81.5');assert.equal(q.selectedRevision.durationMinutes,41);assert.equal(q.selectedRevision.totalQuestionCount,3);
    const keyFor=()=>({quizRevisionId:q.selectedRevision.id,expectedVersion:q.version});
    let original=JSON.stringify(q.selectedRevision.sections);
    const updates=await Promise.allSettled([qs.update(q.id,{...keyFor(),title:key+' Saved'},owner),qs.update(q.id,{...keyFor(),title:'Other'},owner)]);assert.equal(updates.filter(x=>x.status==='fulfilled').length,1);assert.equal(updates.find(x=>x.status==='rejected').reason.status,409);
    q=await qs.findOne(q.id,owner);assert.equal(JSON.stringify(q.selectedRevision.sections),original);
    const flow=async(action,actor=owner,comment)=>{q=await qs.transition(q.id,{...keyFor(),action,comment,requestId:uuid()},actor);return q;};
    await flow('approval_requested');assert.equal(q.selectedRevision.revisionStatus,'IN_REVIEW');
    await assert.rejects(qs.update(q.id,{...keyFor(),title:'not allowed'},owner),e=>e.status===403);
    await assert.rejects(qs.transition(q.id,{...keyFor(),action:'approve',requestId:uuid()},{...owner,roles:['SUPER_ADMIN']}),e=>e.status===403);
    await assert.rejects(flow('changes_requested',admin),e=>e.status===400);await flow('changes_requested',admin,'Тайлбараа засна уу');
    q=await qs.update(q.id,{...keyFor(),description:'Бодит тайлбар'},owner);await flow('approval_requested');await flow('approve',admin);
    const publish={...keyFor(),action:'publish',requestId:uuid()};const published=await Promise.all([qs.transition(q.id,publish,admin),qs.transition(q.id,publish,admin)]);assert.equal(published[0].version,published[1].version);q=published[0];
    assert.equal(q.currentPublishedRevisionId,q.selectedRevision.id);assert(q.selectedRevision.questionManifestHash);assert.equal(q.workflow.filter(e=>e.action==='publish').length,1);
    const publishedId=q.selectedRevision.id,publishedSections=JSON.stringify(q.selectedRevision.sections);
    await db.quizRevision.update({where:{id:publishedId},data:{resultVisibilityPolicy:{enabled:false},shuffleOptions:true}});
    q=await qs.findOne(q.id,owner);q=await qs.newRevision(q.id,keyFor(),owner);assert.equal(q.selectedRevision.revisionStatus,'DRAFT');assert(q.selectedRevision.shuffleOptions);assert.deepEqual(q.selectedRevision.resultVisibilityPolicy,{enabled:false});
    assert.deepEqual(q.selectedRevision.sections.flatMap(s=>s.questions.map(x=>x.questionVersionId)),q.revisions.find(r=>r.id===publishedId).sections.flatMap(s=>s.questions.map(x=>x.questionVersionId)));
    await assert.rejects(qs.newRevision(q.id,{...keyFor(),quizRevisionId:publishedId},owner),e=>e.status===403);
    await addQuestion(7);let preview=await qs.preview(q.id,{...keyFor(),questionOverrides:[{questionId:created[6],mode:'mandatory'}]},owner);assert.equal(preview.status,'READY');
    q=await qs.update(q.id,{...keyFor(),reselectQuestions:true,questionOverrides:[{questionId:created[6],mode:'mandatory'}]},owner);assert(q.selectedRevision.sections.flatMap(s=>s.questions).some(x=>x.questionId===created[6]));assert.equal(JSON.stringify(q.revisions.find(r=>r.id===publishedId).sections),publishedSections);
    const victim=q.selectedRevision.sections[0].questions[0].questionId;await db.question.update({where:{id:victim},data:{deletedAt:new Date()}});await assert.rejects(flow('approval_requested'),e=>e.status===400);await db.question.update({where:{id:victim},data:{deletedAt:null}});
    assert.equal((await qs.findAll(ids.context,new Set(),{paged:'true'})).total,0);
    if(input.browser){
    const service=new QuestionService(db),typedIds=[];
    const option = (optionKey, value, extra = {}) => ({
      optionKey,
      value,
      isCorrect: true,
      score: 1,
      metadata: { displayLabel: "A" },
      ...extra,
    });
    const types=['SINGLE_CHOICE','MULTIPLE_CHOICE','TRUE_FALSE','SHORT_TEXT','NUMERIC','ESSAY','MATCHING','MATRIX'];
    for (const type of types) {
      let options = [
        option("stable-random-id-a", "A"),
        option("stable-random-id-b", "B", { isCorrect: false, score: 0 }),
      ];
      let config = { scoringMode: "per_option" };
      if (type === "MATCHING") {
        options = options.map((o, i) => ({
          ...o,
          matchRules: { matchValue: "R" + (i + 1) },
          score: 1,
        }));
        config.rightOptions = [
          { id: "R1", value: "Нэг" },
          { id: "R2", value: "Хоёр" },
        ];
      }
      if (type === "MATRIX") {
        options = [
          option("row-a", "Урт өгүүлбэр", {
            matchRules: { matchValue: "yes" },
          }),
        ];
        config.matrixColumns = [
          { id: "yes", label: "Тийм" },
          { id: "no", label: "Үгүй" },
        ];
      }
      if (type === "NUMERIC")
        options = [
          option("number", "10", { matchRules: { matchValue: "0.5" } }),
        ];
      if (type === "FILL_BLANK")
        options = [
          option("blank1", "", {
            metadata: { acceptedValues: [{ value: "зөв", score: 1 }] },
          }),
        ];
      const q = await service.create({
        code: key + "_" + type,
        title: "Асуулт " + type,
        body: "Агуулга " + type,
        type,
        assessmentContextId: ids.context,
        ownerUserId: owner.id,
        defaultMaxScore: 2,
        defaultMinScore: 0,
        defaultTimeSeconds: 60,
        payload: { options },
        scoringConfig: config,
        answerConfig: { answerKey: "зөв" },
        rubric: [{ criteria: "Шалгуур", maxScore: 2 }],
        topicMappings: [
          {
            topicId: ids.topic,
            assessmentContextId: ids.context,
            difficulty: ids.level,
            bloomLevel: ids.cognitive,
            cognitiveLevels: [{ cognitiveLevelId: ids.cognitive, weight: 1 }],
          },
        ],
      });
      created.push(q.id);typedIds.push(q.id);
      const v=(await service.findOne(q.id)).versions[0];validateContent(v);
      const cs=await db.topicQuestionClassification.findMany({where:{questionId:q.id},include:{assessmentContext:true,topic:true,difficultyLevel:true}});
      await db.questionVersion.update({where:{id:v.id},data:{versionStatus:'PUBLISHED',classificationSnapshot:JSON.parse(JSON.stringify(cs))}});
      await db.question.update({where:{id:q.id},data:{currentPublishedVersionId:v.id,lifecycleStatus:'ACTIVE'}});
    }
    const typedBlueprint=await bs.create({name:key+' Бүх төрөл',assessmentContextId:ids.context,createdBy:owner.id,sections:[{name:'Найман төрөл',selectedQuestionIds:typedIds,randomPickCount:8,pointsPerQuestion:3,sectionMode:'FIXED'}]});
    const typedQuiz=await qs.create({title:key+' Найман төрөл',blueprintId:typedBlueprint.id,expectedBlueprintVersion:typedBlueprint.version,createdBy:owner.id,requestId:uuid()});
    for(let i=0;i<12;i++)await qs.create({title:key+' Page '+i,blueprintId:bp.id,expectedBlueprintVersion:bp.version,createdBy:owner.id,requestId:uuid()});
    const paged=await qs.findAll(ids.context,undefined,{paged:'true',pageSize:'12'});assert.equal(paged.items.length,12);assert.equal(paged.total,14);


      const role=await auth.role.findUnique({where:{name:'SUPER_ADMIN'}});adminCredentials={email:key.toLowerCase()+'_admin@example.test',password:require('crypto').randomBytes(24).toString('base64url')};
      const bcrypt=createRequire('/app/services/auth/package.json')('bcryptjs');
      await auth.userAccount.create({data:{id:admin.id,email:adminCredentials.email,isEmailVerified:true,status:'ACTIVE',credentials:{create:{value:await bcrypt.hash(adminCredentials.password,10)}},roles:{create:{roleId:role.id}}}});
      await require('/app/scripts/test-quiz-browser.cjs')({input,credentials,adminCredentials,ids,key,bp,db,owner,q,admin,typedQuiz});
    }
    console.log('PASS Quiz PostgreSQL: create retry/idempotency, version 409, pinned snapshot, review return/approve/publish, self-review forbidden, immutable publication, clone policy preservation, explicit reselection, invalid questions, scoped pagination.');
  } finally {
    if(ids.context){
      const quizIds=(await db.quiz.findMany({where:{template:{assessmentContextId:ids.context}},select:{id:true}})).map(x=>x.id);
      await db.assessmentWorkflowEvent.deleteMany({where:{aggregateType:'quiz',aggregateId:{in:quizIds}}});
      await db.quizMutationRequest.deleteMany({where:{quizId:{in:quizIds}}});
      await db.quiz.deleteMany({where:{id:{in:quizIds}}});
      const bs=await db.quizTemplate.findMany({where:{assessmentContextId:ids.context},select:{id:true}});
      await db.assessmentWorkflowEvent.deleteMany({where:{aggregateType:'blueprint',aggregateId:{in:bs.map(b=>b.id)}}});
      await db.quizTemplate.deleteMany({where:{assessmentContextId:ids.context}});
    }
    await db.cognitiveLevelClassification.deleteMany({
      where: { classification: { questionId: { in: created } } },
    });
    await db.topicQuestionClassification.deleteMany({
      where: { questionId: { in: created } },
    });
    await db.question.deleteMany({ where: { id: { in: created } } });
    if (ids.topic) await db.topic.deleteMany({ where: { id: ids.topic } });
    if (ids.context)
      await db.assessorContextGrant.deleteMany({
        where: { contextId: ids.context },
      });
    if (ids.context)
      await db.assessmentContext.deleteMany({ where: { id: ids.context } });
    if (ids.level)
      await db.difficultyLevel.deleteMany({ where: { id: ids.level } });
    if (ids.cognitive)
      await db.cognitiveLevel.deleteMany({ where: { id: ids.cognitive } });
    for (const [model, id] of [
      ["audienceType", ids.a],
      ["difficultyScale", ids.d],
      ["cognitiveFramework", ids.f],
      ["competenceFramework", ids.c],
    ])
      if (id) await db[model].deleteMany({ where: { id } });
    if (auth) {
      await auth.userAccount.deleteMany({ where: { id: {in:[owner.id,key+"_ADMIN"]} } });
      await auth.$disconnect();
    }
    await db.$disconnect();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
