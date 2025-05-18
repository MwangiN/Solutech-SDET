const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('the user is on the home page', async function () {
  await this.page.goto('https://sdet.solutechlabs.com/', { timeout: 60000 });
});

When('the user navigates to the login page', async function () {
  await this.page.getByRole('link', { name: 'Log in' }).click();
});

When('the user enters invalid credentials', async function () {
  await this.page.getByRole('textbox', { name: 'Email' }).fill('mwangit1996@gmail.com');
  await this.page.getByRole('textbox', { name: 'Password' }).fill('solutech');
});

When('the user clicks the login button', async function () {
  await this.page.getByRole('button', { name: 'Log in' }).click();
});

Then('an error message {string} should be displayed', async function (errorText) {
  const errorMessage = this.page.getByText(errorText);
  await expect(errorMessage).toBeVisible();
});
