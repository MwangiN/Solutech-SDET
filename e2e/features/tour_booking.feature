Feature: Tour Booking on SDET Solutech Labs

  Background:
    Given I am on the SDET Solutech Labs home page

  Scenario: View available tour details
    When I select the tour "Ut voluptas omnis qui"
    Then I should see tour details:
      | Destination | Bali               |
      | Tour Name   | Ut voluptas omnis qui |
      | Slots       | 2 available        |
      | Book Tour button | visible       |

  Scenario: Complete tour booking with valid details
    When I select the tour "Ut voluptas omnis qui"
    And I enter booking details:
      | Number of tickets | 2              |
      | Ticket holder     | John Doe       |
      | Email address     | john@test.com  |
    Then the total price should be calculated
    And When I click "Book Tour"
    Then I should see ticket confirmation with:
      | Ticket Number | TCKT format       |
      | Ticket Holder | John Doe          |
      | Email Address | john@test.com     |
      | Tour Name     | Ut voluptas omnis qui |
      | Slots Booked  | 2                 |
      | Total Price   | KES amount        |

  Scenario: Attempt booking with invalid email
    When I select the tour "Ut voluptas omnis qui"
    And I enter booking details:
      | Number of tickets | 1              |
      | Ticket holder     | Jane Smith     |
      | Email address     | invalid-email  |
    And I click "Book Tour"
    Then I should see error "Please enter a valid email address"

  Scenario: Cancel booking before confirmation
    When I select the tour "Ut voluptas omnis qui"
    And I enter booking details:
      | Number of tickets | 1              |
      | Ticket holder     | Test User      |
      | Email address     | test@test.com  |
    And I click "Cancel"
    Then I should return to the tour details page