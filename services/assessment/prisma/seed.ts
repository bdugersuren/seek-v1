const { PrismaClient } = require("../generated/prisma-client");

const prisma = new PrismaClient();

function q(value: unknown) {
  if (value === null || value === undefined) return "NULL";
  if (value instanceof Date) return `'${value.toISOString().replace(/'/g, "''")}'`;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function json(value: unknown) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

async function exec(sql: string) {
  await prisma.$executeRawUnsafe(sql);
}

const questions = [
  {
    id: "qb-001",
    versionId: "qv-qb-001-v1",
    code: "MX-60",
    title: "Бутархайн тэнцүү байдал",
    body: "2/3 * 3/4 үйлдлийг гүйцэтгэхэд хамгийн хялбар хэлбэрт шилжүүлнэ үү.",
    type: "single_choice",
    status: "PUBLISHED",
    points: 2,
    durationSeconds: 60,
    topicId: "fractions",
    difficultyId: "easy",
    cognitiveId: "apply",
    competenceId: "knowledge",
    tags: ["бутархай", "үржих"],
    answerKey: "A",
    feedback: "2/3 болон 3/4-ийг үржүүлээд 6/12, хялбаршуулбал 1/2 болно.",
    options: [
      { id: "a", label: "A", content: "1/2", isCorrect: true },
      { id: "b", label: "B", content: "6/12" },
      { id: "c", label: "C", content: "8/9" },
      { id: "d", label: "D", content: "5/7" },
    ],
  },
  {
    id: "qb-002",
    versionId: "qv-qb-002-v1",
    code: "MX-59",
    title: "Үйлдийн чанарыг ангилах",
    body: "a + b = b + a илэрхийлэл ямар хуультай тохирох вэ?",
    type: "matching",
    status: "APPROVED",
    points: 3,
    durationSeconds: 90,
    topicId: "algebra",
    difficultyId: "medium",
    cognitiveId: "understand",
    competenceId: "knowledge",
    tags: ["хууль", "алгебр"],
    answerKey: "A",
    feedback: "Нэмэгдэхүүний байр солигдоход нийлбэр өөрчлөгдөхгүй.",
    options: [
      { id: "a", label: "A", content: "Нэмэхийн байр солих хууль", isCorrect: true },
      { id: "b", label: "B", content: "Нэмэхийн бүлэглэх хууль" },
      { id: "c", label: "C", content: "Үржихийн нэмэхэд тархах хууль" },
    ],
  },
  {
    id: "qb-003",
    versionId: "qv-qb-003-v1",
    code: "CS-21",
    title: "Харилцааны нөхцөл байдлын шийдвэр",
    body: "Иргэн бухимдсан үед хамгийн түрүүнд ямар хариу үйлдэл үзүүлэх вэ?",
    type: "sjt",
    status: "CHANGES_REQUESTED",
    points: 4,
    durationSeconds: 120,
    topicId: "communication",
    difficultyId: "hard",
    cognitiveId: "evaluate",
    competenceId: "attitude",
    tags: ["SJT", "иргэн"],
    answerKey: "A",
    feedback: "Эхний алхам нь сэтгэл хөдлөлийг намжаах сонсох үйлдэл байна.",
    options: [
      { id: "a", label: "A", content: "Тайван сонсож, асуудлыг тодруулна.", score: 4 },
      { id: "b", label: "B", content: "Журам тайлбарлаад шууд дуусгана.", score: 1 },
      { id: "c", label: "C", content: "Дараагийн ажилтанд шилжүүлнэ.", score: 2 },
    ],
  },
  {
    id: "qb-004",
    versionId: "qv-qb-004-v1",
    code: "DG-12",
    title: "Файлтай даалгавар",
    body: "Хавсаргасан хүснэгтийг уншаад хамгийн эрсдэлтэй үзүүлэлтийг тайлбарлана уу.",
    type: "essay",
    status: "DRAFT",
    points: 5,
    durationSeconds: 300,
    topicId: "cyber",
    difficultyId: "medium",
    cognitiveId: "analyze",
    competenceId: "digital",
    tags: ["файл", "шинжилгээ"],
    answerKey: "Rubric based",
    feedback: "Өгөгдөл дээр тулгуурласан тайлбар шаардлагатай.",
    options: [],
  },
  {
    id: "qb-005",
    versionId: "qv-qb-005-v1",
    code: "MX-58",
    title: "Рационал илэрхийлэл хялбарчлах",
    body: "Дараах илэрхийллийг хялбарчил: $\\frac{x-1}{x^2-1}=?$",
    type: "multiple_choice",
    status: "PUBLISHED",
    points: 3,
    durationSeconds: 90,
    topicId: "algebra",
    difficultyId: "medium",
    cognitiveId: "apply",
    competenceId: "knowledge",
    tags: ["олон сонголт", "томъёо"],
    answerKey: "A",
    feedback: "$x^2-1=(x-1)(x+1)$ тул $x-1$ хураагдаж $\\frac{1}{x+1}$ үлдэнэ.",
    options: [
      { id: "a", label: "A", content: "$\\frac{1}{x+1}$", isCorrect: true },
      { id: "b", label: "B", content: "$\\frac{1}{x-1}$" },
      { id: "c", label: "C", content: "$x-1$" },
      { id: "d", label: "D", content: "$x+1$" },
    ],
  },
  {
    id: "runtime-q1",
    versionId: "qv-runtime-q1-v1",
    code: "Q1",
    title: "Үндсэн хуулийн зарчим",
    body: "Монгол Улсын Үндсэн хуулийн үндсэн зарчимд аль нь хамаарах вэ?",
    type: "single_choice",
    status: "PUBLISHED",
    points: 2,
    durationSeconds: 60,
    topicId: "governance",
    difficultyId: "easy",
    cognitiveId: "remember",
    competenceId: "knowledge",
    tags: ["төрийн алба", "үндсэн хууль"],
    answerKey: "a",
    feedback: "Ардчилсан ёс нь үндсэн зарчимд хамаарна.",
    options: [
      { id: "a", label: "Ардчилсан ёс", isCorrect: true },
      { id: "b", label: "Зөвхөн эдийн засгийн өсөлт" },
      { id: "c", label: "Нууц захиргаа" },
      { id: "d", label: "Хувийн ашиг сонирхол" },
    ],
  },
  {
    id: "runtime-q2",
    versionId: "qv-runtime-q2-v1",
    code: "Q2",
    title: "Төрийн үйлчилгээний чанар",
    body: "Төрийн үйлчилгээний чанарыг сайжруулахад нөлөөлөх хүчин зүйлсийг сонго.",
    type: "multiple_choice",
    status: "PUBLISHED",
    points: 3,
    durationSeconds: 90,
    topicId: "governance",
    difficultyId: "medium",
    cognitiveId: "understand",
    competenceId: "professional",
    tags: ["төрийн үйлчилгээ"],
    answerKey: "a,b,c",
    feedback: "Ил тод байдал, хариуцлага, иргэн төвтэй үйлчилгээ нь чанарт нөлөөлнө.",
    options: [
      { id: "a", label: "Ил тод байдал", isCorrect: true },
      { id: "b", label: "Хариуцлага", isCorrect: true },
      { id: "c", label: "Иргэн төвтэй үйлчилгээ", isCorrect: true },
      { id: "d", label: "Мэдээллийг зориуд нуух" },
    ],
  },
  {
    id: "runtime-q3",
    versionId: "qv-runtime-q3-v1",
    code: "Q3",
    title: "Үйлчилгээний шат дамжлага",
    body: "Иргэн үйлчилгээ авах явцад олон шат дамжлага үүсэж байгаа нөхцөлд сайжруулах саналаа тайлбарлана уу.",
    type: "essay",
    status: "PUBLISHED",
    points: 10,
    durationSeconds: 300,
    topicId: "governance",
    difficultyId: "hard",
    cognitiveId: "create",
    competenceId: "professional",
    tags: ["эсээ", "шийдэл"],
    answerKey: "Rubric based",
    feedback: "Бүтэцтэй, үндэслэлтэй хариулт шаардлагатай.",
    options: [],
  },
];

const catalogAssessments = [
  ["data-analysis-basic", "Мэдээллийн шинжилгээний үндэс", 45, 100, 70, "FREE", "OPEN_WITH_CODE"],
  ["communication-skill", "Харилцааны ур чадвар", 30, 40, 70, "USER_PAYS", "PUBLIC_REGISTRATION"],
  ["cyber-security-basic", "Кибер аюулгүй байдлын үндэс", 50, 50, 70, "USER_PAYS", "PUBLIC_REGISTRATION"],
  ["teamwork-skill", "Багаар ажиллах ур чадвар", 35, 80, 65, "FREE", "OPEN_WITH_CODE"],
  ["teacher-standard", "Багшийн мэргэжлийн стандарт", 60, 70, 70, "USER_PAYS", "ASSIGNED_ONLY"],
  ["leadership-organisation", "Компанийн манлайллын үнэлгээ", 45, 55, 70, "ORGANIZATION_PAYS", "ORGANIZATION_ONLY"],
  ["english-basic", "Англи хэлний суурь мэдлэг", 40, 100, 60, "FREE", "OPEN_WITH_CODE"],
  ["project-management", "Төслийн удирдлагын суурь", 90, 80, 70, "USER_PAYS", "PUBLIC_REGISTRATION"],
] as const;

async function seedLookups() {
  for (const [code, name, isGrid] of [
    ["single_choice", "Нэг сонголт", false],
    ["multiple_choice", "Олон сонголт", false],
    ["matching", "Харгалзуулах", false],
    ["ordering", "Эрэмбэлэх", false],
    ["fill_blank", "Нөхөх", false],
    ["matrix", "Матриц", true],
    ["numeric", "Тоон хариулт", false],
    ["likert", "Likert шкал", false],
    ["sjt", "SJT", false],
    ["case_bundle", "Кейсэд суурилсан багц", false],
    ["essay", "Бичгийн шалгалт", false],
  ] as const) {
    await exec(`INSERT INTO question_type (id, code, name, "isGrid", "isActive")
      VALUES (${q(`qt-${code}`)}, ${q(code)}, ${q(name)}, ${q(isGrid)}, true)
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, "isGrid" = EXCLUDED."isGrid"`);
  }

  await exec(`INSERT INTO audience_type (id, code, name, "isActive")
    VALUES ('audience-candidate', 'candidate', 'Candidate', true)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name`);
  await exec(`INSERT INTO audience_level (id, "audienceTypeId", code, name, "orderIndex", "isActive")
    VALUES ('audience-level-adult', 'audience-candidate', 'adult', 'Adult learner', 1, true)
    ON CONFLICT ("audienceTypeId", code) DO UPDATE SET name = EXCLUDED.name`);
  await exec(`INSERT INTO difficulty_scale (id, code, name, "isActive")
    VALUES ('difficulty-default', 'default', 'Default difficulty', true)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name`);
  for (const [id, name, rank] of [["very_easy", "Маш хялбар", 1], ["easy", "Хялбар", 2], ["medium", "Дунд", 3], ["hard", "Хүнд", 4], ["very_hard", "Маш хүнд", 5]] as const) {
    await exec(`INSERT INTO difficulty_level (id, "difficultyScaleId", code, name, rank, "isActive")
      VALUES (${q(id)}, 'difficulty-default', ${q(id)}, ${q(name)}, ${rank}, true)
      ON CONFLICT ("difficultyScaleId", code) DO UPDATE SET name = EXCLUDED.name, rank = EXCLUDED.rank`);
  }
  await exec(`INSERT INTO cognitive_framework (id, code, name, "isActive")
    VALUES ('bloom', 'bloom', 'Bloom taxonomy', true)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name`);
  for (const [id, name, rank] of [["remember", "Сэргээн санах", 1], ["understand", "Ойлгох", 2], ["apply", "Хэрэглэх", 3], ["analyze", "Задлан шинжлэх", 4], ["evaluate", "Үнэлэх", 5], ["create", "Бүтээх", 6]] as const) {
    await exec(`INSERT INTO cognitive_level (id, "cognitiveFrameworkId", code, name, rank, "isActive")
      VALUES (${q(id)}, 'bloom', ${q(id)}, ${q(name)}, ${rank}, true)
      ON CONFLICT ("cognitiveFrameworkId", code) DO UPDATE SET name = EXCLUDED.name, rank = EXCLUDED.rank`);
  }
  await exec(`INSERT INTO competence_framework (id, code, name, version, "isActive")
    VALUES ('competence-default', 'default', 'Default competence framework', '2026', true)
    ON CONFLICT (code, version) DO UPDATE SET name = EXCLUDED.name`);
  for (const [id, name] of [["knowledge", "Мэдлэг"], ["skill", "Ур чадвар"], ["attitude", "Хандлага"], ["digital", "Дижитал ур чадвар"], ["professional", "Ажил мэргэжил"]] as const) {
    await exec(`INSERT INTO competence_type (id, "competenceFrameworkId", code, name, "isActive")
      VALUES (${q(id)}, 'competence-default', ${q(id)}, ${q(name)}, true)
      ON CONFLICT ("competenceFrameworkId", code) DO UPDATE SET name = EXCLUDED.name`);
  }
  await exec(`INSERT INTO assessment_context (id, code, name, "audienceTypeId", "audienceLevelId", "difficultyScaleId", "cognitiveFrameworkId", "competenceFrameworkId", "isActive")
    VALUES ('context-civil-service', 'civil-service', 'Civil Service Assessment', 'audience-candidate', 'audience-level-adult', 'difficulty-default', 'bloom', 'competence-default', true)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name`);
  for (const [id, title] of [["fractions", "Энгийн бутархай"], ["algebra", "Шугаман алгебр"], ["communication", "Харилцааны ур чадвар"], ["cyber", "Кибер аюулгүй байдал"], ["leadership", "Манлайлал"], ["governance", "Засаглалын бүтэц"]] as const) {
    await exec(`INSERT INTO topic (id, code, title, "isActive")
      VALUES (${q(id)}, ${q(id)}, ${q(title)}, true)
      ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title`);
  }
}

async function seedQuestions() {
  for (const item of questions) {
    await exec(`INSERT INTO question (id, code, "lifecycleStatus", "ownerUserId", "ownerOrganizationId", "createdBy", "createdAt", "updatedAt")
      VALUES (${q(item.id)}, ${q(item.code)}, ${q(item.status === "DRAFT" ? "ACTIVE" : "ACTIVE")}, 'mock-assessor', 'org-demo', 'mock-assessor', now(), now())
      ON CONFLICT (code) DO UPDATE SET "ownerUserId" = EXCLUDED."ownerUserId", "updatedAt" = now()`);
    await exec(`INSERT INTO question_version (id, "questionId", "versionNumber", "versionStatus", "typeId", title, body, "defaultTimeSeconds", "defaultMaxScore", tags, "feedbackCorrectly", explanation, payload, "answerConfig", "presentationConfig", "createdBy", "createdAt")
      VALUES (${q(item.versionId)}, ${q(item.id)}, 1, ${q(item.status)}, ${q(`qt-${item.type}`)}, ${q(item.title)}, ${q(item.body)}, ${q(item.durationSeconds)}, ${q(item.points)}, ARRAY[${item.tags.map(q).join(",")}], ${q(item.feedback)}, ${q(item.feedback)}, ${json({ prompt: item.body })}, ${json({ answerKey: item.answerKey, options: item.options })}, ${json({ frontendType: item.type })}, 'mock-assessor', now())
      ON CONFLICT ("questionId", "versionNumber") DO UPDATE SET "versionStatus" = EXCLUDED."versionStatus", title = EXCLUDED.title, body = EXCLUDED.body, payload = EXCLUDED.payload, "answerConfig" = EXCLUDED."answerConfig"`);
    if (item.status === "PUBLISHED") {
      await exec(`UPDATE question SET "currentPublishedVersionId" = ${q(item.versionId)} WHERE id = ${q(item.id)}`);
    }
    for (let index = 0; index < item.options.length; index += 1) {
      const option = item.options[index] as {
        id: string;
        label: string;
        content?: string;
        isCorrect?: boolean;
        score?: number;
      };
      await exec(`INSERT INTO question_option_version (id, "questionVersionId", "optionKey", value, "orderIndex", "matchRules", metadata)
        VALUES (${q(`${item.versionId}-opt-${option.id}`)}, ${q(item.versionId)}, ${q(option.id)}, ${q(option.content || option.label)}, ${index}, ${json({ isCorrect: option.isCorrect || false, score: option.score })}, ${json(option)})
        ON CONFLICT ("questionVersionId", "optionKey") DO UPDATE SET value = EXCLUDED.value, metadata = EXCLUDED.metadata`);
    }
    if (item.id === "qb-004") {
      await exec(`INSERT INTO question_media (id, "questionVersionId", "mediaType", "storageKey", "mimeType", "orderIndex", metadata)
        VALUES ('media-risk-matrix-assessment', ${q(item.versionId)}, 'file', 'question-bank/risk-matrix.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 0, ${json({ name: "risk-matrix.xlsx" })})
        ON CONFLICT ("questionVersionId", "orderIndex") DO UPDATE SET "storageKey" = EXCLUDED."storageKey"`);
    }
    const classificationId = `class-${item.id}`;
    await exec(`INSERT INTO topic_question_classification (id, "topicId", "questionId", "assessmentContextId", "difficultyLevelId", "cognitiveLevelId", "validatedQuestionVersionId", "classificationStatus", "isPrimary", weight, "createdBy", "createdAt", "updatedAt")
      VALUES (${q(classificationId)}, ${q(item.topicId)}, ${q(item.id)}, 'context-civil-service', ${q(item.difficultyId)}, ${q(item.cognitiveId)}, ${q(item.versionId)}, 'VALID', true, 1, 'mock-assessor', now(), now())
      ON CONFLICT ("topicId", "questionId", "assessmentContextId") DO UPDATE SET "difficultyLevelId" = EXCLUDED."difficultyLevelId", "cognitiveLevelId" = EXCLUDED."cognitiveLevelId", "validatedQuestionVersionId" = EXCLUDED."validatedQuestionVersionId"`);
    await exec(`INSERT INTO topic_question_competence (id, "classificationId", "competenceId", weight, "isPrimary")
      VALUES (${q(`comp-${classificationId}`)}, ${q(classificationId)}, ${q(item.competenceId)}, 1, true)
      ON CONFLICT ("classificationId", "competenceId") DO UPDATE SET weight = EXCLUDED.weight`);
  }
}

async function seedQuizzes() {
  await exec(`INSERT INTO quiz_template (id, "assessmentContextId", code, name, description, "defaultDurationMinutes", "defaultPassingScore", "defaultMaxAttempts", "defaultShuffleQuestions", "defaultShuffleOptions", "lifecycleStatus", "createdBy", "createdAt", "updatedAt")
    VALUES ('template-civil-service-2026', 'context-civil-service', 'civil-service-2026', 'Төрийн албан хаагчийн ерөнхий мэдлэгийн үнэлгээ', 'Runtime mock quiz template', 45, 70, 1, false, true, 'PUBLISHED', 'mock-assessor', now(), now())
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, "lifecycleStatus" = EXCLUDED."lifecycleStatus"`);
  await exec(`INSERT INTO quiz_section (id, "templateId", title, "sectionMode", "orderIndex", "questionCount", "maxScorePerQuestion", "topicId", "difficultyWeights", "selectionStrategy", "shuffleOptions", "createdAt", "updatedAt")
    VALUES ('section-civil-general', 'template-civil-service-2026', 'Ерөнхий мэдлэг', 'FIXED', 1, 3, 10, 'governance', ${json({ easy: 1, medium: 1, hard: 1 })}, 'RANDOM', true, now(), now())
    ON CONFLICT ("templateId", "orderIndex") DO UPDATE SET title = EXCLUDED.title`);
  for (const [index, questionId] of ["runtime-q1", "runtime-q2", "runtime-q3"].entries()) {
    await exec(`INSERT INTO section_question (id, "sectionId", "questionId", "pinnedQuestionVersionId", "versionSelectionMode", "orderIndex", "isRequired", "createdAt")
      VALUES (${q(`section-civil-general-${questionId}`)}, 'section-civil-general', ${q(questionId)}, ${q(`qv-${questionId}-v1`)}, 'PINNED_VERSION', ${index + 1}, true, now())
      ON CONFLICT ("sectionId", "questionId") DO UPDATE SET "orderIndex" = EXCLUDED."orderIndex"`);
  }
  await exec(`INSERT INTO quiz (id, "templateId", code, title, "lifecycleStatus", "createdBy", "createdAt", "updatedAt")
    VALUES ('quiz-civil-service-2026', 'template-civil-service-2026', 'quiz-civil-service-2026', 'Төрийн албан хаагчийн ерөнхий мэдлэгийн үнэлгээ', 'PUBLISHED', 'mock-assessor', now(), now())
    ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, "lifecycleStatus" = EXCLUDED."lifecycleStatus"`);
  await exec(`INSERT INTO quiz_revision (id, "quizId", "revisionNumber", "revisionStatus", "assessmentContextId", title, description, "durationMinutes", "passingScore", "maxAttempts", "shuffleQuestions", "shuffleOptions", "resumeAllowed", "proctoringPolicy", "resultVisibilityPolicy", "runtimePolicy", "paymentRequired", "createdBy", "createdAt", "publishedBy", "publishedAt")
    VALUES ('quiz-revision-civil-service-2026-v1', 'quiz-civil-service-2026', 1, 'PUBLISHED', 'context-civil-service', 'Төрийн албан хаагчийн ерөнхий мэдлэгийн үнэлгээ', 'Published runtime mock revision', 45, 70, 1, false, true, true, ${json({ requireFullscreen: true, maxWarningsBeforeLock: 3 })}, ${json({ hideSolutions: true, showScore: true, resultReleaseMode: "after_close" })}, ${json({ autosaveIntervalSeconds: 5, heartbeatIntervalSeconds: 5 })}, false, 'mock-assessor', now(), 'mock-assessor', now())
    ON CONFLICT ("quizId", "revisionNumber") DO UPDATE SET title = EXCLUDED.title, "revisionStatus" = EXCLUDED."revisionStatus"`);
  await exec(`UPDATE quiz SET "currentPublishedRevisionId" = 'quiz-revision-civil-service-2026-v1' WHERE id = 'quiz-civil-service-2026'`);
  await exec(`INSERT INTO quiz_revision_section (id, "quizRevisionId", "sourceSectionId", title, "sectionMode", "orderIndex", "questionCount", "maxScorePerQuestion", "selectionStrategy", "selectionRuleSnapshot", "shuffleOptions")
    VALUES ('revision-section-civil-general', 'quiz-revision-civil-service-2026-v1', 'section-civil-general', 'Ерөнхий мэдлэг', 'FIXED', 1, 3, 10, 'RANDOM', ${json({ source: "frontend-runtime-mock" })}, true)
    ON CONFLICT ("quizRevisionId", "orderIndex") DO UPDATE SET title = EXCLUDED.title`);
  for (const [index, questionId] of ["runtime-q1", "runtime-q2", "runtime-q3"].entries()) {
    await exec(`INSERT INTO quiz_revision_question (id, "revisionSectionId", "questionId", "questionVersionId", "classificationId", "orderIndex", "maxScore")
      VALUES (${q(`revision-question-${questionId}`)}, 'revision-section-civil-general', ${q(questionId)}, ${q(`qv-${questionId}-v1`)}, ${q(`class-${questionId}`)}, ${index + 1}, ${questions.find((item) => item.id === questionId)?.points || 1})
      ON CONFLICT ("revisionSectionId", "orderIndex") DO UPDATE SET "questionId" = EXCLUDED."questionId", "questionVersionId" = EXCLUDED."questionVersionId"`);
  }
  await exec(`INSERT INTO quiz_schedule (id, "quizRevisionId", code, name, "scheduleType", status, "availableFrom", "availableUntil", "endTimePolicy", "accessMode", capacity, timezone, "createdBy", "createdAt", "updatedAt", "publishedBy", "publishedAt")
    VALUES ('schedule-civil-service-2024', 'quiz-revision-civil-service-2026-v1', 'civil-service-2024', 'Төрийн албан хаагчийн дотоод үнэлгээ - 2024', 'REGULAR', 'OPEN', '2024-05-20T00:00:00Z', '2026-12-31T23:59:59Z', 'EARLIEST_OF_BOTH', 'OPEN_WITH_CODE', 200000, 'Asia/Ulaanbaatar', 'mock-assessor', now(), now(), 'mock-assessor', now())
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status`);
  await exec(`INSERT INTO quiz_user_assignment (id, "scheduleId", "userId", status, "assignedAt", "registeredAt")
    VALUES ('assignment-mock-candidate-civil-service', 'schedule-civil-service-2024', 'mock-candidate', 'ELIGIBLE', now(), now())
    ON CONFLICT ("scheduleId", "userId") DO UPDATE SET status = EXCLUDED.status`);
  await exec(`INSERT INTO quiz_schedule_payment_policy (id, "scheduleId", "paymentRequired", "paymentMode", "defaultAmount", "currencyCode", "refundAllowed", "refundPolicy", "eligibilityRules", "createdAt", "updatedAt")
    VALUES ('payment-policy-civil-service-2024', 'schedule-civil-service-2024', false, 'FREE', 0, 'MNT', false, ${json({})}, ${json({})}, now(), now())
    ON CONFLICT ("scheduleId") DO UPDATE SET "paymentMode" = EXCLUDED."paymentMode"`);

  for (const [code, title, duration, totalPoints, passingPercent, paymentMode, accessMode] of catalogAssessments) {
    const templateId = `template-${code}`;
    const quizId = `quiz-${code}`;
    const revisionId = `revision-${code}-v1`;
    const scheduleId = `schedule-${code}`;
    await exec(`INSERT INTO quiz_template (id, "assessmentContextId", code, name, "defaultDurationMinutes", "defaultPassingScore", "defaultMaxAttempts", "lifecycleStatus", "createdBy", "createdAt", "updatedAt")
      VALUES (${q(templateId)}, 'context-civil-service', ${q(code)}, ${q(title)}, ${duration}, ${passingPercent}, 1, 'PUBLISHED', 'mock-assessor', now(), now())
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name`);
    await exec(`INSERT INTO quiz (id, "templateId", code, title, "lifecycleStatus", "createdBy", "createdAt", "updatedAt")
      VALUES (${q(quizId)}, ${q(templateId)}, ${q(`quiz-${code}`)}, ${q(title)}, 'PUBLISHED', 'mock-assessor', now(), now())
      ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title`);
    await exec(`INSERT INTO quiz_revision (id, "quizId", "revisionNumber", "revisionStatus", "assessmentContextId", title, "durationMinutes", "passingScore", "maxAttempts", "proctoringPolicy", "resultVisibilityPolicy", "runtimePolicy", "paymentRequired", "createdBy", "createdAt", "publishedBy", "publishedAt")
      VALUES (${q(revisionId)}, ${q(quizId)}, 1, 'PUBLISHED', 'context-civil-service', ${q(title)}, ${duration}, ${passingPercent}, 1, ${json({})}, ${json({ showScore: true })}, ${json({})}, ${q(paymentMode !== "FREE")}, 'mock-assessor', now(), 'mock-assessor', now())
      ON CONFLICT ("quizId", "revisionNumber") DO UPDATE SET title = EXCLUDED.title`);
    await exec(`UPDATE quiz SET "currentPublishedRevisionId" = ${q(revisionId)} WHERE id = ${q(quizId)}`);
    await exec(`INSERT INTO quiz_schedule (id, "quizRevisionId", code, name, "scheduleType", status, "availableFrom", "availableUntil", "endTimePolicy", "accessMode", timezone, "createdBy", "createdAt", "updatedAt", "publishedBy", "publishedAt")
      VALUES (${q(scheduleId)}, ${q(revisionId)}, ${q(code)}, ${q(title)}, 'REGULAR', 'OPEN', now(), '2026-12-31T23:59:59Z', 'EARLIEST_OF_BOTH', ${q(accessMode)}, 'Asia/Ulaanbaatar', 'mock-assessor', now(), now(), 'mock-assessor', now())
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status`);
    await exec(`INSERT INTO quiz_schedule_payment_policy (id, "scheduleId", "paymentRequired", "paymentMode", "defaultAmount", "currencyCode", "refundAllowed", "refundPolicy", "eligibilityRules", "createdAt", "updatedAt")
      VALUES (${q(`payment-policy-${code}`)}, ${q(scheduleId)}, ${q(paymentMode !== "FREE")}, ${q(paymentMode)}, ${q(paymentMode === "FREE" ? 0 : 25000)}, 'MNT', false, ${json({})}, ${json({})}, now(), now())
      ON CONFLICT ("scheduleId") DO UPDATE SET "paymentMode" = EXCLUDED."paymentMode", "defaultAmount" = EXCLUDED."defaultAmount"`);
  }
}

async function main() {
  await seedLookups();
  await seedQuestions();
  await seedQuizzes();
  console.log("------------------   Assessment mock seed completed.   ----------------");
}

main()
  .catch((error) => {
    console.error("Assessment seed failed:", error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
