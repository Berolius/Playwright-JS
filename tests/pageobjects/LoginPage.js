class LoginPage {
  constructor(page) {
    this.page = page; ///to use everywhere
    this.signInBTN = page.locator("[value='Login']");
    this.username = page.locator("#userEmail");
    this.password = page.locator("#userPassword");
  }

  async goto() {
    await this.page.goto("https://rahulshettyacademy.com/client");
  }
  async validLogin(username, password) {
    await this.username.type(username);
    await this.password.type(password);
    await this.signInBTN.click();
    await this.page.waitForLoadState("networkidle");
  }
}

module.exports = { LoginPage };
