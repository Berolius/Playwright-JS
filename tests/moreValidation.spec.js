const { test, expect } = require("@playwright/test");

test("popup validation", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  //   await page.goto("https://www.google.ru/");
  //   await page.goBack(); ///return to the first page
  //   await page.goForward(); ///forward

  /////DISPLAYED AND HIDDEN ELEMENT CHECK ////
  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();
  /// POP-UPS
  //   await page.pause();
  page.on("dialog", (dialog) => dialog.accept()); ///or dialog.dismiss. for popups
  await page.locator("#confirmbtn").click();
  await page.locator("#mousehover").hover();
  const framesPage = page.frameLocator("#courses-iframe"); //new frame switch
  await framesPage.locator("li a[href*='lifetime-access']:visible").click(); //will select only if visible, so if many to select, no pro
  const textCheck = await framesPage.locator(".text h2").textContent();
  console.log(textCheck.split(" ")[1]); // second(1) element will be number
});
