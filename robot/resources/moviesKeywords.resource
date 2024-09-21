*** Settings ***
Library    SeleniumLibrary
Resource    commonKeywords.resource

*** Keywords ***
Setup tests
    Clear test database
    Add user to test database    Test User     test@gmail.com     password    user     ${False}
    Open browser on TMS home page

Verify detailed page of a movie
    [Arguments]    ${loggedIn}=${False}
    Page Should Contain    Overview
    Page Should Contain    Director
    Page Should Contain    Writers
    Page Should Contain    Stars
    Element Should Be Visible    ${IMDB LOGO}
    IF    ${loggedIn}
        Element Should Be Visible    ${ICON ADD TO WATCLIST}
        Element Should Be Visible    ${ICON CREATE REVIEW}
    ELSE
        Element Should Not Be Visible    ${ICON ADD TO WATCLIST}
        Element Should Not Be Visible    ${ICON CREATE REVIEW}
    END