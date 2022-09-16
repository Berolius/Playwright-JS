// not always all information is in cookies
///this type of API test has advantage if many tests. SO after beforeAll we login and then many TC will run from there
// LOgin UI -> after login, we collect all information from storage, .json

//test brwoser -> .json(full storage state), card-,order, orderdetails, orderhistory,
const { test, expect } = require("@playwright/test");
let webContext;
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext(); //this two lines very beginning of Playwright
  const page = await context.newPage(); ////this two lines very beginning of Playwright

  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").type("berolius@gmail.com");
  await page.locator("#userPassword").type("Berolius001");
  await page.locator("[value='Login']").click();
  await page.waitForLoadState("networkidle");

  await context.storageState({ path: "state.json" }); ///invokes all data from browser! all tabs, pages, cookies, etc.
  //so 1 json file will be created with all info
  webContext = await browser.newContext({ storageState: "state.json" }); //we create new browser as before, but now it
  //...will have knowledge of all previous tokens and cookies. Simply, will be like logged in user

  ///DEBUG NOTES!!!!!!
  ///if not classic web (mixed with api) NO CLASSIC DEBUG WITH PW INSPECTOR, BUT IS DONE FROM PACKAGE.JSON.
  ///then in packaje.json - command npx playwright test/tests/webAPIpart2.spec.js --headed, then shift ctrl b,(fn f1) debug npn script
});

//After we first login and store data in pretest, we retrieve it in main test

test("first assignment", async () => {
  const productName = "zara coat 3";
  // const username = page.locator("#userEmail");
  // const password = page.locator("#userPassword");
  // const signInBTN = page.locator("[value='Login']");
  const page = await webContext.newPage(); //so json storage for const page data
  await page.goto("https://rahulshettyacademy.com/client");
  const products = page.locator(".card-body");

  const email = "berolius@gmail.com";

  const count = await products.count();
  for (let i = 0; i < count; ++i) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      //will look for value not on entire page, but in products.nth scope!called chaining b locator is exactly zara coat 4
      await products.nth(i).locator("text= Add To Cart").click(); ///add to card. first time, selector with text. otherwise, whole items would be
      break; //once product is found, no loop anymore
    }
  }
  await page.locator("[routerlink*='cart']").click();
  await page.locator("div li").first().waitFor(); //after all list items load, only then test.because isVisible has no autowait
  const bool = await page.locator("h3:has-text('zara coat 3')").isVisible(); //to avoid conflict with the same zara coat 3, we define it by a tag
  expect(bool).toBeTruthy(); //but it is not waiting (see in dev  docs)
  await page.locator("text=Checkout").click(); //Rahul prefers "text=checkout" - tag name and type

  await page.locator("[placeholder*='Country']").type("ind", { delay: 100 }); ///will let to write i,n,d in steps, with 100 m.s.
  const dropdown = page.locator(".ta-results");
  await dropdown.waitFor();
  let optionsCount = await dropdown.locator("button").count(); //child scope of page, so button is enough. in parent page scope, many buttons bitch!

  for (let i = 0; i < optionsCount; ++i) {
    let text = await dropdown.locator("button").nth(i).textContent();
    if (text === " India") {
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }

  await expect(page.locator(".user__name [type='text']").nth(0)).toHaveText(
    email
  );
  await page.locator(".input.txt.text-validated").nth(0).type("7777777777777");
  await page.locator(".input.txt").nth(1).type("777");
  await page.locator(".input.txt").nth(2).type("George Beradze");
  await page.locator(".input.txt").nth(3).type("Rahulshetty");
  await page.locator(".btn.btn-primary.mt-1").click();
  await page.locator(".action__submit").click();

  await expect(page.locator(".hero-primary")).toHaveText(
    " Thankyou for the order. "
  );

  const orderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  console.log(orderId);
  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  expect(orderId.includes(orderIdDetails)).toBeTruthy();
});
