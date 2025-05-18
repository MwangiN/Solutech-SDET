const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const selectors = require('../support/selectors');

Given('I am on the SDET Solutech Labs home page', async function() {
  await this.page.goto('https://sdet.solutechlabs.com');
  await this.page.waitForSelector(selectors.bookingPage.tourCards);
});

When('I select the tour {string}', async function(tourName) {
  await this.page.click(`.tour-card:has-text("${tourName}") button`);
  await this.page.waitForSelector(selectors.bookingPage.ticketsInput);
});

Then('I should see tour details:', async function(dataTable) {
  const expectedDetails = dataTable.rowsHash();
  
  const destination = await this.page.textContent(selectors.bookingPage.destinationField);
  const name = await this.page.textContent(selectors.bookingPage.tourNameField);
  const slots = await this.page.textContent(selectors.bookingPage.slotsAvailable);
  const bookButton = await this.page.$(selectors.bookingPage.bookButton);
  
  expect(destination).to.include(expectedDetails['Destination']);
  expect(name).to.include(expectedDetails['Tour Name']);
  expect(slots).to.include(expectedDetails['Slots']);
  expect(bookButton).to.exist;
});

When('I enter booking details:', async function(dataTable) {
  const details = dataTable.rowsHash();
  
  await this.page.fill(selectors.bookingPage.ticketsInput, details['Number of tickets']);
  await this.page.fill(selectors.bookingPage.ticketHolderInput, details['Ticket holder']);
  await this.page.fill(selectors.bookingPage.emailInput, details['Email address']);
});

Then('the total price should be calculated', async function() {
  await this.page.waitForSelector(selectors.bookingPage.totalPrice);
  const totalText = await this.page.textContent(selectors.bookingPage.totalPrice);
  expect(totalText).to.match(/KES \d+/);
});

When('I click {string}', async function(buttonText) {
  await this.page.click(`button:has-text("${buttonText}")`);
});

Then('I should see ticket confirmation with:', async function(dataTable) {
  const expectedDetails = dataTable.rowsHash();
  
  await this.page.waitForSelector(selectors.bookingPage.ticketNumber);
  
  const ticketNumber = await this.page.textContent(selectors.bookingPage.ticketNumber);
  const ticketHolder = await this.page.textContent(selectors.bookingPage.ticketHolder);
  const ticketEmail = await this.page.textContent(selectors.bookingPage.ticketEmail);
  const ticketTour = await this.page.textContent(selectors.bookingPage.ticketTour);
  const ticketSlots = await this.page.textContent(selectors.bookingPage.ticketSlots);
  const ticketTotal = await this.page.textContent(selectors.bookingPage.ticketTotal);
  
  if (expectedDetails['Ticket Number'] === 'TCKT format') {
    expect(ticketNumber).to.match(/TCKT\d+/);
  }
  
  expect(ticketHolder).to.include(expectedDetails['Ticket Holder']);
  expect(ticketEmail).to.include(expectedDetails['Email Address']);
  expect(ticketTour).to.include(expectedDetails['Tour Name']);
  expect(ticketSlots).to.include(expectedDetails['Slots Booked']);
  
  if (expectedDetails['Total Price'] === 'KES amount') {
    expect(ticketTotal).to.match(/KES \d+/);
  }
});

Then('I should see error {string}', async function(errorMessage) {
  const error = await this.page.waitForSelector(selectors.bookingPage.emailError);
  const errorText = await error.innerText();
  expect(errorText).to.include(errorMessage);
});

Then('I should return to the tour details page', async function() {
  await this.page.waitForSelector(selectors.bookingPage.ticketsInput);
  expect(this.page.url()).to.match(/\/tour-details/);
});