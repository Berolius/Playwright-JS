class ApiUtils {
  //so when we create object for this class, this constructor will envoke auto, when creating new obj

  constructor(apiContext, loginPayload) {
    this.apiContext = apiContext; ///after this. apicontext will be not scope, but global in APiUtils class
    this.loginPayload = loginPayload;
  }

  async getToken() {
    const loginResponse = await this.apiContext.post(
      "https://www.rahulshettyacademy.com/api/ecom/auth/login",
      { data: this.loginPayload }
    );

    const loginResponseJSON = await loginResponse.json();
    const token = loginResponseJSON.token;
    console.log(token);
    return token;
  }

  async createOrder(orderPayLoad) {
    //so it will sit on payload object, see test file too
    let response = {};
    response.token = await this.getToken();

    /////////////////////////////////////////
    const orderResponse = await this.apiContext.post(
      "https://www.rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayLoad,
        headers: {
          Authorization: response.token,
          "Content-Type": "application/json",
        },
      }
    );
    ////////////////////////////////////
    const orderResponseJson = await orderResponse.json(); //will transfer to JSON
    console.log(orderResponseJson);
    const orderID = orderResponseJson.orders[0]; //from site jsoneditoronline.org
    response.orderID = orderID; //so it will be fitted to empty response object
    return response;
  }
}
module.exports = { ApiUtils }; //now it will be globally visible
