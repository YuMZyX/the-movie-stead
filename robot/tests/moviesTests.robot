*** Settings ***
Resource    ${RESOURCES BASE}/commonKeywords.resource
Resource    ${RESOURCES BASE}/moviesKeywords.resource
Suite Setup    Setup suite
Test Setup    Setup tests
Test Teardown    Close Browser
Documentation    Movies functionality test cases

*** Variables ***
${RESOURCES BASE}    ../resources
${PAGE 5}    //button[@aria-label='Go to page 5']
${LAST PAGE}    //button[@aria-label='Go to last page']
${IMDB LOGO}    //img[@alt='IMDb logo']
${SEARCH FIELD}    //*[@id="search"]
${SEARCH FIELD INVALID}    //input[@aria-invalid='true' and @id='search']
${SEARCH YEAR}    //*[@id="release-year"]
${SEARCH BUTTON}    //*[@id="search-button"]

*** Test Cases ***
There are 20 movies at home page
    [Documentation]    Verifies that trending movies page has 20 movies
    [Tags]    Movies
    ${count}=    Get Element Count    ${TRENDING MOVIES}
    Should Be Equal As Integers    ${count}    20

User can access 20 pages of trending movies
    [Documentation]    Verifies that trending movies page has 20 pages of movies
    [Tags]    Movies
    Click Element    ${PAGE 5}
    Sleep    1s
    ${url}=    Get Location
    Should Contain    ${url}    trending/5
    Click Element    ${LAST PAGE}
    Sleep    1s
    ${url}=    Get Location
    Should Contain    ${url}    trending/20

User can access detailed page of a movie
    [Documentation]    Verifies that user can a click a movie to see detailed page of a movie
    [Tags]    Movies
    Click Element    ${FIRST MOVIE ON PAGE}
    Sleep    1s
    Page Should Contain    Overview
    Page Should Contain    Director
    Page Should Contain    Writers
    Page Should Contain    Stars
    Element Should Be Visible    ${IMDB LOGO}
    Element Should Not Be Visible    ${ICON ADD TO WATCLIST}
    Element Should Not Be Visible    ${ICON CREATE REVIEW}

User can search for a specific movie
    [Documentation]    Verifies that user can use search string and release year to search for a specific movie
    [Tags]    Movies
    Input Text    ${SEARCH FIELD}    Die Hard
    Press Keys    ${SEARCH YEAR}    1988
    Click Button    ${SEARCH BUTTON}
    Sleep    1s
    Page Should Contain    Die Hard
    Page Should Not Contain    Die Hard 2
    Page Should Not Contain    Live Free or Die Hard
    Click Element    //div[contains(text(),'Die Hard')]
    Sleep    1s
    Page Should Contain    John McTiernan
    Page Should Contain    Bruce Willis
    Page Should Contain    15.07.1988
    Page Should Contain    The odds are against John McClane...

User can search for multiple movies
    [Documentation]    Verifies that user can use search string to search for multiple movies
    [Tags]    Movies
    Input Text    ${SEARCH FIELD}    Die Hard
    Click Button    ${SEARCH BUTTON}
    Sleep    1s
    Page Should Contain    Die Hard
    Page Should Contain    Die Hard 2
    Page Should Contain    Live Free or Die Hard

Cannot search with release year only
    [Documentation]    Verifies that user cannot search by specifying only release year
    [Tags]    Movies
    Press Keys    ${SEARCH YEAR}    1988
    Click Button    ${SEARCH BUTTON}
    Sleep    1s
    Page Should Contain    Trending movies
    Element Should Be Visible    ${SEARCH FIELD INVALID}

Cannot see watchlist and review menu items when not logged in
    [Documentation]    Verifies that user cannot see watchlist and review menu items when not logged in
    [Tags]    Movies
    Click Button    ${FIRST MOVIE ON PAGE MENU}
    Sleep    0.5s
    Page Should Not Contain    Add to Watchlist
    Page Should Not Contain    Create a review
    Page Should Contain    Log in to review or favorite movies.

Can see watchlist and review menu items when logged in
    [Documentation]    Verifies that user can see watchlist and review menu items when logged in
    [Tags]    Movies
    Navigate to login page
    Fill form and login    test@gmail.com    password
    Click Button    ${FIRST MOVIE ON PAGE MENU}
    Sleep    0.5s
    Page Should Contain    Add to Watchlist
    Page Should Contain    Create a review
    Page Should Not Contain    Log in to review or favorite movies.

Can see watchlist and review icons on detailed movie page when logged in
    [Documentation]    Verifies that user can see watchlist and review icons on detailed movie page when logged in
    [Tags]    Movies
    Navigate to login page
    Fill form and login    test@gmail.com    password
    Click Element    ${FIRST MOVIE ON PAGE}
    Sleep    1s
    Page Should Contain    Overview
    Page Should Contain    Director
    Page Should Contain    Writers
    Page Should Contain    Stars
    Element Should Be Visible    ${IMDB LOGO}
    Element Should Be Visible    ${ICON ADD TO WATCLIST}
    Element Should Be Visible    ${ICON CREATE REVIEW}