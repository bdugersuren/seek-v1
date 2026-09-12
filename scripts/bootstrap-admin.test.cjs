const assert = require('node:assert/strict');
const {validateInput, provision} = require('./bootstrap-admin.cjs');
const password = 'test-only-password-12345';
(async () => {
  assert.equal(validateInput({email:' Admin@Example.com ',password}).role,'SUPER_ADMIN');
  assert.equal(validateInput({email:' Admin@Example.com ',password}).email,'admin@example.com');
  for (const role of ['VIEWER','super_admin','',null]) assert.throws(()=>validateInput({email:'a@example.com',password,role}));
  assert.throws(()=>validateInput({email:'bad',password}));
  assert.throws(()=>validateInput({email:'a@example.com',password:'short'}));
  assert.throws(()=>validateInput({email:'a@example.com',password:'я'.repeat(37)}));
  for (const role of ['SUPER_ADMIN','ASSESSOR']) {
    let created, event;
    const tx={userAccount:{findUnique:async()=>null,create:async args=>{created=args.data;return {id:'test-id'};}},role:{upsert:async()=>{},findUniqueOrThrow:async args=>({id:args.where.name})},securityEvent:{create:async args=>{event=args.data;}}};
    const result=await provision({$transaction:fn=>fn(tx)},{hash:async()=> 'hashed-test-password'},{email:'Test@Example.com',password,role});
    assert.equal(result.role,role);
    assert.equal(created.roles.create.roleId,role);
    assert.equal(created.credentials.create.value,'hashed-test-password');
    assert.equal(created.status,'ACTIVE');assert.equal(created.isEmailVerified,true);
    assert.equal(event.userAccountId,'test-id');assert.equal(JSON.parse(event.payload).role,role);
    assert.ok(!JSON.stringify(event).includes(password));
  }
  const tx={userAccount:{findUnique:async()=>({id:'existing'})},role:{upsert:async()=>assert.fail('must not write roles')}};
  await assert.rejects(provision({$transaction:fn=>fn(tx)},{hash:async()=> 'hash'},{email:'a@example.com',password,role:'ASSESSOR'}),{code:'ACCOUNT_EXISTS'});
  console.log('PASS: role selection/default, input validation, hashed credential, audit, existing-account protection');
})().catch(err=>{console.error(err);process.exitCode=1;});
