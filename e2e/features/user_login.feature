Feature: User Login

  Scenario: Invalid login attempt
    Given the user is on the home page
    When the user navigates to the login page
    And the user enters invalid credentials
    And the user clicks the login button
    Then an error message "Invalid login attempt." should be displayed
