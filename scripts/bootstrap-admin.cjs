// Run inside auth container; JSON credentials arrive on stdin, never argv/logs.
const fs = require('node:fs');
const {createRequire} = require('node:module');
const localRequire = createRequire('/app/services/auth/package.json');
const {PrismaClient} = localRequire('@prisma/client');
const bcrypt = localRequire('bcryptjs');
const prisma = new PrismaClient();
(async () => {
  const {email, password} = JSON.parse(fs.readFileSync(0, 'utf8'));
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || password.length < 16) throw new Error('Valid email and password of at least 16 characters required');
  const normalized = email.trim().toLowerCase();
  const value = await bcrypt.hash(password, 12);
  await prisma.$transaction(async tx => {
    const roles = ['SUPER_ADMIN','ORGANIZATION_ADMIN','ASSESSOR','VIEWER','TESTER','CANDIDATE'];
    for (const name of roles) await tx.role.upsert({where:{name},update:{},create:{name}});
    if (await tx.userAccount.findUnique({where:{email:normalized}})) throw new Error('Account already exists; refusing to change its credentials or roles');
    const role = await tx.role.findUniqueOrThrow({where:{name:'SUPER_ADMIN'}});
    await tx.userAccount.create({data:{email:normalized,status:'ACTIVE',isEmailVerified:true,credentials:{create:{type:'PASSWORD',value}},roles:{create:{roleId:role.id}}}});
    await tx.securityEvent.create({data:{eventType:'ADMIN_BOOTSTRAPPED',payload:JSON.stringify({email:normalized})}});
  });
  console.log('Administrator created successfully.');
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
