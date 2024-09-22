*** Settings ***
Resource    ${RESOURCES BASE}/commonKeywords.resource
Resource    ${RESOURCES BASE}/usersKeywords.resource
Resource    ${RESOURCES BASE}/watchlistKeywords.resource
Resource    ${RESOURCES BASE}/reviewsKeywords.resource
Suite Setup    Setup suite
Test Setup    usersKeywords.Setup tests
Test Teardown    Close Browser
Documentation    Users functionality test cases

*** Variables ***
${RESOURCES BASE}    ../resources
${EMAIL}    test@gmail.com
${MOD EMAIL}    moderator@gmail.com
${ADMIN EMAIL}    admin@gmail.com
${PASSWORD}    password
${MOD PASSWORD}    moderatorpw
${ADMIN PASSWORD}    adminpw
${USERNAME}    Test User
${MOD USERNAME}    Mod User
${MY ACCOUNT WATCHLIST}    //p[contains(text(), "In Watchlist")]/../..//a

*** Test Cases ***
User can access My account page
    [Documentation]    Verifies that user can access his/her My account page
    [Tags]    Users
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Navigate to My account
    Verify My account details    ${USERNAME}    ${EMAIL}    user

User can access watchlist from My account page
    [Documentation]    Verifies that user can access his/her watchlist from My account page
    [Tags]    Users
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Add first movie on page to watchlist
    Navigate to My account
    Click Element    ${MY ACCOUNT WATCHLIST}
    Wait Until Page Contains    Your watchlist
    Verify one movie exists in watchlist

User can access My Reviews from My account page
    [Documentation]    Verifies that user can access his/her My Reviews page from My account page
    [Tags]    Users
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Create a review for first movie on page
    Navigate to My account
    Access reviews from My account page
    Verify one review exists in My Reviews

Moderator can access My account page
    [Documentation]    Verifies that moderator can access his/her My account page
    [Tags]    Users
    Add user to test database    ${MOD USERNAME}     ${MOD EMAIL}    ${MOD PASSWORD}    moderator    ${False}
    Navigate to login page
    Fill form and login    ${MOD EMAIL}    ${MOD PASSWORD}
    Verify logged in
    Navigate to My account
    Verify My account details    ${MOD USERNAME}    ${MOD EMAIL}    moderator

Moderator can access My account page of a regular user
    [Documentation]    Verifies that moderator can access My account page of a regular user
    [Tags]    Users
    Add user to test database    ${MOD USERNAME}     ${MOD EMAIL}    ${MOD PASSWORD}    moderator    ${False}
    Navigate to login page
    Fill form and login    ${MOD EMAIL}    ${MOD PASSWORD}
    Verify logged in
    Navigate to users
    ${id}=    Get Element Attribute    //a[text()="${USERNAME}"]/../..    data-id
    Access users My account    ${USERNAME}
    Verify My account details    ${USERNAME}    ${EMAIL}    user
    Access reviews from My account page
    Page Should Contain    You have not reviewed any movies yet
    ${url}=    Get Location
    Should Contain    ${url}    myreviews/${id}

Moderator can disable user
    [Documentation]    Verifies that moderator can disable regular user from user management
    [Tags]    Users
    Add user to test database    ${MOD USERNAME}     ${MOD EMAIL}    ${MOD PASSWORD}    moderator    ${False}
    Navigate to login page
    Fill form and login    ${MOD EMAIL}    ${MOD PASSWORD}
    Verify logged in
    Navigate to users
    Disable user    ${EMAIL}
    Logout user

    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify unsuccessfull login
    Page Should Contain    Account disabled, contact admin/moderator

Moderator can't delete user
    [Documentation]    Verifies that moderator can't delete regular user from user management
    [Tags]    Users
    Add user to test database    ${MOD USERNAME}     ${MOD EMAIL}    ${MOD PASSWORD}    moderator    ${False}
    Navigate to login page
    Fill form and login    ${MOD EMAIL}    ${MOD PASSWORD}
    Verify logged in
    Navigate to users
    Delete user as moderator    ${EMAIL}
    Verify user deletion failed    ${EMAIL}

Admin can access My account page
    [Documentation]    Verifies that admin can access his/her My account page
    [Tags]    Users
    Add user to test database    Admin User     ${ADMIN EMAIL}    ${ADMIN PASSWORD}    admin    ${False}
    Navigate to login page
    Fill form and login    ${ADMIN EMAIL}    ${ADMIN PASSWORD}
    Verify logged in
    Navigate to My account
    Verify My account details    Admin User    ${ADMIN EMAIL}    admin

Admin can access My account page of a moderator
    [Documentation]    Verifies that admin can access My account page of a moderator
    [Tags]    Users
    Seed users to test database
    Navigate to login page
    Fill form and login    ${ADMIN EMAIL}    ${ADMIN PASSWORD}
    Verify logged in
    Navigate to users
    ${id}=    Get Element Attribute    //a[text()="${MOD USERNAME}"]/../..    data-id
    Access users My account    ${MOD USERNAME}
    Verify My account details    ${MOD USERNAME}    ${MOD EMAIL}    moderator
    Access reviews from My account page
    Page Should Contain    You have not reviewed any movies yet
    ${url}=    Get Location
    Should Contain    ${url}    myreviews/${id}

Admin can disable moderator
    [Documentation]    Verifies that admin can disable moderator from user management
    [Tags]    Users
    Seed users to test database
    Navigate to login page
    Fill form and login    ${ADMIN EMAIL}    ${ADMIN PASSWORD}
    Verify logged in
    Navigate to users
    Disable user    ${MOD EMAIL}
    Logout user

    Fill form and login    ${MOD EMAIL}    ${MOD PASSWORD}
    Verify unsuccessfull login
    Page Should Contain    Account disabled, contact admin/moderator

Admin can delete user
    [Documentation]    Verifies that admin can delete user account completely
    [Tags]    Users
    Add user to test database    Admin User     ${ADMIN EMAIL}    ${ADMIN PASSWORD}    admin    ${False}
    Navigate to login page
    Fill form and login    ${ADMIN EMAIL}    ${ADMIN PASSWORD}
    Verify logged in
    Navigate to users
    Delete user as admin    ${EMAIL}
    Verify user deletion successful    ${EMAIL}
    Logout user

    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify unsuccessfull login
    Page Should Contain    Invalid username or password

Admin can promote user to moderator
    [Documentation]    Verifies that admin can promote user to moderator
    [Tags]    Users
    Add user to test database    Admin User     ${ADMIN EMAIL}    ${ADMIN PASSWORD}    admin    ${False}
    Navigate to login page
    Fill form and login    ${ADMIN EMAIL}    ${ADMIN PASSWORD}
    Verify logged in
    Navigate to users
    Promote user    ${EMAIL}
    Verify user promotion    ${EMAIL}
    Logout user

    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Navigate to My account
    Verify My account details    ${USERNAME}    ${EMAIL}    moderator

Admin can demote moderator to user
    [Documentation]    Verifies that admin can demote moderator to user
    [Tags]    Users
    Seed users to test database
    Navigate to login page
    Fill form and login    ${ADMIN EMAIL}    ${ADMIN PASSWORD}
    Verify logged in
    Navigate to users
    Demote user    ${MOD EMAIL}
    Verify user demotion    ${MOD EMAIL}
    Logout user

    Fill form and login    ${MOD EMAIL}    ${MOD PASSWORD}
    Verify logged in
    Navigate to My account
    Verify My account details    ${MOD USERNAME}    ${MOD EMAIL}    user