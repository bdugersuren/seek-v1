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
const key = "QB_" + Date.now(),
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
    const service = new QuestionService(db);
    const option = (optionKey, value, extra = {}) => ({
      optionKey,
      value,
      isCorrect: true,
      score: 1,
      metadata: { displayLabel: "A" },
      ...extra,
    });
    const types = [
      "SINGLE_CHOICE",
      "MULTIPLE_CHOICE",
      "TRUE_FALSE",
      "ORDERING",
      "MATCHING",
      "SHORT_TEXT",
      "FILL_BLANK",
      "MATRIX",
      "NUMERIC",
      "LIKERT",
      "SJT",
      "CASE_BUNDLE",
      "ESSAY",
    ];
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
      created.push(q.id);
      const read = await service.findOne(q.id),
        v = read.versions[0];
      assert.equal(v.type, type);
      assert.equal(
        read.classifications[0].difficultyLevel.name,
        "Тусгай түвшин",
      );
      assert.deepEqual(
        v.options.map((o) => o.optionKey),
        options.map((o) => o.optionKey),
      );
      validateContent(v);
      await transitionQuestion(
        db,
        q.id,
        {
          action: "approval_requested",
          requestId: key + type,
          questionVersionId: v.id,
          expectedRevision: read.revision,
        },
        owner,
      );
      assert.equal(
        (await service.findOne(q.id)).versions[0].versionStatus,
        "IN_REVIEW",
      );
    }
    const allowed = new Set(created),
      page = await questionBank(
        db,
        { assessmentContextId: ids.context, page: "1", pageSize: "5" },
        allowed,
      );
    assert.equal(page.total, 13);
    assert.equal(page.items.length, 5);
    assert(!("options" in page.items[0].activeVersion));
    assert(!("payload" in page.items[0].activeVersion));
    const second = await questionBank(
      db,
      { assessmentContextId: ids.context, page: "2", pageSize: "5" },
      allowed,
    );
    assert(!second.items.some((q) => page.items.some((p) => p.id === q.id)));
    const filtered = await questionBank(
      db,
      {
        assessmentContextId: ids.context,
        types: "MATRIX",
        difficulties: "D_CUSTOM",
        statuses: "in_review",
      },
      allowed,
    );
    assert.equal(filtered.total, 1);
    assert.equal(filtered.items[0].activeVersion.type, "MATRIX");
    assert.equal(
      (await questionBank(db, { assessmentContextId: ids.context }, new Set()))
        .total,
      0,
    );
    assert.equal(
      (
        await questionBank(
          db,
          { assessmentContextId: ids.context, search: "' OR 1=1 --" },
          allowed,
        )
      ).total,
      0,
    );
    await assert.rejects(questionBank(db, { pageSize: "1000" }, allowed));
    if (input.browser)
      await require("./test-question-bank-browser.cjs")({
        input,
        db,
        ids,
        created,
        credentials,
      });
    console.log(
      "PASS 13 types: create, persisted content/order/classification, submission; scoped pagination, filters, injection literal and bounds.",
    );
  } finally {
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
