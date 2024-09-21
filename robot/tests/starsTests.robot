*** Settings ***
Resource    ${RESOURCES BASE}/commonKeywords.resource
Resource    ${RESOURCES BASE}/starsKeywords.resource
Suite Setup    Setup suite
Test Setup    Setup tests
Test Teardown    Close Browser
Documentation    Stars functionality test cases

*** Variables ***
${RESOURCES BASE}    ../resources
${STAR SEARCH}    //*[@id="star-search"]

*** Test Cases ***
There are 20 stars at trending stars page
    [Documentation]    Verifies that trending stars page has 20 stars
    [Tags]    Stars
    ${count}=    Get Element Count    ${ALL CARDS ON PAGE}
    Should Be Equal As Integers    ${count}    20

User can access 20 pages of trending stars
    [Documentation]    Verifies that trending stars page has 20 pages of stars
    [Tags]    Stars
    Click Element    ${PAGE 5}
    Sleep    1s
    ${url}=    Get Location
    Should Contain    ${url}    stars/trending/5
    Click Element    ${LAST PAGE}
    Sleep    1s
    ${url}=    Get Location
    Should Contain    ${url}    stars/trending/20

User can access detailed page of a stars
    [Documentation]    Verifies that user can click a star to see a detailed page of a star
    [Tags]    Stars
    Click Element    ${FIRST CARD ON PAGE}
    Sleep    1s
    Page Should Contain    Priority
    Page Should Contain    Gender
    Page Should Contain    Known for
    Element Should Be Visible    ${IMDB LOGO}

User can search for a specific star
    [Documentation]    Verifies that user can search for a specific star and see detailed page
    [Tags]    Stars
    Input Text    ${STAR SEARCH}    Jasper Pääkkönen
    Wait Until Page Contains    1 Stars matched your search
    Click Element    //div[contains(text(), "Jasper Pääkkönen")]
    Sleep    1s
    Page Should Contain    15.07.1980
    Page Should Contain    Helsinki, Finland
    Page Should Contain    BlacKkKlansman
    Page Should Contain    Felix Kendrickson

User can search for multiple stars
    [Documentation]    Verifies that user can search for multiple stars
    [Tags]    Stars
    Input Text    ${STAR SEARCH}    Skarsgård
    Wait Until Page Contains    Stars matched your search
    Page Should Contain    Bill Skarsgård
    Page Should Contain    Gustaf Skarsgård
    Page Should Contain    Stellan Skarsgård
    Page Should Contain    Alexander Skarsgård