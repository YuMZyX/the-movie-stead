*** Settings ***
Library    SeleniumLibrary
Library    DateTime
Resource    commonKeywords.resource

*** Variables ***
${CREATE REVIEW MENU}    //*[@id="movie-menu" and not(contains(@aria-hidden, "true"))]//*[contains(text(), "Create a review")]
${EDIT REVIEW MENU}    //*[@id="movie-menu" and not(contains(@aria-hidden, "true"))]//*[contains(text(), "Edit review")]
${CREATE REVIEW BUTTON}    //*[@id="create-review"]
${EDIT REVIEW BUTTON}    //*[@id="edit-review"]
${DELETE REVIEW BUTTON}    //*[@id="delete-review"]
${REVIEW TEXT}    //*[@id="review_text"]
${REVIEW EXPAND}    //*[@data-testid="ExpandMoreOutlinedIcon"]
${ICON EDIT REVIEW}    //button[@aria-label="Edit review"]
${RATING AVG}    //button[@aria-label="Rating average"]/p
${LATEST REVIEWS}    //h6[string()="Latest reviews:"]/../div/*

*** Keywords ***
Setup tests
    Clear test database
    Add user to test database    Test User     test@gmail.com     password    user     ${False}
    Open browser on TMS home page

Create a review
    [Arguments]    ${stars}=    ${review}=
    Wait Until Element Is Visible    ${CREATE REVIEW BUTTON}
    Input movie rating    ${stars}
    Input Text    ${REVIEW TEXT}    ${review}
    Click Element    ${CREATE REVIEW BUTTON}
    Wait Until Page Contains    You reviewed

Edit review
    [Arguments]    ${stars}=    ${review}=
    Wait Until Element Is Visible    ${EDIT REVIEW BUTTON}
    Input movie rating    ${stars}
    Press Keys    ${REVIEW TEXT}    CTRL+A BACKSPACE
    Press Keys    ${REVIEW TEXT}    BACKSPACE
    Input Text    ${REVIEW TEXT}    ${review}
    Click Element    ${EDIT REVIEW BUTTON}
    Wait Until Page Contains    Edited review for

Delete review
    Wait Until Element Is Visible    ${DELETE REVIEW BUTTON}
    Click Element    ${DELETE REVIEW BUTTON}
    Wait Until Element Is Visible    ${DELETE CONFIRM BUTTON}
    Click Element    ${DELETE CONFIRM BUTTON}
    Wait Until Page Contains    Deleted review for

Create a review for first movie on page
    [Arguments]    ${stars}=5 Stars    ${review}=
    Click Element    ${FIRST MOVIE ON PAGE MENU}
    Wait Until Element Is Visible    ${CREATE REVIEW MENU}
    Click Element    ${CREATE REVIEW MENU}
    Create a review    ${stars}    ${review}

Edit review for first movie on page
    [Arguments]    ${stars}=5 Stars    ${review}=
    Click Element    ${FIRST MOVIE ON PAGE MENU}
    Wait Until Element Is Visible    ${EDIT REVIEW MENU}
    Click Element    ${EDIT REVIEW MENU}
    Edit review    ${stars}    ${review}

Delete review for first movie on page
    Click Element    ${FIRST MOVIE ON PAGE MENU}
    Wait Until Element Is Visible    ${EDIT REVIEW MENU}
    Click Element    ${EDIT REVIEW MENU}
    Delete review

Create a review from detailed movie page
    [Arguments]    ${stars}=5 Stars    ${review}=
    Click Element    ${ICON CREATE REVIEW}
    Create a review    ${stars}    ${review}

Edit review from detailed movie page
    [Arguments]    ${stars}=5 Stars    ${review}=
    Click Element    ${ICON EDIT REVIEW}
    Edit review    ${stars}    ${review}

Delete review from detailed movie page
    Click Element    ${ICON EDIT REVIEW}
    Delete review

Input movie rating
    [Arguments]    ${rating}=
    Click Element    //span[string()="${rating}"]/..

Verify one review exists in My Reviews
    Page Should Not Contain    You have not reviewed any movies yet
    ${count}=    Get Element Count    ${ALL CARDS ON PAGE}
    Should Be Equal As Integers    ${count}    1

Verify no reviews exist in My Reviews
    Page Should Contain    You have not reviewed any movies yet

Verify review text and rating
    [Arguments]    ${rating}=    ${review}=
    Element Should Be Visible    //p[string()=${rating}]
    IF    $review != ""
        Click Element    ${REVIEW EXPAND}
        Wait Until Element Is Visible    //div[contains(@class, "MuiCardContent")]/p[string()="${review}"]
    END

Verify latest reviews
    [Arguments]    ${user}=    ${rating}=    ${review}=
    Wait Until Page Contains    Latest reviews:
    ${date}=    Get Current Date    result_format=%d.%m.%Y
    Page Should Contain    ${date}
    Page Should Contain    ${user}
    Page Should Contain    Rating: ${rating}
    Page Should Contain    ${review}

Verify rating average
    [Arguments]    ${avg}=
    Wait Until Page Contains    Overview
    Element Text Should Be    ${RATING AVG}    ${avg}

Verify latest reviews count
    [Arguments]    ${expected}=
    ${count}=    Get Element Count    ${LATEST REVIEWS}
    Should Be Equal As Integers    ${expected}    ${count}

Access users reviews
    [Arguments]    ${user_email}=
    Click Element    //div[contains(text(), "${user_email}")]/../..//a[text()="Check"]
    Wait Until Page Contains    Reviews of user