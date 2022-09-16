const { test, expect } = require("@playwright/test");

test("first playwright test", async ({ page }) => {
  ///context and page stuff no need, 'page' does everything
  //without async, await will not work
  //first argument of test is title, second is actual code
  // const context = await browser.newContext(); //this for browser settings
  // const page = await context.newPage(); ///creates actual page to automate

  ///NETWORK BLOCK//////
  // page.route("**/*.{jpg,png,jpeg}", (route) => route.abort()); ///aborts network calls. anything bef/aft slash. so run without css. we can also block images(jpg, png)
  const username = page.locator("#username"); ///await not required when no action
  const signInbutton = page.locator("#signInBtn");
  const password = page.locator("[type = 'password']");
  const cardTitles = page.locator(".card-body a");
  //To see if server down. if 200 it is ok, if 400, wrong
  page.on("request", (request) => console.log(request.url()));
  page.on("request", (request) =>
    console.log(request.url(), response.status())
  );

  await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/"); ///always with http!!!
  console.log(await page.title());
  // await expect(page).toHaveTitle("__");
  // css selector, to identify the element.
  await username.type("rahulshettyacademy");
  await password.type("learning");
  await signInbutton.click();
  //in selenium, you can not wait, until block element appears, if you won't write webdriver wait. in PW - intelligence
  console.log(await page.locator("[style*='block']").textContent()); //*  is is any of element exist.
  await expect(page.locator("[style*='block']")).toContainText("Incorrect");
  await username.fill(""); //same as type, but empty string possible
  await username.fill("rahulshettyacademy");
  await Promise.all([page.waitForNavigation(), signInbutton.click()]);
  await signInbutton.click();
  console.log(await cardTitles.nth(0).textContent()); ///nth stands for element choise: also .first()
  // const allTitles = await cardTitles.allTextContents(); ///all elements. but it won't work. if before, one of these call(above) reason - wait
  // console.log(allTitles);
});
