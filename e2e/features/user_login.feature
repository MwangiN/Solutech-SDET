Feature: User Authentication on SDET Solutech Labs

  Scenario Outline: Attempt login with invalid credentials
    Given I navigate to the SDET Solutech Labs login page
    When I enter "<email>" in the email field
    And I enter "<password>" in the password field
    And I click the login button
    Then I should see "<error_message>"

    Examples:
      | email               | password      | error_message                     |
      | invalid@test.com    | wrongpass     | Invalid email or password         |
      | test@example.com    |               | Password is required              |
      |                     | somepassword  | Email is required                 |
      | bad-format         | test123       | Please enter a valid email address |

  Scenario: Successful login with valid credentials
    Given I navigate to the SDET Solutech Labs login page
    When I enter "user@example.com" in the email field
    And I enter "validPassword123" in the password field
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see "Welcome back" greeting