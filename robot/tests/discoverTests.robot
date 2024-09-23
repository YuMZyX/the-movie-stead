*** Settings ***
Resource    ${RESOURCES BASE}/commonKeywords.resource
Resource    ${RESOURCES BASE}/discoverKeywords.resource
Resource    ${RESOURCES BASE}/moviesKeywords.resource
Suite Setup    Setup suite
Test Setup    discoverKeywords.Setup tests
Test Teardown    Close Browser

*** Variables ***
${RESOURCES BASE}    ../resources
${MOVIES BUTTON}    //button[@id="movies"]
${DISCOVER MENU ITEM}    //li[@id="discover"]

*** Test Cases ***
User can click a movie in discover section to access detailed page
    [Documentation]    Verifies that user is able to click a movie in discover section to access detailed page of a movie
    [Tags]    Discover
    Navigate to discover movies
    ${count}=    Get Element Count    ${ALL CARDS ON PAGE}
    Should Be Equal As Integers    ${count}    20
    Click Element    ${FIRST CARD ON PAGE}
    Verify detailed page of a movie

User can access discover section from navbar
    [Documentation]    Verifies that user is able to click a movie in discover section to access detailed page of a movie
    [Tags]    Discover
    Mouse Over    ${MOVIES BUTTON}
    Wait Until Element Is Visible    ${DISCOVER MENU ITEM}
    Click Element    ${DISCOVER MENU ITEM}
    Wait Until Page Contains    Discover movies

User can see search results after using filter
    [Documentation]    Verifies that discover movies changes into search results after using search filters
    [Tags]    Discover
    Navigate to discover movies
    Enter movie runtime from    200
    Page Should Contain    Movies matched your search

User can discover movies by release date
    [Documentation]    Verifies that user is able to discover movies by specifying certain release date
    [Tags]    Discover
    Navigate to discover movies
    Enter release date starting    07192023
    Enter release date ending    07192023
    Click Element    ${FIRST CARD ON PAGE}
    Verify detailed movie page contains    19.07.2023
    Go Back
    Wait Until Page Contains    Movies matched your search
    Click Element    ${LAST CARD ON PAGE}
    Verify detailed movie page contains    19.07.2023

User can discover movies by release date timeframe
    [Documentation]    Verifies that user is able to discover movies by specifying release date timeframe
    [Tags]    Discover
    Navigate to discover movies
    Enter release date starting    01012024
    Enter release date ending    01312024
    Click Element    ${FIRST CARD ON PAGE}
    Verify detailed movie page contains    .01.2024
    Go Back
    Wait Until Page Contains    Movies matched your search
    Click Element    ${LAST CARD ON PAGE}
    Verify detailed movie page contains    .01.2024
    Go Back
    Wait Until Page Contains    Movies matched your search
    Click random card on page between    2    19
    Verify detailed movie page contains    .01.2024

User can discover movies by genre
    [Documentation]    Verifies that user is able to discover movies by specifying genre
    [Tags]    Discover
    Navigate to discover movies
    Select movie genre    Animation
    Click Element    ${FIRST CARD ON PAGE}
    Verify detailed movie page contains    Animation
    Go Back
    Wait Until Page Contains    Movies matched your search
    Click Element    ${LAST CARD ON PAGE}
    Verify detailed movie page contains    Animation
    Go Back
    Wait Until Page Contains    Movies matched your search
    Click random card on page between    2    19
    Verify detailed movie page contains    Animation

User can filter discovered movies with a search string
    [Documentation]    Verifies that user is able to filter discovered results with a search string
    [Tags]    Discover
    Navigate to discover movies
    Enter release date starting    07192023
    Enter release date ending    07192023
    Verify search results contain    Oppenheimer    Barbie    Cobweb
    Enter search filter    o
    Verify search results contain    Oppenheimer    Cobweb
    Verify search results don't contain    Barbie
    Clear search filter
    Enter search filter    a
    Verify search results contain    Barbie
    Verify search results don't contain    Oppenheimer    Cobweb
    Clear search filter
    Enter search filter    web
    Verify search results contain    Cobweb
    Verify search results don't contain    Oppenheimer    Barbie

User can sort discovered movies alphabetically
    [Documentation]    Verifies that user is able to sort discovered results alphabetically
    [Tags]    Discover
    Navigate to discover movies
    Enter release date starting    07192023
    Enter release date ending    07192023
    Sort results alphabetically    asc
    Expect movie order to be    Barbie    Cobweb    Haunting of the Queen Mary    Oppenheimer
    Sort results alphabetically    desc
    Expect movie order to be    Oppenheimer    Haunting of the Queen Mary    Cobweb    Barbie

User can sort discovered movies by release date
    [Documentation]    Verifies that user is able to sort discovered results alphabetically
    [Tags]    Discover
    Navigate to discover movies
    Enter release date starting    01162022
    Enter release date ending    01202022
    Select movie genre    Drama
    Select movie genre    Animation
    Sort results by release date    desc
    Expect movie order to be    Kitchen Brigade    Beautiful Minds    Heatwave    Fireheart
    Sort results by release date    asc
    Expect movie order to be    Fireheart    Heatwave    Beautiful Minds    Kitchen Brigade
