const assert = require("node:assert/strict");
module.exports = async ({ input, db, ids, created, credentials }) => {
  const { chromium } = require("/app/node_modules/@playwright/test");
  assert.equal(
    (await require("dns").promises.lookup("seek.mn")).address,
    input.verificationAddress,
  );
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("https://seek.mn/login");
    await page.locator("input[type=email]").fill(credentials.email);
    await page.locator("input[type=password]").fill(credentials.password);
    await page.locator("button[type=submit]").click();
    await page.waitForURL((url) => !url.pathname.endsWith("/login"));
    const url = `https://seek.mn/assessor/context/${ids.context}/question-bank`;
    await page.goto(url);
    await page.getByRole("button", { name: "Жагсаалт", exact: true }).click();
    await page.locator("tbody tr").first().waitFor();
    await page.waitForFunction(
      () => document.querySelectorAll("tbody tr").length === 13,
    );
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    const body = await page.locator("body").innerText();
    assert(!body.includes("Short Answer"));
    assert(!body.includes("78%"));
    assert(body.includes("Тусгай түвшин"));
    assert(body.includes("Хянагдаж"));
    const row = page.locator("tbody tr").filter({ hasText: "Асуулт MATRIX" });
    await row.locator('button[title="Харах"]').click();
    await page
      .getByRole("table", { name: "Матрицын зөв хариулт ба оноо" })
      .waitFor();
    assert.equal(
      await page.getByLabel("Зөв хариулт", { exact: true }).count(),
      1,
    );
    await page.screenshot({
      path: "/tmp/question-bank-matrix.png",
      fullPage: true,
    });
    await page.goto(url);
    await page.locator("tbody tr").first().waitFor();
    const search = page.getByPlaceholder(
      "Код, гарчиг, асуултын текстээр хайх...",
    );
    await search.fill("MULTIPLE_CHOICE");
    await page.waitForFunction(
      () => document.querySelectorAll("tbody tr").length === 1,
    );
    assert(
      (await page.locator("tbody tr").innerText()).includes("Олон сонголт"),
    );
    await search.fill("");
    await page.waitForFunction(
      () => document.querySelectorAll("tbody tr").length === 13,
    );
    await page.locator('select:has(option[value="10"])').selectOption("10");
    await page.waitForFunction(
      () => document.querySelectorAll("tbody tr").length === 10,
    );
    await page.getByRole("button", { name: "2", exact: true }).click();
    await page.waitForFunction(
      () => document.querySelectorAll("tbody tr").length === 3,
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Карт", exact: true }).click();
    await page.screenshot({
      path: "/tmp/question-bank-mobile.png",
      fullPage: true,
    });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    // Persist an additional answer through the real editor and reload.
    const q = await db.question.findFirst({
      where: {
        id: { in: created },
        versions: { some: { type: "MULTIPLE_CHOICE" } },
      },
      include: { versions: { orderBy: { versionNumber: "desc" } } },
    });
    const workflow = require("/app/services/assessment/src/question-workflow");
    await workflow.transitionQuestion(
      db,
      q.id,
      {
        action: "withdraw",
        questionVersionId: q.versions[0].id,
        expectedRevision: q.revision,
        requestId: "browser-withdraw-" + q.id,
      },
      { id: q.ownerUserId, roles: ["ASSESSOR"] },
    );
    await page.goto(url + "/" + q.id);
    await page
      .getByRole("button", { name: "Сонголт нэмэх", exact: true })
      .click();
    await page.getByPlaceholder(/^Хариулт C-ийн/).fill("Шинээр нэмсэн хариулт");
    const save = page.waitForResponse(
      (r) =>
        r.url().endsWith("/assessment/questions/" + q.id) &&
        r.request().method() === "PUT",
    );
    await page.locator('button[title="Хадгалах"]').click();
    assert.equal((await save).status(), 200);
    await page.reload();
    await page.waitForFunction(() =>
      [...document.querySelectorAll("textarea")].some(
        (t) => t.value === "Шинээр нэмсэн хариулт",
      ),
    );
    assert(
      !(await page.locator("body").innerText()).includes("stable-random-id"),
    );
    const v = await db.questionVersion.findFirst({
      where: { questionId: q.id },
      orderBy: { versionNumber: "desc" },
      include: { options: { orderBy: { orderIndex: "asc" } } },
    });
    assert.equal(v.options.length, 3);
    assert.equal(v.options[2].metadata.displayLabel, "C");
    // The real editor must save and submit both structured answer types.
    for (const type of ["MATCHING", "MATRIX"]) {
      const item=await db.question.findFirst({where:{id:{in:created},versions:{some:{type}}},include:{versions:{orderBy:{versionNumber:"desc"}}}});
      await workflow.transitionQuestion(db,item.id,{action:"withdraw",questionVersionId:item.versions[0].id,expectedRevision:item.revision,requestId:"browser-withdraw-"+item.id},{id:item.ownerUserId,roles:["ASSESSOR"]});
      await page.goto(url+"/"+item.id);
      if(type==="MATCHING"){
        await page.getByLabel("Мөр 1 харгалзах хариулт",{exact:true}).selectOption("R2");
        await page.getByLabel("Мөр 2 харгалзах хариулт",{exact:true}).selectOption("R1");
      }else{
        await page.getByLabel("Мөр 1: Үгүй",{exact:true}).check();
      }
      await page.getByRole("button",{name:"Дараах",exact:true}).click();
      await page.getByRole("button",{name:"Дараах",exact:true}).click();
      const submitted=page.waitForResponse(r=>r.url().endsWith("/assessment/questions/"+item.id+"/workflow")&&r.request().method()==="POST");
      await page.getByRole("button",{name:"Батлуулах хүсэлт илгээх",exact:true}).last().click();
      assert.equal((await submitted).status(),201);
      const stored=await db.questionVersion.findFirst({where:{questionId:item.id},orderBy:{versionNumber:"desc"},include:{options:{orderBy:{orderIndex:"asc"}}}});
      assert.equal(stored.versionStatus,"IN_REVIEW");
      assert.equal(stored.options[0].matchRules.matchValue,type==="MATCHING"?"R2":"no");
    }
    // Error and recovery are distinct from empty results.
    await page.route("**/api/v1/assessment/questions?*", (route) =>
      route.request().url().includes("bank=true")
        ? route.fulfill({ status: 503, json: { message: "test unavailable" } })
        : route.continue(),
    );
    await page.goto(url);
    await page
      .getByRole("alert")
      .filter({ hasText: "Асуултын санг ачаалж чадсангүй" })
      .waitFor();
    await page.unroute("**/api/v1/assessment/questions?*");
    await page
      .getByRole("button", { name: "Дахин оролдох", exact: true })
      .click();
    await page
      .getByRole("alert")
      .filter({ hasText: "Асуултын санг ачаалж чадсангүй" })
      .waitFor({ state: "hidden" });
    assert.deepEqual(errors, []);
    console.log(
      "PASS browser: all types, custom difficulty/status, matrix preview, search/pagination, mobile, option add/save/reload, load error/retry.",
    );
  } finally {
    await browser.close();
  }
};
