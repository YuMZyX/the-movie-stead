*** Settings ***
Library    SeleniumLibrary
Resource    commonKeywords.resource

*** Variables ***
${STARS}    //*[@id="stars"]

*** Keywords ***
Setup tests
    Open browser on TMS home page
    Click Element    ${STARS}
    Wait Until Page Contains    Trending stars