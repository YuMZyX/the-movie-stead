*** Settings ***
Library    SeleniumLibrary
Resource    commonKeywords.resource

*** Variables ***
${ADD TO WATCHLIST MENU}    //*[@id="movie-menu" and not(contains(@aria-hidden, "true"))]//*[contains(text(), "Add to Watchlist")]
${REMOVE FROM WATCHLIST MENU}    //*[@id="movie-menu" and not(contains(@aria-hidden, "true"))]//*[contains(text(), "Remove from Watchlist")]

*** Keywords ***
Setup tests
    Clear test database
    Add user to test database    Test User     test@gmail.com     password    user     ${False}
    Open browser on TMS home page

Verify one movie exists in watchlist
    Page Should Not Contain    Your watchlist is currently empty
    ${count}=    Get Element Count    ${ALL CARDS ON PAGE}
    Should Be Equal As Integers    ${count}    1
    
Add first movie on page to watchlist
    Click Element    ${FIRST MOVIE ON PAGE MENU}
    Wait Until Element Is Visible    ${ADD TO WATCHLIST MENU}
    Click Element    ${ADD TO WATCHLIST MENU}
    Wait Until Page Contains    has been added to your watchlist

Remove first movie on page from watchlist
    Click Element    ${FIRST MOVIE ON PAGE MENU}
    Wait Until Element Is Visible    ${REMOVE FROM WATCHLIST MENU}
    Click Element    ${REMOVE FROM WATCHLIST MENU}
    Wait Until Page Contains    has been removed from your watchlist