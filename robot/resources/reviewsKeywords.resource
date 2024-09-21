*** Settings ***
Library    SeleniumLibrary
Resource    commonKeywords.resource

*** Variables ***
${CREATE REVIEW MENU}    //*[@id="movie-menu" and not(contains(@aria-hidden, "true"))]//*[contains(text(), "Create a review")]
${EDIT REVIEW MENU}    //*[@id="movie-menu" and not(contains(@aria-hidden, "true"))]//*[contains(text(), "Edit review")]
${CREATE REVIEW BUTTON}    //*[@id="create-review"]
${REVIEW TEXT}    //*[@id="review_text"]

*** Keywords ***
Setup tests
    Clear test database
    Add user to test database    Test User     test@gmail.com     password    user     ${False}
    Open browser on TMS home page

Create a review for first movie on page
    Click Element    ${FIRST MOVIE ON PAGE MENU}
    Wait Until Element Is Visible    ${CREATE REVIEW MENU}
    Click Element    ${CREATE REVIEW MENU}
    Wait Until Element Is Visible    ${CREATE REVIEW BUTTON}
    Input movie rating    3 Stars
    Input Text    ${REVIEW TEXT}    Not my cup of tea
    Click Element    ${CREATE REVIEW BUTTON}
    Wait Until Page Contains    You reviewed

Input movie rating
    [Arguments]    ${rating}=
    Click Element    //span[string()="${rating}"]/..