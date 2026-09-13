const assert=require('node:assert/strict'),fs=require('fs'),{createRequire}=require('module');
const input=JSON.parse(fs.readFileSync(0,'utf8'));assert.equal(input.environment,'seek-verify');
const ar=createRequire('/app/services/auth/package.json');const db=new(ar('@prisma/client').PrismaClient)({datasources:{db:{url:input.authUrl}}});
const id='RESULTS_'+Date.now(),email=id.toLowerCase()+'@example.test',password=require('crypto').randomBytes(24).toString('base64url');
(async()=>{let browser;try{
 assert.equal((await require('dns').promises.lookup('seek.mn')).address,input.verificationAddress);
 const role=await db.role.findUniqueOrThrow({where:{name:'ASSESSOR'}});
 await db.userAccount.create({data:{id,email,status:'ACTIVE',isEmailVerified:true,credentials:{create:{value:await ar('bcryptjs').hash(password,10)}},roles:{create:{roleId:role.id}}}});
 browser=await require('/app/node_modules/@playwright/test').chromium.launch({headless:true});
 const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('https://seek.mn/login');await page.locator('input[type=email]').fill(email);await page.locator('input[type=password]').fill(password);await page.locator('button[type=submit]').click();await page.waitForURL(u=>!u.pathname.endsWith('/login'));
 const url='https://seek.mn/assessor/results';await page.goto(url);await page.getByRole('heading',{name:'Мэдлэг ба шийдвэр гаргалт'}).waitFor();
 fs.mkdirSync('/tmp/results-demo',{recursive:true});
 const types=['SINGLE_CHOICE','MULTIPLE_CHOICE','TRUE_FALSE','ORDERING','MATCHING','SHORT_TEXT','FILL_BLANK','MATRIX','NUMERIC','LIKERT','SJT','CASE_BUNDLE','ESSAY'];
 for(const width of [375,768,1280,1440]){
 await page.setViewportSize({width,height:1000});
 for(const view of ['assessor','candidate']){
 await page.getByRole('combobox',{name:/^Харах өнцөг/}).selectOption(view);
 for(const tab of ['analysis','solutions','top-scorers']){
 await page.locator('#tab-'+tab).click();await page.waitForTimeout(100);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow ${width} ${view} ${tab}`);
 await page.screenshot({path:`/tmp/results-demo/${view}-${tab}-${width}.png`,fullPage:true});
 }
 }
 }
 await page.setViewportSize({width:1280,height:1000});await page.locator('#tab-solutions').click();
 for(let i=0;i<types.length;i++){
 await page.getByRole('combobox',{name:/^Асуултын төрөл/}).selectOption(types[i]);await page.getByTestId('solution-'+types[i]).waitFor(); if(i===0)assert.equal(await page.getByRole('combobox',{name:'Харах өнцөг',exact:true}).count(),1);
 await page.screenshot({path:`/tmp/results-demo/type-${types[i]}.png`,fullPage:true});
 await page.setViewportSize({width:375,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile type '+types[i]);await page.screenshot({path:`/tmp/results-demo/mobile-type-${types[i]}.png`,fullPage:true});await page.setViewportSize({width:1280,height:1000});
 }
 await page.reload();await page.getByTestId('solution-ESSAY').waitFor();await page.getByRole('button',{name:'Шүүлтүүр цэвэрлэх'}).click();await page.getByLabel('Асуултаас хайх',{exact:true}).fill('NOT_A_REAL_QUESTION');await page.getByText('Шүүлтүүрт тохирох асуулт алга.',{exact:false}).waitFor();await page.getByRole('button',{name:'Шүүлтүүр цэвэрлэх'}).click();
 await page.getByRole('combobox',{name:/^Асуултын төрөл/}).selectOption('MATRIX');await page.getByTestId('solution-MATRIX').waitFor();
 await page.getByRole('combobox',{name:/^Жишиг төлөв/}).selectOption('locked');assert.equal(await page.getByRole('heading',{name:'Тайлбар ба оноолт'}).count(),0);assert(!(await page.getByTestId('solution-MATRIX').innerText()).includes('✓ Зөв хариулт'));
 await page.screenshot({path:'/tmp/results-demo/locked-state.png',fullPage:true});await page.emulateMedia({media:'print'});await page.pdf({path:'/tmp/results-demo/locked-report.pdf',format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});
 await page.getByRole('combobox',{name:/^Жишиг төлөв/}).selectOption('pending');await page.locator('#tab-analysis').click();await page.getByText('Хүлээгдэж байна',{exact:true}).waitFor();await page.screenshot({path:'/tmp/results-demo/pending-state.png',fullPage:true});await page.locator('#tab-top-scorers').click();await page.getByText('Эцэслэн үнэлэгдсэн оролдлого алга.',{exact:true}).waitFor();
 await page.getByRole('combobox',{name:/^Жишиг төлөв/}).selectOption('empty');for(const tab of ['analysis','solutions','top-scorers']){await page.locator('#tab-'+tab).click();await page.getByRole('heading',{name:'Мэдлэг ба шийдвэр гаргалт'}).waitFor();await page.getByText('Харуулах мэдээлэл алга',{exact:true}).waitFor();await page.screenshot({path:`/tmp/results-demo/empty-${tab}.png`,fullPage:true})}
 await page.getByRole('combobox',{name:/^Жишиг төлөв/}).selectOption('graded');await page.getByRole('combobox',{name:/^Харах өнцөг/}).selectOption('assessor');await page.locator('#tab-top-scorers').click();await page.locator('tbody button').first().click();assert(new URL(page.url()).searchParams.get('tab')==='analysis');
 await page.locator('tbody button').filter({hasText:'Q8'}).click();await page.getByTestId('solution-MATRIX').waitFor();const saved=page.url();await page.reload();await page.getByTestId('solution-MATRIX').waitFor();assert.equal(page.url(),saved);
 await page.locator('#tab-analysis').click();await page.goBack();await page.getByTestId('solution-MATRIX').waitFor();
 await page.locator('#tab-solutions').focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.getElementById('tab-top-scorers').getAttribute('aria-selected')==='true');
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('header .no-print').first().evaluate(e=>getComputedStyle(e).display),'none');await page.pdf({path:'/tmp/results-demo/report.pdf',format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});
 let printed=false;await page.exposeFunction('testPrinted',()=>{printed=true});await page.evaluate(()=>window.print=()=>window.testPrinted());await page.getByRole('button',{name:'Хэвлэх / PDF'}).click();assert(printed);
 // Existing admin route uses its unchanged contract and still renders.
 const admin=await browser.newContext({ignoreHTTPSErrors:true});const ap=await admin.newPage();await ap.goto('https://seek.mn/login');await ap.locator('input[type=email]').fill(input.admin.email);await ap.locator('input[type=password]').fill(input.admin.password);await ap.locator('button[type=submit]').click();await ap.waitForURL(u=>!u.pathname.endsWith('/login'));await ap.goto('https://seek.mn/admin/results');await ap.getByRole('heading',{name:'cvbcv Results'}).waitFor();await ap.getByRole('button',{name:'Solutions',exact:true}).click();await ap.getByText('5/6 - 1/3 үйлдлийг гүйцэтгэнэ үү.',{exact:true}).waitFor();
 assert.deepEqual(errors,[]);console.log('PASS: 2 perspectives × 3 tabs × 4 widths; 13 renderers; filters; pending/locked/empty; URL reload/back; keyboard; print/PDF; admin regression.');
 }catch(e){console.error(e);process.exitCode=1}finally{if(browser)await browser.close();await db.userAccount.deleteMany({where:{id}});await db.$disconnect()}})();
