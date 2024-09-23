*** Settings ***
Library    SeleniumLibrary
Library    DateTime
Resource    commonKeywords.resource

*** Variables ***
${ADVANCED SEARCH LINK}    //a/h6[text()='Advanced search >']
${RUNTIME FROM FIELD}    //*[@id="runtime_min"]
${RELEASE DATE STARTING}    //*[@id="release-date-min"]
${RELEASE DATE ENDING}    //*[@id="release-date-max"]
${SELECT GENRES}    //*[@id="genres"]
${GENRE ACTION}    //li[@id="Action"]
${SEARCH FILTER}    //*[@id="filter-results"]
${SELECT SORT BY}    //*[@id="sort-results"]
${SORT A-Z}    //li[@id="original_title.asc"]
${SORT Z-A}    //li[@id="original_title.desc"]
${SORT DATE ASC}    //li[@id="primary_release_date.asc"]
${SORT DATE DESC}    //li[@id="primary_release_date.desc"]

*** Keywords ***
Setup tests
    Open browser on TMS home page

Navigate to discover movies
    Click Element    ${ADVANCED SEARCH LINK}
    Wait Until Page Contains    Discover movies

Enter movie runtime from
    [Arguments]    ${runtime}=
    Input Text    ${RUNTIME FROM FIELD}    200
    Sleep    2s

Enter release date starting
    [Arguments]    ${date}=
    Press Keys    ${RELEASE DATE STARTING}    ${date}
    Sleep    2s

Enter release date ending
    [Arguments]    ${date}=
    Press Keys    ${RELEASE DATE ENDING}    ${date}
    Sleep    2s

Verify detailed movie page contains
    [Arguments]    ${date}=
    Wait Until Page Contains    Overview
    Page Should Contain    ${date}

Select movie genre
    [Arguments]    ${genre}=
    Click Element    ${SELECT GENRES}
    Wait Until Element Is Visible    ${GENRE ACTION}
    Click Element    //li[text()="${genre}"]
    Press Keys    ${SELECT GENRES}    ESCAPE
    Sleep    2s

Enter search filter
    [Arguments]    ${filter}=
    Input Text    ${SEARCH FILTER}    ${filter}
    Sleep    1s

Clear search filter
    Press Keys    ${SEARCH FILTER}    CTRL+A BACKSPACE
    Press Keys    ${SEARCH FILTER}    BACKSPACE
    Sleep    1s

Verify search results contain
    [Arguments]    @{movies}
    FOR    ${movie}    IN    @{movies}
        Page Should Contain    ${movie}
    END

Verify search results don't contain
    [Arguments]    @{movies}
    FOR    ${movie}    IN    @{movies}
        Page Should Not Contain    ${movie}
    END

Sort results alphabetically
    [Arguments]    ${direction}=
    Click Element    ${SELECT SORT BY}
    IF    $direction == "asc"
        Click Element    ${SORT A-Z}
    ELSE
        Click Element    ${SORT Z-A}
    END
    Sleep    1s

Sort results by release date
    [Arguments]    ${direction}=
    Click Element    ${SELECT SORT BY}
    IF    $direction == "asc"
        Click Element    ${SORT DATE ASC}
    ELSE
        Click Element    ${SORT DATE DESC}
    END
    Sleep    1s

Expect movie order to be
    [Arguments]    @{movies}
    FOR    ${index}    ${movie}    IN ENUMERATE    @{movies}
        ${div_index}    Evaluate    $index + 1
        Element Text Should Be    //div[contains(@class, "MuiGrid-container Mui")]/div[${div_index}]//a/div    ${movie}
    END