*** Settings ***
Library    SeleniumLibrary
Resource    commonKeywords.resource

*** Variables ***
${ACCOUNT MENU SIGNUP}    //*[@id="account-menu-signup"]
${NAME FIELD}    //*[@id="name"]
${EMAIL FIELD}    //*[@id="email"]
${PW FIELD}    //*[@id="password"]
${PWC FIELD}    //*[@id="passwordCheck"]
${SIGNUP BUTTON}    //*[@id="signup-button"]

*** Keywords ***
Setup tests
    Clear test database
    Open browser on TMS home page

Navigate to signup page
    Click Element    ${ACCOUNT MENU}
    Click Element    ${ACCOUNT MENU SIGNUP}
    Page Should Contain    The Movie Stead - Sign up
    Page Should Contain    Already have an account? Sign in

Fill form and signup
    [Arguments]    ${name}=    ${email}=    ${pw}=    ${pwc}=
    Input Text    ${NAME FIELD}    ${name}
    Input Text    ${EMAIL FIELD}    ${email}
    Input Text    ${PW FIELD}    ${pw}
    Input Text    ${PWC FIELD}    ${pwc}
    Click Button    ${SIGNUP BUTTON}
    Sleep    2s

Clear signup form
    Press Keys    ${NAME FIELD}    CTRL+A BACKSPACE
    ${name}=    Get Element Attribute    ${NAME FIELD}    value
    ${length}=    Get Length    ${name}
    Run Keyword If    """${name}""" != ''
    ...    Repeat Keyword    ${length + 1}    Press Keys    ${NAME FIELD}    BACKSPACE

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
    
    Press Keys    ${PWC FIELD}    CTRL+A BACKSPACE
    ${pwc}=    Get Element Attribute    ${PWC FIELD}    value
    ${length}=    Get Length    ${pwc}
    Run Keyword If    """${pwc}""" != ''
    ...    Repeat Keyword    ${length + 1}    Press Keys    ${PWC FIELD}    BACKSPACE
    