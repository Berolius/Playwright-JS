const { test, expect } = require("@playwright/test");
const { LoginPage } = require("./pageobjects/LoginPage"); //two .. if another folder
const { DashBoardPage } = require("./pageobjects/DashboardPage");
const { CheckoutPage } = require("./pageobjects/CheckoutPage");
//better: JSON -> string -> js object
const dataset = JSON.parse(
  JSON.stringify(require("../UTILS/placeorderTestData.json"))
); ////will convert JSON to string then to JS

for (const data of dataset) {
  //instead of 2 iterables of JSON array, we loop it
  test.only(`Client app login for ${data.productName}`, async ({ page }) => {
    //to be clear which
    //js file LoginPage.js
    // const username = "berolius@gmail.com";
    // const password = page.locator("#userPassword");
    // const productName = "zara coat 3";
    const products = page.locator(".card-body");
    const loginPage = new LoginPage(page); //will connect with constructor page. do not have same name with class!!!
    await loginPage.goto();
    await loginPage.validLogin(data.username, data.password);

    //Js file DashboardPage.js
    const dashBoardPage = new DashBoardPage(page);
    await dashBoardPage.searchProductAddtoCart(data.productName);
    await dashBoardPage.navigateToCart();

    const Checkoutpage = new CheckoutPage(page);
    await Checkoutpage.selectCheckProduct(data.productName);
    await Checkoutpage.CountrySelect();
    await Checkoutpage.TypeRestData();
    //Js file Checkoutpage
    // await page.locator("div li").first().waitFor(); //after all list items load, only then test.because isVisible has no autowait
    // const bool = await page.locator("h3:has-text('zara coat 3')").isVisible(); //to avoid conflict with the same zara coat 3, we define it by a tag
    // expect(bool).toBeTruthy(); //but it is not waiting (see in dev  docs)
    // await page.locator("text=Checkout").click(); //Rahul prefers "text=checkout" - tag name and type

    // await page.locator("[placeholder*='Country']").type("ind", { delay: 100 }); ///will let to write i,n,d in steps, with 100 m.s.
    // const dropdown = page.locator(".ta-results");
    // await dropdown.waitFor();

    // let optionsCount = await dropdown.locator("button").count(); //child scope of page, so button is enough. in parent page scope, many buttons bitch!
    // for (let i = 0; i < optionsCount; ++i) {
    //   let text = await dropdown.locator("button").nth(i).textContent();
    //   if (text === " India") {
    //     await dropdown.locator("button").nth(i).click();
    //     break;
    //   }
    // }

    // await expect(page.locator(".user__name [type='text']").nth(0)).toHaveText(
    //   username
    // );
    // await page.locator(".input.txt.text-validated").nth(0).type("7777777777777");
    // await page.locator(".input.txt").nth(1).type("777");
    // await page.locator(".input.txt").nth(2).type("George Beradze");
    // await page.locator(".input.txt").nth(3).type("Rahulshetty");
    // await page.locator(".btn.btn-primary.mt-1").click();
    // await page.locator(".action__submit").click();

    ////////
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
}
