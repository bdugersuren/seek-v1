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
let credentials;
const key = "BP_" + Date.now(),
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
      const cs=await db.topicQuestionClassification.findMany({where:{questionId:q.id},include:{assessmentContext:true}});
      await db.questionVersion.update({where:{id:v.id},data:{versionStatus:'PUBLISHED',classificationSnapshot:JSON.parse(JSON.stringify(cs))}});
      await db.question.update({where:{id:q.id},data:{currentPublishedVersionId:v.id,lifecycleStatus:'ACTIVE'}});return q.id;
    };
    for(let i=0;i<6;i++)await addQuestion(i);
    const fixed={name:'Сонгосон сан',sectionMode:'FIXED',selectedQuestionIds:created.slice(0,2),randomPickCount:1,pointsPerQuestion:2,selectionRules:{schemaVersion:1}};
    const rule={name:'Дүрмийн сан',sectionMode:'RULE_BASED',selectedQuestionIds:[],randomPickCount:2,pointsPerQuestion:3,selectionRules:{schemaVersion:1,topicIds:[ids.topic],types:['SINGLE_CHOICE'],difficultyLevelIds:[ids.level]}};
    let bp=await bs.create({name:key,code:key,description:'Roundtrip',assessmentContextId:ids.context,topicId:ids.topic,defaultDurationMinutes:37,defaultPassingScore:82.5,createdBy:owner.id,sections:[fixed,rule]});
    assert.equal(bp.readiness.status,'READY');assert.equal(bp.readiness.summary.uniquePoolQuestions,6);assert.equal(bp.readiness.summary.totalPoints,8);
    const sectionIds=bp.sections.map(s=>s.id);
    bp=await bs.update(bp.id,{version:bp.version,name:key+' зассан',defaultDurationMinutes:43,defaultPassingScore:76.5},owner.id);
    assert.equal(bp.defaultDurationMinutes,43);assert.equal(Number(bp.defaultPassingScore),76.5);assert.deepEqual(bp.sections.map(s=>s.id),sectionIds);
    const concurrent=await Promise.allSettled([bs.update(bp.id,{version:bp.version,description:'A'},owner.id),bs.update(bp.id,{version:bp.version,description:'B'},owner.id)]);
    assert.equal(concurrent.filter(r=>r.status==='fulfilled').length,1);assert.equal(concurrent.find(r=>r.status==='rejected').reason.status,409);bp=await bs.findOne(bp.id);
    const quiz=await qs.create({title:key+' Quiz',blueprintId:bp.id,createdBy:owner.id,expectedBlueprintVersion:bp.version,requestId:require('crypto').randomUUID()});
    assert.equal(quiz.revisions[0].durationMinutes,43);assert.equal(Number(quiz.revisions[0].passingScore),76.5);
    const old=quiz.revisions[0];const chosen=old.sections.flatMap(s=>s.questions.map(q=>q.questionId));assert.equal(chosen.length,3);assert.equal(new Set(chosen).size,3);assert(old.sections.every(s=>s.selectionRuleSnapshot.seed));
    const normalized=ar('./src/blueprint-pools').normalizeBlueprint(bp);
    normalized.sections[0].name='Хэрэглэгдсэн хэсгийн шинэ нэр';bp=await bs.update(bp.id,{...normalized,version:bp.version},owner.id);assert.deepEqual(bp.sections.map(s=>s.id),sectionIds);
    await assert.rejects(bs.update(bp.id,{version:bp.version,sections:normalized.sections.slice(1)},owner.id),e=>e.status===409);
    assert.equal((await qs.findOne(quiz.id)).revisions[0].sections[0].title,old.sections[0].title);
    await addQuestion(6);bp=await bs.findOne(bp.id);assert.equal(bp.readiness.summary.uniquePoolQuestions,7);
    await qs.update(quiz.id,{title:'Metadata only',quizRevisionId:old.id,expectedVersion:quiz.version},owner.id);assert.deepEqual((await qs.findOne(quiz.id)).revisions[0].sections.flatMap(s=>s.questions.map(q=>q.questionId)),chosen);
    await qs.update(quiz.id,{reselectQuestions:true,quizRevisionId:old.id,expectedVersion:(await qs.findOne(quiz.id)).version},owner.id);
    await db.quizRevision.update({where:{id:old.id},data:{revisionStatus:'PUBLISHED'}});
    const beforePublished=await qs.findOne(quiz.id);const snapshot=JSON.stringify(beforePublished.revisions[0].sections);
    await qs.newRevision(quiz.id,{quizRevisionId:old.id,expectedVersion:beforePublished.version},owner);const after=await qs.findOne(quiz.id);assert.equal(after.revisions.length,2);assert.equal(JSON.stringify(after.revisions[1].sections),snapshot);
    await assert.rejects(bs.remove(bp.id),e=>e.status===409);
    const copy=await bs.duplicate(bp.id,owner.id);assert(copy.code!==bp.code);assert.equal(copy.usageCount,0);assert(copy.sections.every(s=>!sectionIds.includes(s.id)));
    await db.question.update({where:{id:created[0]},data:{deletedAt:new Date()}});assert.equal((await bs.findOne(bp.id)).readiness.status,'NEEDS_ATTENTION');await db.question.update({where:{id:created[0]},data:{deletedAt:null}});
    for(let i=0;i<12;i++)await bs.create({name:key+' '+i,assessmentContextId:ids.context,createdBy:owner.id,sections:[]});
    const page=await bs.findAll(ids.context,new Set([bp.id]),{paged:'true',page:'1',pageSize:'12'});assert.equal(page.total,1);assert.equal(page.items.length,1);assert(!JSON.stringify(page.items).includes('classificationSnapshot'));
    await assert.rejects(bs.findAll(ids.context,new Set(),{paged:'true',pageSize:'1000'}),e=>e.status===400);
    if(input.browser)await require('/app/scripts/test-blueprint-browser.cjs')({input,credentials,ids,key,bp,db,owner});
    console.log('PASS PostgreSQL: migration, fixed/rule readiness, roundtrip, concurrent 409, referenced sections, unique Quiz selection, published snapshot, explicit reselection, pagination, duplicate/delete protection.');
  } finally {
    if(ids.context){
      const quizIds=(await db.quiz.findMany({where:{template:{assessmentContextId:ids.context}},select:{id:true}})).map(q=>q.id);
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
      await auth.userAccount.deleteMany({ where: { id: owner.id } });
      await auth.$disconnect();
    }
    await db.$disconnect();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
