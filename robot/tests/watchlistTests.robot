*** Settings ***
Resource    ${RESOURCES BASE}/commonKeywords.resource
Resource    ${RESOURCES BASE}/watchlistKeywords.resource
Resource    ${RESOURCES BASE}/moviesKeywords.resource
Resource    ${RESOURCES BASE}/reviewsKeywords.resource
Suite Setup    Setup suite
Test Setup    watchlistKeywords.Setup tests
Test Teardown    Close Browser
Documentation    Watchlist functionality test cases

*** Variables ***
${RESOURCES BASE}    ../resources
${EMAIL}    test@gmail.com
${PASSWORD}    password
${ICON REMOVE FROM WATCHLIST}    //button[@aria-label="Remove from Watchlist"]

*** Test Cases ***
User can add movie to watchlist from movie card menu
    [Documentation]    Verifies that user can add movie to watchlist using movie cards menu
    [Tags]    Watchlist
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Add first movie on page to watchlist
    Navigate to Watchlist
    Verify one movie exists in watchlist

User can add movie to watchlist from detailed page of a movie
    [Documentation]    Verifies that user can add movie to watchlist using icon button in detailed page of a movie
    [Tags]    Watchlist
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Click Element    ${FIRST CARD ON PAGE}
    Verify detailed page of a movie    ${True}
    Click Element    ${ICON ADD TO WATCLIST}
    Wait Until Page Contains    has been added to your watchlist
    Navigate to Watchlist
    Verify one movie exists in watchlist

User can add movie to watchlist from My Reviews page
    [Documentation]    Verifies that user can add a reviewed movie to watchlist from My Reviews page
    [Tags]    Watchlist
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Create a review for first movie on page    3 Stars     Not my cup of tea
    Navigate to My Reviews
    Add first movie on page to watchlist
    Navigate to Watchlist
    Verify one movie exists in watchlist

User can remove movie from watchlist using movie card menu
    [Documentation]    Verifies that user can remove a movie from watchlist using movie card menu
    [Tags]    Watchlist
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Add first movie on page to watchlist
    Remove first movie on page from watchlist
    Navigate to Watchlist
    Page Should Contain    Your watchlist is currently empty

User can remove movie from watchlist using watchlist
    [Documentation]    Verifies that user can remove a movie from watchlist using card menu in watchlist
    [Tags]    Watchlist
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Add first movie on page to watchlist
    Navigate to Watchlist
    Verify one movie exists in watchlist
    Remove first movie on page from watchlist
    Sleep    1s
    Page Should Contain    Your watchlist is currently empty

User can remove movie from watchlist using detailed page of a movie
    [Documentation]    Verifies that user can remove a movie from watchlist using detailed page of a movie
    [Tags]    Watchlist
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Add first movie on page to watchlist
    Click Element    ${FIRST CARD ON PAGE}
    Wait Until Page Contains    Overview
    Click Element    ${ICON REMOVE FROM WATCHLIST}
    Wait Until Page Contains    has been removed from your watchlist
    Navigate to Watchlist
    Page Should Contain    Your watchlist is currently empty

User can remove movie from watchlist using My Reviews page
    [Documentation]    Verifies that user can remove a reviewed movie from watchlist using My Reviews page
    [Tags]    Watchlist
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Add first movie on page to watchlist
    Create a review for first movie on page
    Navigate to My Reviews
    Remove first movie on page from watchlist
    Navigate to Watchlist
    Page Should Contain    Your watchlist is currently empty