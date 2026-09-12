// Run only inside the isolated seek-check container, with verification database credentials.
const assert=require('node:assert/strict');
const {createRequire}=require('node:module');
const r=createRequire('/app/services/assessment/package.json');
r('reflect-metadata');
const {PrismaService}=r('./dist/src/prisma.service');
const {AudienceService}=r('./dist/src/audience.service');
if(process.env.AUDIENCE_TEST_ENV!=='seek-verify')throw new Error('Isolated verification environment required');
const p=new PrismaService(),s=new AudienceService(p);
const code='TEST_'+Date.now();let type,other;
(async()=>{
 type=await s.saveType({name:'Сурагч',code,description:'integration fixture'});
 other=await s.saveType({name:'Багш',code:code+'_OTHER'});
 const root=await s.saveLevel({audienceTypeId:type.id,name:'Бага боловсрол',code:'PRIMARY',levelKind:'GROUP'});
 const child=await s.saveLevel({audienceTypeId:type.id,name:'1-р анги',code:'GRADE_1',parentId:root.id,orderIndex:0,externalCode:'EXT',levelKind:'GRADE_LEVEL',isActive:false});
 const saved=(await s.levels(type.id)).find(x=>x.id===child.id);
 assert.equal(saved.parentId,root.id);assert.equal(saved.orderIndex,0);assert.equal(saved.externalCode,'EXT');assert.equal(saved.isActive,false);
 assert.equal((await s.types()).find(x=>x.id===type.id).levelCount,2);
 await assert.rejects(s.saveLevel({parentId:child.id},root.id),e=>e.status===400);
 await assert.rejects(s.saveLevel({audienceTypeId:other.id,name:'Bad',code:'BAD',parentId:root.id}),e=>e.status===400);
 await assert.rejects(s.deleteLevel(root.id),e=>e.status===409);
 await assert.rejects(s.deleteType(type.id),e=>e.status===409);
 await assert.rejects(s.saveLevel({audienceTypeId:type.id,name:'Duplicate',code:'GRADE_1'}),e=>e.status===409);
 await s.saveLevel({parentId:null,externalCode:null,isActive:true},child.id);
 const outcomes=await Promise.allSettled([s.saveLevel({parentId:child.id},root.id),s.saveLevel({parentId:root.id},child.id)]);
 assert.equal(outcomes.filter(x=>x.status==='fulfilled').length,1,'concurrent cycle must not commit');
 console.log('PASS: PostgreSQL hierarchy CRUD, counts, nullable clearing, duplicate/in-use protection, concurrent cycle rejection');
})().finally(async()=>{
 for(const t of [type,other])if(t){await p.audienceLevel.updateMany({where:{audienceTypeId:t.id},data:{parentId:null}});await p.audienceLevel.deleteMany({where:{audienceTypeId:t.id}});await p.audienceType.delete({where:{id:t.id}});}
 await p.$disconnect();
}).catch(e=>{console.error(e.message);process.exitCode=1;});
