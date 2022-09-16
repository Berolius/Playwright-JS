const { test, expect, request } = require("@playwright/test"); //request stands for API testing
const { ApiUtils } = require("../UTILS/APIutils"); //we import class

//API of LOGIN
const loginPayload = {
  userEmail: "berolius@gmail.com",
  userPassword: "Berolius001",
};

/// API of Order
const orderPayLoad = {
  orders: [
    { country: "Georgia", productOrderedId: "6262e95ae26b7e1a10e89bf0" },
  ],
};
let response; //defined later
test.beforeAll(async () => {
  //executed once before all tests in code

  ///Login API execution

  const apiContext = await request.newContext(); //similar to webpage, but API call instead
  const APIutils = new ApiUtils(apiContext, loginPayload); //invoked class constructor APiUtils,both 2 parameters
  response = await APIutils.createOrder(orderPayLoad); //// Place order API, after apiContext and login

  // test.beforeEach(() => {}); //will be executed again and again before every test in code
});
test("@API Place the order", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value); //we get login from token, by its value,
  }, response.token); //then second value of setItem will be taken from second argument of addInitScript

  //go to page, click to myorders, wait for it,
  await page.goto("https://www.rahulshettyacademy.com/client");
  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = page.locator("tbody tr");

  //iterate all items, until it will have order value
  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (response.orderID.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }

  const orderIdDetails = await page.locator(".col-text").textContent();
  await page.pause();
  expect(response.orderID.includes(orderIdDetails)).toBeTruthy();

  ///VERIFY IF CREATED ORDER IS DISPLAYED IN HISTORY PAGE////
  ///PRECONDITION: CREATE ORDER////after discussing with developer, if there is an API call, can be skipped many steps
});
