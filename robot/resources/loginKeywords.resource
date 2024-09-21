*** Settings ***
Library    SeleniumLibrary
Resource    commonKeywords.resource

*** Keywords ***
Setup tests
    Clear test database
    Seed users to test database
    Open browser on TMS home page

Clear login form
    Press Keys    ${EMAIL FIELD}    CTRL+A BACKSPACE
    ${email}=    Get Element Attribute    ${EMAIL FIELD}    value
    ${length}=    Get Length    ${email}
    Run Keyword If    """${email}""" != ''
    ...    Repeat Keyword    ${length + 1}    Press Keys    ${EMAIL FIELD}    BACKSPACE
    
    Press Keys    ${PW FIELD}    CTRL+A BACKSPACE
    ${pw}=    Get Element Attribute    ${PW FIELD}    value
    ${length}=    Get Length    ${pw}
    Run Keyword If    """${pw}""" != ''
    ...    Repeat Keyword    ${length + 1}    Press Keys    ${PW FIELD}    BACKSPACE