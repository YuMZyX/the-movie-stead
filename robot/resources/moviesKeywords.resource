*** Settings ***
Library    SeleniumLibrary
Resource    commonKeywords.resource

*** Keywords ***
Setup tests
    Clear test database
    Add user to test database    Test User     test@gmail.com     password    user     ${False}
    Open browser on TMS home page