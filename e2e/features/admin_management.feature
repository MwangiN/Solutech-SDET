Feature: Admin Tour Management on SDET Solutech Labs

  Background:
    Given I am logged in as an admin user

  Scenario: Create a new tour with valid details
    When I navigate to the "Tours" section
    And I click on the "Create Tour" button
    Then a tour creation panel should slide in from the right
    And the panel should be "Create Tour"
    When I fill in the right panel form:
      | Field            | Value                            |
      | Tour Name        | Wildlife Safari Adventure        |
      | Description      | 5-day wildlife tour in Dakar     |
      | Destination      | Dakar Senegal                    |
      | Price Per Slot   | 7500                             |
      | Slots Available  | 15                               |
    And I click "Submit" in the panel
    Then I should see success message "Tour created successfully"
    And the right panel should close
    And The tour "Wildlife Safari Adventure" should appear in the tours list
    
  Scenario: View existing tours in management table
    When I view the tours management table
    Then I should see columns:
      | Tour Name    |
      | Description  |
      | Destination  |
      | Slots Available |
      | Price Per Slot |
      | Creation Date  |
      | Action        |
    And The table should contain at least 5 tours

  Scenario: Attempt to create tour with missing required fields
    When I fill in tour creation form:
      | Field            | Value                     |
      | Tour Name        |                           |
      | Description      | Test description          |
      | Destination      | Test destination          |
      | Price Per Slot   | 100                       |
      | Slots Available  | 10                        |
    And I click "Submit"
    Then I should see error "Tour name is required"

  Scenario: Filter tours by destination
    When I filter tours by destination "Bali"
    Then I should only see tours with destination containing "Bali"

  Scenario: View all bookings in management system
    When I navigate to the "Bookings" section
    Then I should see a bookings table with columns:
      | Booked By       |
      | Tour Name       |
      | Status          |
      | Ticket Number   |
      | Created At      |
    And The bookings table should contain at least 5 records
    And Each booking should have a valid ticket number in TCKT format

  Scenario: View all tickets in management system
    When I navigate to the "Tickets" section
    Then I should see a tickets table with columns:
      | Ticket Holder Name    |
      | Ticket Email Address  |
      | Ticket Number         |
      | Created At            |
    And The tickets table should contain at least 5 records
    And Each ticket should have a valid email address format

  Scenario: Filter bookings by tour name
    When I navigate to the "Bookings" section
    And I filter bookings by tour name "Ut voluptas omnis qui."
    Then I should only see bookings for tour "Ut voluptas omnis qui."
    And Each booking should show status "pending"

  Scenario: Verify booking and ticket data consistency
    Given I navigate to the "Bookings" section
    And I note the ticket number "TCKT1747562782" from bookings
    When I navigate to the "Tickets" section
    Then I should find ticket "TCKT1747562782" with:
      | Ticket Holder Name | John           |
      | Ticket Email Address | asdas@test.com |