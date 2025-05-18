const { test, expect } = require('@playwright/test');
const { time } = require('console');

test('View All Bookings', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://sdet.solutechlabs.com/login', {timeout: 120000});
  
  // Login with admin credentials
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@account.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  
  // Go to the Bookings page
  await page.getByRole('link', { name: 'Bookings' }).click({timeout: 60000});
  
// Verify the bookings table is present using its class
  const bookingsTable = await page.locator('.ivu-table.ivu-table-default');
  await expect(bookingsTable).toBeVisible();
  expect(await bookingsTable.count()).toBeGreaterThan(0);

});