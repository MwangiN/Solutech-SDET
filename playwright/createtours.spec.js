const { test, expect } = require('@playwright/test');
const { time } = require('console');

test('Add new tour', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://sdet.solutechlabs.com/login', {timeout: 120000});
  
  // Login with admin credentials
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@account.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  
  // Go to the Tours page
  await page.getByRole('link', { name: 'Tours' }).click({timeout: 120000});

//Click on create tour button
  await page.getByRole('button', { name: 'Create Tour' }).click();

  // Verify the tours form is present using its class
  const toursform = await page.locator('ivu-drawer ivu-drawer-right');

  // Fill in the tour details
  await page.getByRole('textbox', { name: 'Enter tour name' }).fill('Bali Siesta');
  await page.getByRole('textbox', { name: 'Enter Tour description' }).fill('Siesta in Bali');
  await page.locator('span').filter({ hasText: 'Choose Destination' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Bali' }).click();
  await page.getByPlaceholder('Enter the price per slot').fill('10000');
  await page.getByPlaceholder('Enter the number of slots').fill('25');

  // Submit the form
  await page.getByRole('button', { name: 'Submit' }).click();

  // Verify the success message
  await expect(page.locator('.ivu-message-notice-content')).toBeVisible();

});