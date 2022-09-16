class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.list = page.locator("div li").first();
    this.bool = page.locator("h3:has-text('zara coat 3')");
    this.checkout = page.locator("text=Checkout");
    this.country = page.locator("[placeholder*='Country']");
    this.dropdown = page.locator(".ta-results");
  }
  async selectCheckProduct() {
    // await this.cartProducts.waitFor();
    // const bool =await this.getProductLocator(productName).isVisible();
    // expect(bool).toBeTruthy();

    await this.page.locator("[routerlink*='cart']").click();
    await this.page.locator("div li").first().waitFor(); //after all list items load, only then test.because isVisible has no autowait
    // const bool = this.page.locator("h3:has-text('zara coat 3')").isVisible(); //to avoid conflict with the same zara coat 3, we define it by a tag
    // expect(bool).toBeTruthy(); //but it is not waiting (see in dev  docs)
    await this.page.locator("text=Checkout").click();
  }

  async CountrySelect() {
    await this.page
      .locator("[placeholder*='Country']")
      .type("ind", { delay: 100 });
    await this.dropdown.waitFor();

    let optionsCount = await this.dropdown.locator("button").count(); //child scope of page, so button is enough. in parent page scope, many buttons bitch!
    for (let i = 0; i < optionsCount; ++i) {
      let text = await this.dropdown.locator("button").nth(i).textContent();
      if (text === " India") {
        await this.dropdown.locator("button").nth(i).click();
        break;
      }
    }
  }
  async TypeRestData() {
    // await expect(
    //   this.page.locator(".user__name [type='text']").nth(0)
    // ).toHaveText(this.username);
    await this.page
      .locator(".input.txt.text-validated")
      .nth(0)
      .type("7777777777777");
    await this.page.locator(".input.txt").nth(1).type("777");
    await this.page.locator(".input.txt").nth(2).type("George Beradze");
    await this.page.locator(".input.txt").nth(3).type("Rahulshetty");
    await this.page.locator(".btn.btn-primary.mt-1").click();
    await this.page.locator(".action__submit").click();
  }
}
module.exports = { CheckoutPage };
