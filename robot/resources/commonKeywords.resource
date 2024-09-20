*** Settings ***
Library    SeleniumLibrary    
Library    RequestsLibrary

*** Variables ***
${HOME PAGE}    http://localhost:5173
${BACKEND}    http://localhost:5173/api
${BROWSER}    chrome
${ACCOUNT MENU}    //*[@data-testid="AccountCircleIcon"]
${ACCOUNT MENU LOGIN}    //*[@id="account-menu-login"]
${ACCOUNT MENU MY ACCOUNT}    //*[@id="my-account"]

*** Keywords ***
Setup suite
    Set Selenium Speed    0

Clear test database
    POST    ${BACKEND}/testing/reset

Add user to test database
    [Arguments]    ${name}=    ${email}=    ${password}=    ${role}=    ${disabled}=
    ${body}=    Create Dictionary    name=${name}    email=${email}    password=${password}    role=${role}    disabled=${disabled}
    POST    ${BACKEND}/users    json=${body}

Seed users to test database
    Add user to test database    Regular User    regular@gmail.com    regularpw    user    ${False}
    Add user to test database    Mod User    moderator@gmail.com    moderatorpw    moderator    ${False}
    Add user to test database    Admin User    admin@gmail.com    adminpw    admin    ${False}
    Add user to test database    Disabled User    disabled@gmail.com    disabledpw    user    ${True}

Open browser on TMS home page
    Open Browser    ${HOME PAGE}    ${BROWSER}
    Maximize Browser Window
    Sleep    1s
    Title Should Be    The Movie Stead
    Page Should Contain    Trending movies

Navigate to login page
    Click Element    ${ACCOUNT MENU}
    Click Element    ${ACCOUNT MENU LOGIN}
    Page Should Contain    The Movie Stead - Login
    Page Should Contain    Don't have an account? Sign Up

Verify logged in
    Click Element    ${ACCOUNT MENU}
    Page Should Contain Element    ${ACCOUNT MENU MY ACCOUNT}

Verify not logged in
    Click Element    ${ACCOUNT MENU}
    Page Should Not Contain Element    ${ACCOUNT MENU MY ACCOUNT}

Verify unsuccessfull login
    Verify not logged in
    Page Should Not Contain    Trending movies
    Page Should Not Contain    Watchlist
    Page Should Not Contain    My Reviews