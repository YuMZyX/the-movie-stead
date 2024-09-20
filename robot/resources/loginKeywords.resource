*** Settings ***
Library    SeleniumLibrary
Resource    commonKeywords.resource

*** Variables ***
${EMAIL FIELD}    //*[@id="email"]
${PW FIELD}    //*[@id="password"]
${LOGIN BUTTON}    //*[@id="login-button"]

*** Keywords ***
Setup tests
    Clear test database
    Seed users to test database
    Open browser on TMS home page

Fill form and login
    [Arguments]    ${email}=    ${pw}=
    Input Text    ${EMAIL FIELD}    ${email}
    Input Text    ${PW FIELD}    ${pw}
    Click Button    ${LOGIN BUTTON}
    Sleep    2s

Clear login form
    ${email}=    Get Element Attribute    ${EMAIL FIELD}    value
    ${length}=    Get Length    ${email}
    Run Keyword If    """${email}""" != ''
    ...    Repeat Keyword    ${length + 1}    Press Keys    ${EMAIL FIELD}    BACKSPACE
    
    ${pw}=    Get Element Attribute    ${PW FIELD}    value
    ${length}=    Get Length    ${pw}
    Run Keyword If    """${pw}""" != ''
    ...    Repeat Keyword    ${length + 1}    Press Keys    ${PW FIELD}    BACKSPACE