*** Settings ***
Resource    ${RESOURCES BASE}/commonKeywords.resource
Resource    ${RESOURCES BASE}/signupKeywords.resource
Suite Setup    Setup suite
Test Setup    Setup tests
Test Teardown    Close Browser
Documentation    Sign up functionality test cases

*** Variables ***
${RESOURCES BASE}    ../resources

*** Test Cases ***
Signup page can be opened
    [Documentation]    Verifies that user can navigate to signup page
    [Tags]    Signup
    Navigate to signup page

Signup succeeds
    [Documentation]    Verifies that user can successfully sign up when using valid input
    [Tags]    Signup
    Navigate to signup page
    Fill form and signup    Test User    test@gmail.com    password    password
    Verify logged in
    Page Should Contain    Trending movies
    Page Should Contain    Watchlist
    Page Should Contain    My Reviews

Signup fails if any field is empty
    [Documentation]    Verifies that user cannot signup if leaving any field empty
    [Tags]    Signup
    Navigate to signup page
    Fill form and signup    ${EMPTY}    test@gmail.com    password    password
    Verify unsuccessfull login
    Page Should Contain    Name is required
    Clear signup form

    Fill form and signup    Test User    ${EMPTY}    password    password
    Verify unsuccessfull login
    Page Should Contain    Email address is required
    Clear signup form

    Fill form and signup    Test User    test@gmail.com    ${EMPTY}    password
    Verify unsuccessfull login
    Page Should Contain    Password is required
    Clear signup form

    Fill form and signup    Test User    test@gmail.com    password    ${EMPTY}
    Verify unsuccessfull login
    Page Should Contain    Password confirmation is required

Signup fails if passwords do not match
    [Documentation]    Verifies that user cannot signup if passwords do not match
    [Tags]    Signup
    Navigate to signup page
    Fill form and signup    Test User    test@gmail.com    password    passwrd
    Verify unsuccessfull login
    Page Should Contain    Your passwords do not match

Signup fails if email is not valid
    [Documentation]    Verifies that user cannot signup with invalid email address
    [Tags]    Signup
    Navigate to signup page
    Fill form and signup    Test User    test.user@    password    password
    Verify unsuccessfull login
    Page Should Contain    Enter a valid email

Signup fails if name is too short
    [Documentation]    Verifies that user cannot signup with a name that is under 4 characters
    [Tags]    Signup
    Navigate to signup page
    Fill form and signup    Joe    test@gmail.com    password    password
    Verify unsuccessfull login
    Page Should Contain    Name has to be atleast 4 characters long

Signup fails if password is too short
    [Documentation]    Verifies that user cannot signup with a password that is under 6 characters
    [Tags]    Signup
    Navigate to signup page
    Fill form and signup    Test User    test@gmail.com    passw    passw
    Verify unsuccessfull login
    Page Should Contain    Password has to be atleast 6 characters long

Signup fails if email is already registered
    [Documentation]    Verifies that there isn't user with same email address in database
    [Tags]    Signup
    Add user to test database    Initial User    test@gmail.com    password    user    ${False}
    Navigate to signup page
    Fill form and signup    Test User    test@gmail.com    password    password
    Verify unsuccessfull login
    Page Should Contain    Email address already exists, try logging in.
