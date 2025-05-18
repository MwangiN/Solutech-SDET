const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const selectors = require('../support/selectors');

Given('I navigate to the {string} section', async function(sectionName) {
  await this.page.click(`a:has-text("${sectionName}")`);
  await this.page.waitForSelector(selectors.adminPage.tourNameInput);
});

When('I click on the {string} button', async function(buttonText) {
  await this.page.click(`button:has-text("${buttonText}")`);
  await this.page.waitForTimeout(300); // Allow for animation
});

Then('a tour creation panel should slide in from the right', async function() {
  const panel = await this.page.waitForSelector(selectors.adminPanel.rightPanel, { 
    state: 'visible',
    timeout: 5000
  });
  
  // Verify panel position
  const panelBox = await panel.boundingBox();
  const viewport = this.page.viewportSize();
  expect(panelBox.x).to.be.greaterThan(viewport.width / 2);
  
  // Verify animation by checking transform property
  const transform = await panel.evaluate(el => getComputedStyle(el).transform);
  expect(transform).to.not.equal('none');
});

Then('the panel title should be {string}', async function(title) {
  const panelTitle = await this.page.textContent(selectors.adminPanel.panelTitle);
  expect(panelTitle.trim()).to.equal(title);
});

When('I fill in the right panel form:', async function(dataTable) {
  const formData = dataTable.rowsHash();
  
  // Verify panel context
  const panel = await this.page.$(selectors.adminPanel.rightPanel);
  expect(panel).to.not.be.null;

  if (formData['Tour Name']) {
    await this.page.fill(selectors.adminPanel.tourNameInput, formData['Tour Name']);
  }
  
  if (formData['Description']) {
    await this.page.fill(selectors.adminPanel.descriptionInput, formData['Description']);
  }
  
  if (formData['Destination']) {
    await this.page.fill(selectors.adminPanel.destinationInput, formData['Destination']);
  }
  
  if (formData['Price Per Slot']) {
    await this.page.fill(selectors.adminPanel.priceInput, formData['Price Per Slot']);
  }
  
  if (formData['Slots Available']) {
    await this.page.fill(selectors.adminPanel.slotsInput, formData['Slots Available']);
  }
});

When('I click {string} in the panel', async function(buttonText) {
  const panel = await this.page.$(selectors.adminPanel.rightPanel);
  const button = await panel.$(`button:has-text("${buttonText}")`);
  await button.click();
});

Then('the right panel should close', async function() {
  await this.page.waitForSelector(selectors.adminPanel.rightPanel, { 
    state: 'hidden',
    timeout: 5000
  });
  const isVisible = await this.page.isVisible(selectors.adminPanel.rightPanel);
  expect(isVisible).to.be.false;
});

Then('I should see success message {string}', async function(message) {
  const successAlert = await this.page.waitForSelector(selectors.adminPanel.successMessage);
  const alertText = await successAlert.innerText();
  expect(alertText).to.include(message);
});

Then('The tour {string} should appear in the tours list', async function(tourName) {
  await this.page.waitForSelector(selectors.adminPage.toursTable);
  const tourNames = await this.page.$$eval(selectors.adminPage.tourNameColumn, cells => 
    cells.map(cell => cell.textContent.trim())
  );
  expect(tourNames).to.include(tourName);
});

Then('With the following details:', async function(dataTable) {
  const expectedDetails = dataTable.rowsHash();
  const lastRow = await this.page.$(`${selectors.adminPage.tableRows}:last-child`);
  
  const description = await lastRow.$eval(selectors.adminPage.descriptionColumn, el => el.textContent.trim());
  const destination = await lastRow.$eval(selectors.adminPage.destinationColumn, el => el.textContent.trim());
  const slots = await lastRow.$eval(selectors.adminPage.slotsColumn, el => el.textContent.trim());
  const price = await lastRow.$eval(selectors.adminPage.priceColumn, el => el.textContent.trim());
  
  if (expectedDetails['Description']) {
    expect(description).to.include(expectedDetails['Description']);
  }
  
  if (expectedDetails['Destination']) {
    expect(destination).to.include(expectedDetails['Destination']);
  }
  
  if (expectedDetails['Slots Available']) {
    expect(slots).to.include(expectedDetails['Slots Available']);
  }
  
  if (expectedDetails['Price Per Slot']) {
    expect(price).to.include(expectedDetails['Price Per Slot']);
  }
});



When('I view the tours management table', async function() {
  await this.page.waitForSelector(selectors.adminPage.toursTable);
});

Then('I should see columns:', async function(dataTable) {
  const expectedColumns = dataTable.raw().flat();
  const headerRow = await this.page.$(`${selectors.adminPage.tableRows}:first-child`);
  const headerCells = await headerRow.$$('th');
  const columnHeaders = await Promise.all(headerCells.map(cell => cell.textContent()));
  
  for (const expectedColumn of expectedColumns) {
    expect(columnHeaders).to.include(expectedColumn);
  }
});

Then('The table should contain at least {int} tours', async function(minCount) {
  const rows = await this.page.$$(selectors.adminPage.tableRows);
  // Subtract 1 for header row
  expect(rows.length - 1).to.be.at.least(minCount);
});

Then('I should see admin error {string}', async function(errorMessage) {
  const error = await this.page.waitForSelector(selectors.adminPage.errorMessage);
  const errorText = await error.innerText();
  expect(errorText).to.include(errorMessage);
});

When('I filter tours by destination {string}', async function(destination) {
  await this.page.fill(selectors.adminPage.destinationFilter, destination);
  await this.page.click(selectors.adminPage.applyFilterButton);
  await this.page.waitForLoadState('networkidle');
});

Then('I should only see tours with destination containing {string}', async function(destination) {
  const rows = await this.page.$$(`${selectors.adminPage.tableRows}:not(:first-child)`);
  
  for (const row of rows) {
    const rowDestination = await row.$eval(selectors.adminPage.destinationColumn, el => el.textContent.trim());
    expect(rowDestination).to.include(destination);
  }
});

When('I navigate to the {string} section', async function(sectionName) {
  await this.page.click(`a:has-text("${sectionName}")`);
  await this.page.waitForLoadState('networkidle');
});

Then('I should see a bookings table with columns:', async function(dataTable) {
  const expectedColumns = dataTable.raw().flat();
  const headerRow = await this.page.$(`${selectors.adminPage.bookingsTable} tr:first-child`);
  const headerCells = await headerRow.$$('th');
  const columnHeaders = await Promise.all(headerCells.map(cell => cell.textContent()));
  
  for (const expectedColumn of expectedColumns) {
    expect(columnHeaders).to.include(expectedColumn);
  }
});

Then('The bookings table should contain at least {int} records', async function(minCount) {
  const rows = await this.page.$$(`${selectors.adminPage.bookingsTable} ${selectors.adminPage.tableRows}`);
  expect(rows.length).to.be.at.least(minCount);
});

Then('Each booking should have a valid ticket number in TCKT format', async function() {
  const rows = await this.page.$$(`${selectors.adminPage.bookingsTable} ${selectors.adminPage.tableRows}`);
  
  for (const row of rows) {
    const ticketNumber = await row.$eval(selectors.adminPage.bookingTicketNumberColumn, el => el.textContent.trim());
    expect(ticketNumber).to.match(/^TCKT\d+$/);
  }
});

Then('I should see a tickets table with columns:', async function(dataTable) {
  const expectedColumns = dataTable.raw().flat();
  const headerRow = await this.page.$(`${selectors.adminPage.ticketsTable} tr:first-child`);
  const headerCells = await headerRow.$$('th');
  const columnHeaders = await Promise.all(headerCells.map(cell => cell.textContent()));
  
  for (const expectedColumn of expectedColumns) {
    expect(columnHeaders).to.include(expectedColumn);
  }
});

Then('The tickets table should contain at least {int} records', async function(minCount) {
  const rows = await this.page.$$(`${selectors.adminPage.ticketsTable} ${selectors.adminPage.tableRows}`);
  expect(rows.length).to.be.at.least(minCount);
});

Then('Each ticket should have a valid email address format', async function() {
  const rows = await this.page.$$(`${selectors.adminPage.ticketsTable} ${selectors.adminPage.tableRows}`);
  
  for (const row of rows) {
    const email = await row.$eval(selectors.adminPage.ticketEmailColumn, el => el.textContent.trim());
    expect(email).to.match(/^\S+@\S+\.\S+$/);
  }
});

When('I filter bookings by tour name {string}', async function(tourName) {
  await this.page.fill(selectors.adminPage.tourNameFilter, tourName);
  await this.page.click(selectors.adminPage.applyFilterButton);
  await this.page.waitForLoadState('networkidle');
});

Then('I should only see bookings for tour {string}', async function(tourName) {
  const rows = await this.page.$$(`${selectors.adminPage.bookingsTable} ${selectors.adminPage.tableRows}`);
  
  for (const row of rows) {
    const actualTourName = await row.$eval(selectors.adminPage.tourNameColumn, el => el.textContent.trim());
    expect(actualTourName).to.equal(tourName);
  }
});

Then('Each booking should show status {string}', async function(status) {
  const rows = await this.page.$$(`${selectors.adminPage.bookingsTable} ${selectors.adminPage.tableRows}`);
  
  for (const row of rows) {
    const actualStatus = await row.$eval(selectors.adminPage.statusColumn, el => el.textContent.trim());
    expect(actualStatus).to.equal(status);
  }
});

Given('I note the ticket number {string} from bookings', async function(ticketNumber) {
  this.notedTicketNumber = ticketNumber;
});

Then('I should find ticket {string} with:', async function(ticketNumber, dataTable) {
  const expectedDetails = dataTable.rowsHash();
  const rows = await this.page.$$(`${selectors.adminPage.ticketsTable} ${selectors.adminPage.tableRows}`);
  
  let ticketFound = false;
  
  for (const row of rows) {
    const currentTicketNumber = await row.$eval(selectors.adminPage.ticketNumberColumn, el => el.textContent.trim());
    
    if (currentTicketNumber === ticketNumber) {
      ticketFound = true;
      
      if (expectedDetails['Ticket Holder Name']) {
        const holderName = await row.$eval(selectors.adminPage.ticketHolderColumn, el => el.textContent.trim());
        expect(holderName).to.equal(expectedDetails['Ticket Holder Name']);
      }
      
      if (expectedDetails['Ticket Email Address']) {
        const email = await row.$eval(selectors.adminPage.ticketEmailColumn, el => el.textContent.trim());
        expect(email).to.equal(expectedDetails['Ticket Email Address']);
      }
      
      break;
    }
  }
  
  expect(ticketFound).to.be.true;
});