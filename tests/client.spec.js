const { test, expect } = require("@playwright/test");

test("first assignment", async ({ page }) => {
  const productName = "zara coat 3";
  const username = page.locator("#userEmail");
  const password = page.locator("#userPassword");
  const signInBTN = page.locator("[value='Login']");
  const products = page.locator(".card-body");
  const email = "berolius@gmail.com";

  await page.goto("https://rahulshettyacademy.com/client");
  await username.type("berolius@gmail.com");
  await password.type("Berolius001");
  await signInBTN.click();

  // await Promise.all([await page.waitForNavigation(), await signInBTN.click()]); //in case of no server help
  await page.waitForLoadState("networkidle"); ///waits until network will be at idle state
  // const titles = await page.locator(".card-body b").allTextContents();
  // console.log(titles);
  // console.log(await products.nth(0).textContent());
  // await page.pause();

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
