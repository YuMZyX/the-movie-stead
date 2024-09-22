*** Settings ***
Library    SeleniumLibrary
Library    DateTime
Resource    commonKeywords.resource

*** Variables ***
${MY ACCOUNT REVIEWS}    //p[contains(text(), "Movie reviews")]/../..//a
${SELECT ROLE MODERATOR}    //li[@data-value="moderator"]
${SELECT ROLE USER}    //li[@data-value="user"]

*** Keywords ***
Setup tests
    Clear test database
    Add user to test database    Test User     test@gmail.com     password    user     ${False}
    Open browser on TMS home page

Navigate to My account
    Click Element    ${ACCOUNT MENU}
    Click Element    ${ACCOUNT MENU MY ACCOUNT}
    Wait Until Page Contains    In Watchlist

Verify My account details
    [Arguments]    ${name}=    ${email}=    ${role}=
    ${date}=    Get Current Date    result_format=%d.%m.%Y
    Page Should Contain    Movie reviews
    Page Should Contain    ${name}
    Element Should Be Visible    //p[contains(text(), "Email")]/../..//p[contains(text(), "${email}")]
    Element Should Be Visible    //p[contains(text(), "Joined")]/../..//p[contains(text(), "${date}")]
    Element Should Be Visible    //p[contains(text(), "Role")]/../..//p[contains(text(), "${role}")]

Access reviews from My account page
    Click Element    ${MY ACCOUNT REVIEWS}
    Wait Until Element Is Visible    ${MY REVIEWS HEADER}

Access users My account
    [Arguments]    ${username}=
    Click Element    //a[text()="${username}"]
    Wait Until Page Contains    Movie reviews

Disable user
    [Arguments]    ${user_email}=
    Click Element    //div[contains(text(), "${user_email}")]/../..//button[@aria-label="Edit"]
    Wait Until Element Is Visible    //div[contains(text(), "${user_email}")]/../..//button[@aria-label="Save"]
    Click Element    //div[contains(text(), "${user_email}")]/../..//input[@type="checkbox"]
    Save user    ${user_email}

Delete user as admin
    [Arguments]    ${user_email}=
    Click Element    //div[contains(text(), "${user_email}")]/../..//button[@aria-label="Delete"]
    Wait Until Page Contains    Delete user?
    Click Element    ${DELETE CONFIRM BUTTON}
    Sleep    3s

Delete user as moderator
    [Arguments]    ${user_email}=
    Click Element    //div[contains(text(), "${user_email}")]/../..//button[@aria-label="Delete"]

Verify user deletion successful
    [Arguments]    ${user_email}=
    Page Should Not Contain    ${user_email}

Verify user deletion failed
    [Arguments]    ${user_email}=
    Wait Until Page Contains    Only admins are allowed to delete users
    Page Should Contain    ${user_email}

Promote user
    [Arguments]    ${user_email}=
    Edit role of user    ${user_email}
    Click Element    ${SELECT ROLE MODERATOR}
    Save user    ${user_email}

Demote user
    [Arguments]    ${user_email}=
    Edit role of user    ${user_email}
    Click Element    ${SELECT ROLE USER}
    Save user    ${user_email}

Edit role of user
    [Arguments]    ${user_email}=
    Click Element    //div[text()="${user_email}"]/../..//button[@aria-label="Edit"]
    Wait Until Element Is Visible    //div[text()="${user_email}"]/../..//button[@aria-label="Save"]
    Click Element    //div[text()="${user_email}"]/../..//div[@data-field="role"]
    Wait Until Element Is Visible    ${SELECT ROLE USER}

Save user
    [Arguments]    ${user_email}=
    Click Element    //div[text()="${user_email}"]/../..//button[@aria-label="Save"]
    Wait Until Element Is Visible    //div[text()="${user_email}"]/../..//button[@aria-label="Edit"]

Verify user promotion
    [Arguments]    ${user_email}=
    Element Should Be Visible    //div[text()="${user_email}"]/../..//div[@title="moderator"]

Verify user demotion
    [Arguments]    ${user_email}=
    Element Should Be Visible    //div[text()="${user_email}"]/../..//div[@title="user"]