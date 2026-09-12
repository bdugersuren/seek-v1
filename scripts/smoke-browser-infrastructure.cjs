// Isolated verification HTTPS only; the certificate is intentionally self-signed.
const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
(async()=>{
  const browser=await chromium.launch({headless:true});
  try {
    const context=await browser.newContext({ignoreHTTPSErrors:true});
    const page=await context.newPage();
    const email=`browser-${crypto.randomUUID()}@example.invalid`;
    const password=crypto.randomBytes(24).toString('hex');
    await page.goto('https://seek.mn/register');
    await page.locator('input[type=text]').fill('Verification User');
    await page.locator('input[type=email]').fill(email);
    await page.locator('input[type=tel]').fill('99112233');
    await page.locator('input[type=password]').nth(0).fill(password);
    await page.locator('input[type=password]').nth(1).fill(password);
    const registered=page.waitForResponse(r=>r.url().endsWith('/auth/register') && r.request().method()==='POST');
    await page.locator('button[type=submit]').click();
    assert.equal((await registered).status(),201);
    const messages=await fetch('http://mailpit:8025/api/v1/messages').then(r=>r.json());
    const found=messages.messages.find(m=>m.To.some(to=>to.Address===email));
    assert(found,'Verification mail must arrive');
    const message=await fetch(`http://mailpit:8025/api/v1/message/${found.ID}`).then(r=>r.json());
    const link=message.Text.match(/https:\/\/seek\.mn\/[^\s]+/)[0];
    const verified=page.waitForResponse(r=>r.url().endsWith('/auth/verify-email') && r.request().method()==='POST');
    await page.goto(link);
    assert.equal((await verified).status(),200);
    await page.goto('https://seek.mn/login');
    await page.locator('input[type=email]').fill(email);
    await page.locator('input[type=password]').fill(password);
    const loggedIn=page.waitForResponse(r=>r.url().endsWith('/auth/login') && r.request().method()==='POST');
    await page.locator('button[type=submit]').click();
    assert.equal((await loggedIn).status(),201);
    await page.waitForURL(url=>url.pathname!='/login');
    const cookie=(await context.cookies('https://seek.mn')).find(c=>c.name==='refresh_token');
    assert(cookie && cookie.secure && cookie.httpOnly && cookie.domain==='.seek.mn');
    const catalog=await page.goto('https://seek.mn/catalog');
    assert.equal(catalog.status(),200);assert.equal(new URL(page.url()).pathname,'/catalog');
    const optional=await page.goto('https://seek.mn/payments');
    assert.equal(optional.status(),404);
    console.log('PASS: Chromium registration, Mailpit verification link, login, shared Secure/HttpOnly cookie, catalog navigation, disabled payments route over isolated HTTPS. Public DNS/certificate and real attempt lifecycle were not tested.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
