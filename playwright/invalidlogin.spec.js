const { test, expect } = require('@playwright/test');

test('Login with invalid credentials shows error message', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://sdet.solutechlabs.com/', {timeout: 60000});
  await page.getByRole('link', { name: 'Log in' }).click();

  // Enter invalid credentials
  await page.getByRole('textbox', { name: 'Email' }).fill('mwangit1996@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('solutech');
  
  // Click login button
  await page.getByRole('button', { name: 'Log in' }).click();

  // Assert that error message is displayed
  const errorMessage = page.getByText('These credentials do not match our records.');
  await expect(errorMessage).toBeVisible();
});