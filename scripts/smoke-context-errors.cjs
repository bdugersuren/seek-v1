const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const input=JSON.parse(require('fs').readFileSync(0,'utf8'));
(async()=>{
 assert.equal((await require('dns').promises.lookup('seek.mn')).address,input.verificationAddress);
 const browser=await chromium.launch({headless:true});
 try {
 const page=await browser.newPage({ignoreHTTPSErrors:true});
 await page.goto('https://seek.mn/login');
 await page.locator('input[type=email]').fill(input.email);await page.locator('input[type=password]').fill(input.password);
 await page.locator('button[type=submit]').click();await page.waitForURL('**/assessor/**');
 let status=403,count=0;
 await page.route('**/api/v1/assessment/**',route=>{count++;return route.fulfill({status,contentType:'application/json',body:status===200?'[]':'{"message":"Forbidden"}'});});
 console.log('stage list');
 await page.goto('https://seek.mn/assessor/context');
 await page.getByRole('alert').filter({hasText:'Контекстийг харах эрх хүрэлцэхгүй'}).waitFor().catch(async e=>{console.log('URL',page.url(),'requests',count,'alerts',await page.getByRole('alert').allTextContents());throw e;});
 assert.equal(await page.getByText('Үнэлгээний контекст олдсонгүй',{exact:true}).count(),0);
 const before=count;status=500;await page.getByRole('button',{name:'Дахин оролдох'}).click();
 await page.getByRole('alert').filter({hasText:'Контекстийн мэдээллийг татаж чадсангүй'}).waitFor();assert(count>before);
 status=200;await page.getByRole('button',{name:'Дахин оролдох'}).click();
 await page.getByText('Танд ашиглах боломжтой контекст одоогоор алга',{exact:true}).waitFor();
 console.log('stage dashboard');status=403;await page.goto('https://seek.mn/assessor/context/test-context');
 await page.getByRole('alert').filter({hasText:'Контекстийг харах эрх хүрэлцэхгүй'}).waitFor().catch(async e=>{console.log('URL',page.url(),'requests',count,'alerts',await page.getByRole('alert').allTextContents());throw e;});
 assert.equal(await page.getByText('Үнэлгээний контекст олдсонгүй',{exact:true}).count(),0);
 console.log('PASS: context list/dashboard 403, server error, retry and genuine empty states');
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
