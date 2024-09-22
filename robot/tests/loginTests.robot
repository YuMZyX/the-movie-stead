*** Settings ***
Resource    ${RESOURCES BASE}/commonKeywords.resource
Resource    ${RESOURCES BASE}/loginKeywords.resource
Suite Setup    Setup suite
Test Setup    Setup tests
Test Teardown    Close Browser
Documentation    Login functionality test cases

*** Variables ***
${RESOURCES BASE}    ../resources

*** Test Cases ***
Login page can be opened
    [Documentation]    Verifies that user can navigate to login page
    [Tags]    Login
    Navigate to login page

Login succeeds
    [Documentation]    Verifies that login succeeds with correct credentials
    [Tags]    Login
    Navigate to login page
    Fill form and login    regular@gmail.com    regularpw
    Wait Until Page Contains    Trending movies
    Verify logged in
    Page Should Contain    Watchlist
    Page Should Contain    My Reviews

Login fails with incorrect credentials
    [Documentation]    Verifies that login fails with incorrect credentials
    [Tags]    Login
    Navigate to login page
    Fill form and login    regular@gmail.com    regularp
    Page Should Contain    Invalid username or password
    Verify unsuccessfull login
    Clear login form
    Fill form and login    reglar@gmail.com    regularpw
    Page Should Contain    Invalid username or password
    Verify unsuccessfull login

Login fails with a disabled account
    [Documentation]    Verifies that login fails when account is disabled
    [Tags]    Login
    Navigate to login page
    Fill form and login    disabled@gmail.com    disabledpw
    Verify unsuccessfull login
    Page Should Contain    Account disabled, contact admin/moderator

Logout succeeds
    [Documentation]    Verifies that logged in user can successfully logout
    [Tags]    Login
    Navigate to login page
    Fill form and login    regular@gmail.com    regularpw
    Verify logged in
    Logout user
    Verify not logged in

User can access watchlist and reviews
    [Documentation]    Verifies that logged in user can access watchlist and my reviews
    [Tags]    Login
    Navigate to login page
    Fill form and login    regular@gmail.com    regularpw
    Wait Until Page Contains    Trending movies
    Navigate to My Reviews
    Page Should Contain    You have not reviewed any movies yet
    Navigate to Watchlist
    Page Should Contain    Your watchlist is currently empty

Moderator can access users page
    [Documentation]    Verifies that logged in moderator can access users page
    [Tags]    Login
    Navigate to login page
    Fill form and login    moderator@gmail.com    moderatorpw
    Wait Until Page Contains    Trending movies
    Navigate to users
    Page Should Contain    User management

Admin can access users page
    [Documentation]    Verifies that logged in admin can access users page
    [Tags]    Login
    Navigate to login page
    Fill form and login    admin@gmail.com    adminpw
    Wait Until Page Contains    Trending movies
    Navigate to users
    Page Should Contain    User management