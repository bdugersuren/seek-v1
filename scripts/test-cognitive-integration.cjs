// Isolated verification database only. Credentials are supplied through environment.
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const r = createRequire('/app/services/assessment/package.json');
r('reflect-metadata');
const { PrismaService } = r('./dist/src/prisma.service');
const { CognitiveService } = r('./dist/src/cognitive.service');
if (process.env.AUDIENCE_TEST_ENV !== 'seek-verify') throw new Error('Verification environment required');
const p = new PrismaService(), s = new CognitiveService(p);
const code = 'COG_TEST_' + Date.now();
let framework, other;
(async () => {
  framework = await s.saveFramework({ code, name: 'Test framework', description: 'Description', frameworkVersion: '1.0' });
  other = await s.saveFramework({ code: code + '_OTHER', name: 'Other' });
  const root = await s.saveLevel({ cognitiveFrameworkId: framework.id, code: 'ROOT', name: 'Root', rank: 1 });
  const child = await s.saveLevel({ cognitiveFrameworkId: framework.id, code: 'CHILD', name: 'Child', rank: 2, parentId: root.id, description: 'Child description', icon: 'brain', reportBucket: 'R1', isActive: false });
  const saved = (await s.levels(framework.id)).find(x => x.id === child.id);
  assert.equal(saved.parentId, root.id); assert.equal(saved.description, 'Child description');
  assert.equal(saved.icon, 'brain'); assert.equal(saved.reportBucket, 'R1'); assert.equal(saved.isActive, false);
  assert.equal((await s.frameworks()).find(x => x.id === framework.id).levelCount, 2);
  await s.saveFramework({ frameworkVersion: '2.0', description: null, isActive: false }, framework.id);
  const f = (await s.frameworks()).find(x => x.id === framework.id);
  assert.equal(f.frameworkVersion, '2.0'); assert.equal(f.description, null); assert.equal(f.isActive, false);
  await assert.rejects(async () => s.saveLevel({ code: 'BAD', name: 'Bad', rank: 3 }), e => e.status === 400);
  await assert.rejects(async () => s.saveLevel({ cognitiveFrameworkId: other.id, code: 'BAD', name: 'Bad', parentId: root.id, rank: 1 }), e => e.status === 400);
  await assert.rejects(async () => s.saveLevel({ parentId: child.id }, root.id), e => e.status === 400);
  await assert.rejects(async () => s.saveLevel({ rank: 1.5 }, child.id), e => e.status === 400);
  await assert.rejects(async () => s.saveLevel({ rank: 1 }, child.id), e => e.status === 409);
  await assert.rejects(async () => s.saveLevel({ cognitiveFrameworkId: framework.id, code: 'CHILD', name: 'Duplicate', rank: 9 }), e => e.status === 409);
  await assert.rejects(async () => s.deleteFramework(framework.id), e => e.status === 409);
  await assert.rejects(async () => s.deleteLevel(root.id), e => e.status === 409);
  await assert.rejects(async () => s.saveLevel({ name: 'Missing' }, 'missing'), e => e.status === 404);
  await s.saveLevel({ parentId: null, icon: null, reportBucket: null, isActive: true }, child.id);
  const cleared = (await s.levels(framework.id)).find(x => x.id === child.id);
  assert.equal(cleared.parentId, null); assert.equal(cleared.icon, null); assert.equal(cleared.reportBucket, null);
  const outcomes = await Promise.allSettled([s.saveLevel({ parentId: child.id }, root.id), s.saveLevel({ parentId: root.id }, child.id)]);
  assert.equal(outcomes.filter(x => x.status === 'fulfilled').length, 1);
  console.log('PASS cognitive PostgreSQL CRUD, persistence, nullable fields, framework scope, duplicate code/rank, missing row, protected deletion, concurrent cycle');
})().finally(async () => {
  for (const f of [framework, other]) if (f) {
    await p.cognitiveLevel.updateMany({ where: { cognitiveFrameworkId: f.id }, data: { parentId: null } });
    await p.cognitiveLevel.deleteMany({ where: { cognitiveFrameworkId: f.id } });
    await p.cognitiveFramework.delete({ where: { id: f.id } });
  }
  await p.$disconnect();
}).catch(e => { console.error(e.message); process.exitCode = 1; });
