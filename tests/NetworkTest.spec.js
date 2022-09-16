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
const fakePayloadOrders = { data: [], message: "No Orders" }; //not real data for current situation (empty orders)

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
  await page.route(
    //will go to specific route of API. second argument - how to route.
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/62f365d5e26b7e1a10f5cfcd",

    async (route) => {
      const response = await page.request.fetch(route.request()); //real response call//page request - more API mode, than browser
      /// intercepting response -API response -> {fake playwright response, no need for other account with e.x. empty orders} -> browser ->render data on frontend (lifecycle)
      let body = fakePayloadOrders;
      route.fulfill({
        response,
        body,
      }); //will override fake response to browser. in networktest2, we change request, not response
    }
  );
  await page.locator("button[routerlink*='myorders']").click();
  await page.pause();
  console.log(await page.locator(".mt-4").textContent());
});
