*** Settings ***
Library    SeleniumLibrary    
Library    RequestsLibrary

*** Variables ***
${HOME PAGE}    http://localhost:5173
${BACKEND}    http://localhost:5173/api
${BROWSER}    chrome
${ACCOUNT MENU}    //*[@data-testid="AccountCircleIcon"]
${ACCOUNT MENU LOGIN}    //*[@id="account-menu-login"]
${ACCOUNT MENU LOGOUT}    //*[@id="logout"]
${ACCOUNT MENU MY ACCOUNT}    //*[@id="my-account"]
${EMAIL FIELD}    //*[@id="email"]
${PW FIELD}    //*[@id="password"]
${LOGIN BUTTON}    //*[@id="login-button"]
${MY REVIEWS}    //*[@id="my-reviews"]
${WATCHLIST}    //*[@id="watchlist"]
${USERS}    //*[@id="users"]
${ALL CARDS ON PAGE}    //div[contains(@class, "MuiGrid-container")]/div
${FIRST CARD ON PAGE}    //div[contains(@class, "MuiGrid-container")]/div[1]
${FIRST MOVIE ON PAGE MENU}    //div[contains(@class, "MuiGrid-container")]/div[1]//button
${ICON ADD TO WATCLIST}    //button[@aria-label="Add to Watchlist"]
${ICON CREATE REVIEW}    //button[@aria-label="Create a review"]
${PAGE 5}    //button[@aria-label="Go to page 5"]
${LAST PAGE}    //button[@aria-label="Go to last page"]
${IMDB LOGO}    //img[@alt="IMDb logo"]
${TMS LOGO}    //img[@alt="The Movie Stead - Logo"]
${MY REVIEWS HEADER}    //*[contains(@class, "MuiTypography-h")][contains(string(), "review")]
${DELETE CONFIRM BUTTON}    //button[text()="Delete"]

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
    Wait Until Page Contains    Trending movies
    Title Should Be    The Movie Stead

Navigate to login page
    Click Element    ${ACCOUNT MENU}
    Click Element    ${ACCOUNT MENU LOGIN}
    Wait Until Page Contains    The Movie Stead - Login
    Page Should Contain    Don't have an account? Sign Up

Fill form and login
    [Arguments]    ${email}=    ${pw}=
    Input Text    ${EMAIL FIELD}    ${email}
    Input Text    ${PW FIELD}    ${pw}
    Click Button    ${LOGIN BUTTON}
    Sleep    1s

Logout user
    Click Element    ${ACCOUNT MENU}
    Click Element    ${ACCOUNT MENU LOGOUT}
    Wait Until Page Contains    The Movie Stead - Login
    Page Should Contain    Don't have an account? Sign Up

Verify logged in
    Wait Until Page Contains    Trending movies
    Click Element    ${ACCOUNT MENU}
    Page Should Contain Element    ${ACCOUNT MENU MY ACCOUNT}
    Press Keys    ${ACCOUNT MENU}    ESCAPE

Verify not logged in
    Click Element    ${ACCOUNT MENU}
    Page Should Not Contain Element    ${ACCOUNT MENU MY ACCOUNT}
    Press Keys    ${ACCOUNT MENU}    ESCAPE

Verify unsuccessfull login
    Verify not logged in
    Page Should Not Contain    Trending movies
    Page Should Not Contain    Watchlist
    Page Should Not Contain    My Reviews

Navigate to My Reviews
    Click Element    ${MY REVIEWS}
    Wait Until Element Is Visible    ${MY REVIEWS HEADER}

Navigate to Watchlist
    Click Element    ${WATCHLIST}
    Wait Until Page Contains    Your watchlist

Navigate to users
    Click Element    ${USERS}
    Wait Until Page Contains    User management
    Sleep    2s

Navigate to homepage
    Click Element    ${TMS LOGO}
    Wait Until Page Contains    Trending movies