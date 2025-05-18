const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { chromium } = require('playwright');
const selectors = require('../support/selectors');

Given('I navigate to the SDET Solutech Labs login page', async function() {
  this.browser = await chromium.launch({ headless: false });
  this.page = await this.browser.newPage();
  await this.page.goto('https://sdet.solutechlabs.com/login');
});

When('I enter {string} in the email field', async function(email) {
  await this.page.fill(selectors.loginPage.emailInput, email);
});

When('I enter {string} in the password field', async function(password) {
  await this.page.fill(selectors.loginPage.passwordInput, password);
});

When('I click the login button', async function() {
  await this.page.click(selectors.loginPage.loginButton);
});

Then('I should see {string}', async function(errorMessage) {
  const errorElement = await this.page.waitForSelector(selectors.loginPage.errorMessage);
  const actualMessage = await errorElement.innerText();
  expect(actualMessage).to.include(errorMessage);
});

Then('I should be redirected to the dashboard', async function() {
  await this.page.waitForNavigation();
  expect(this.page.url()).to.match(/\/dashboard$/);
});

Then('I should see {string} greeting', async function(greeting) {
  const welcomeElement = await this.page.waitForSelector(selectors.loginPage.welcomeMessage);
  const actualGreeting = await welcomeElement.innerText();
  expect(actualGreeting).to.include(greeting);
  await this.browser.close();
});