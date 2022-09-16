class DashBoardPage {
  constructor(page) {
    this.products = page.locator(".card-body");
    this.productTextContent = page.locator(".card-body b");
    this.cart = page.locator("[routerlink*='cart']"); // do not put actions here!
  }

  async searchProductAddtoCart(productName) {
    const titles = await this.productTextContent.allTextContents();
    console.log(titles);

    const count = await this.products.count();
    for (let i = 0; i < count; ++i) {
      if (
        (await this.products.nth(i).locator("b").textContent()) === productName
      ) {
        await this.products.nth(i).locator("text= Add To Cart").click();
        break;
      }
    }
  }
  async navigateToCart() {
    await this.cart.click();
  }
}

module.exports = { DashBoardPage };
