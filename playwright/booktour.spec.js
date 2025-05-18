const { test, expect } = require('@playwright/test');

test('Complete tour booking process with validation', async ({ page }) => {
  //Test data
  const bookingData = {
    numberOfPeople: '6',
    ticketHolderName: 'Thomas',
    email: 'mwangitm1996@gmail.com',
    expectedTourName: 'Dignissimos ut ut',
    currency: 'KES'
  };

  //Navigate to website and initiate booking
  await page.goto('https://sdet.solutechlabs.com/', {timeout: 60000});
  await page.locator('div:nth-child(3) > .relative > div:nth-child(3) > .bg-\\[\\#FF2D20\\]').click();
  
  //Fill booking form
  await page.getByPlaceholder('Please enter the number of').fill(bookingData.numberOfPeople);
  await page.getByRole('textbox', { name: 'Please enter the ticket' }).fill(bookingData.ticketHolderName);
  await page.getByRole('textbox', { name: 'Please enter your email' }).fill(bookingData.email);
  
  //Submit booking
  await page.locator('button').filter({ hasText: /^Book Tour$/ }).click();
  
  //Verify booking confirmation details
  await expect(page.locator('div').filter({ hasText: 'Ticket Details' }).nth(3)).toBeVisible({ timeout: 60000 });
  await expect(page.getByText(`Ticket Holder: ${bookingData.ticketHolderName}`)).toBeVisible();
  await expect(page.getByText(`Email Address: ${bookingData.email}`)).toBeVisible();
  await expect(page.getByText(`Tour: ${bookingData.expectedTourName}`)).toBeVisible();
  await expect(page.getByText(`Slots: ${bookingData.numberOfPeople}`)).toBeVisible();
  await expect(page.getByText(`Total Price: ${bookingData.currency}`)).toBeVisible();
  
  //Verify ticket number format
  const ticketNumberText = await page.getByText(/^Ticket Number: /).textContent();
  expect(ticketNumberText).toMatch(/Ticket Number: TCKT\d+/);
  
  //Complete booking process
  await page.getByRole('button', { name: 'Done' }).click();
  
});