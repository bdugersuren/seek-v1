// Operator-only provisioning. Credentials arrive on stdin, never argv/logs.
const fs = require('node:fs');
const { createRequire } = require('node:module');
const ROLES = ['SUPER_ADMIN','ORGANIZATION_ADMIN','ASSESSOR','VIEWER','TESTER','CANDIDATE'];

function validateInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected a JSON object');
  const {email, password, role = 'SUPER_ADMIN'} = input;
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('A valid email is required');
  // bcrypt only uses the first 72 bytes; reject passwords that would be truncated.
  if (typeof password !== 'string' || password.length < 16 || Buffer.byteLength(password, 'utf8') > 72) throw new Error('Password must have at least 16 characters and at most 72 UTF-8 bytes');
  if (!['SUPER_ADMIN','ASSESSOR'].includes(role)) throw new Error('Role must be SUPER_ADMIN or ASSESSOR');
  return {email: email.trim().toLowerCase(), password, role};
}

async function provision(prisma, bcrypt, input) {
  const {email, password, role: roleName} = validateInput(input);
  const value = await bcrypt.hash(password, 12);
  return prisma.$transaction(async tx => {
    if (await tx.userAccount.findUnique({where:{email}})) {
      const error = new Error('Account already exists; credentials and roles were not changed');
      error.code = 'ACCOUNT_EXISTS';
      throw error;
    }
    for (const name of ROLES) await tx.role.upsert({where:{name},update:{},create:{name}});
    const role = await tx.role.findUniqueOrThrow({where:{name:roleName}});
    const user = await tx.userAccount.create({data:{email,status:'ACTIVE',isEmailVerified:true,credentials:{create:{type:'PASSWORD',value}},roles:{create:{roleId:role.id}}}});
    await tx.securityEvent.create({data:{userAccountId:user.id,eventType:roleName === 'SUPER_ADMIN' ? 'ADMIN_BOOTSTRAPPED' : 'USER_PROVISIONED',payload:JSON.stringify({email,role:roleName,source:'operator-bootstrap'})}});
    return {id:user.id, role:roleName};
  });
}

async function main() {
  let input;
  try { input = validateInput(JSON.parse(fs.readFileSync(0,'utf8'))); }
  catch (error) { console.error(error instanceof SyntaxError ? 'Invalid JSON input' : error.message); process.exitCode=1; return; }
  let prisma;
  try {
    const localRequire = createRequire('/app/services/auth/package.json');
    const {PrismaClient} = localRequire('@prisma/client');
    prisma = new PrismaClient();
    const result = await provision(prisma, localRequire('bcryptjs'), input);
    console.log(result.role + ' account created successfully.');
  } catch (error) {
    // Prisma error details may contain input values: do not print them.
    console.error(error.code === 'ACCOUNT_EXISTS' || error.code === 'P2002' ? 'Account already exists; credentials and roles were not changed' : 'User creation failed; no credentials printed. Check database availability.');
    process.exitCode=1;
  } finally { if (prisma) await prisma.$disconnect(); }
}
module.exports = {validateInput, provision, main};
if (require.main === module) main();
