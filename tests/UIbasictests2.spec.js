const { test, expect } = require("@playwright/test");

test("UI controls", async ({ page }) => {
  await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");
  const username = page.locator("#username");
  const signInbutton = page.locator("#signInBtn");
  const documentLink = page.locator("[href*='documents-request']");
  //   const password = page.locator("[type = 'password']");
  const dropdown = page.locator("select.form-control"); ///we can use only .form-control. but when many opt, we clarify

  await dropdown.selectOption("consult");
  await page.locator(".radiotextsty").last().click(); //or nth
  await page.locator("#okayBtn").click();
  console.log(await page.locator(".radiotextsty").last().isChecked()); //this boolean, to make sure
  await expect(page.locator(".radiotextsty").last()).toBeChecked(); //without above radiotextsty and okaybtn won't work

  await page.locator("#terms").click();
  await expect(page.locator("#terms")).toBeChecked(); ///to make sure that after click, it is checked
  await page.locator("#terms").uncheck();
  expect(await page.locator("#terms").isChecked()).toBeFalsy(); //only to make sure that unchecked. await is inside, because action is inside
  await expect(documentLink).toHaveAttribute("class", "blinkingText"); //that one have another, to blink green
  await page.pause(); ///browser won't close fast
});

("[style*='block']");

///when we know, that any click will bring us to a new window, first we tell to waitforevent,use promise, only then
/// --we use locator and other instruments for automation
test("Child page handling", async ({ browser }) => {
  const context = await browser.newContext(); //this for browser settings
  const page = await context.newPage();
  const username = page.locator("#username"); //to enter value from child to parent page
  await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");
  const documentLink = page.locator("[href*='documents-request']");

  const [newPage] = await Promise.all([
    ///better do in array, if other pages appear [newPage, newPage2]
    context.waitForEvent("page"),
    documentLink.click(), //opens separate window, new child page will be done by this
  ]);

  let text = await newPage.locator(".red").textContent(); ///not page.locator
  let splittedText = text.split("@");
  let domain = splittedText[1].split(" ")[0];
  console.log(domain);
  await username.type(domain);
  //   await page.locator("#username").type(domain);
  await page.pause();
  console.log(await username.textContent());
});
