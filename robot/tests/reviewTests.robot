*** Settings ***
Resource    ${RESOURCES BASE}/commonKeywords.resource
Resource    ${RESOURCES BASE}/reviewsKeywords.resource
Resource    ${RESOURCES BASE}/moviesKeywords.resource
Resource    ${RESOURCES BASE}/watchlistKeywords.resource
Suite Setup    Setup suite
Test Setup    reviewsKeywords.Setup tests
Test Teardown    Close Browser
Documentation    Review functionality test cases

*** Variables ***
${RESOURCES BASE}    ../resources
${EMAIL}    test@gmail.com
${PASSWORD}    password
${USERNAME}    Test User
${ICON EDIT REVIEW}    //button[@aria-label="Edit review"]
${STAR EDIT REVIEW}    //button[@aria-label='Edit review']/p

*** Test Cases ***
User can create and edit reviews from movie card menu
    [Documentation]    Verifies that user can create a review and edit review using movie cards menu
    [Tags]    Review
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Create a review for first movie on page    8 Stars     Very good
    Navigate to My Reviews
    Verify one review exists in My Reviews
    Verify review text and rating    8    Very good
    Navigate to homepage
    Edit review for first movie on page    6 Stars    Wasn't as good as I remembered
    Navigate to My Reviews
    Verify one review exists in My Reviews
    Verify review text and rating    6    Wasn't as good as I remembered

User can create and edit review from detailed movie page
    [Documentation]    Verifies that user can create a review and edit review from detailed movie page and review shows up in latest reviews
    [Tags]    Review
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Click Element    ${FIRST CARD ON PAGE}
    Verify detailed page of a movie    ${True}
    Create a review from detailed movie page    2 Stars    Complete waste of time
    Verify latest reviews    ${USERNAME}     2    Complete waste of time
    Verify latest reviews count    1
    Navigate to My Reviews
    Verify one review exists in My Reviews
    Verify review text and rating    2    Complete waste of time

    Click Element    ${FIRST CARD ON PAGE}
    Wait Until Page Contains    Overview
    Edit review from detailed movie page    1 Star    Even worse than I remembered
    Sleep    1s
    Verify latest reviews    ${USERNAME}     1    Even worse than I remembered
    Verify latest reviews count    1
    Navigate to My Reviews
    Verify one review exists in My Reviews
    Verify review text and rating    1    Even worse than I remembered

User can create and edit review from watchlist
    [Documentation]    Verifies that user can create a review and edit review from his/her watchlist
    [Tags]    Review
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Add first movie on page to watchlist
    Navigate to Watchlist
    Create a review for first movie on page    5 Stars    I expected more from this movie
    Navigate to My Reviews
    Verify one review exists in My Reviews
    Verify review text and rating    5    I expected more from this movie
    Navigate to Watchlist
    Edit review for first movie on page    6 Stars
    Navigate to My Reviews
    Verify one review exists in My Reviews
    Verify review text and rating    6

User can edit review from My Reviews
    [Documentation]    Verifies that user can edit review from My Reviews page
    [Tags]    Review
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Create a review for first movie on page    9 Stars    I really loved this movie!
    Navigate to My Reviews
    Edit review for first movie on page    10 Stars    Best movie ever!
    Sleep    1s
    Verify one review exists in My Reviews
    Verify review text and rating    10    Best movie ever!

User can edit review using star icons
    [Documentation]    Verifies that user can edit review using star icons in My Reviews and in detailed movie page
    [Tags]    Review
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Create a review for first movie on page
    Click Element    ${FIRST CARD ON PAGE}
    Wait Until Page Contains    Overview
    Click Element    ${STAR EDIT REVIEW}
    Edit review    6 Stars    Better than I remembered
    Navigate to My Reviews
    Verify one review exists in My Reviews
    Verify review text and rating    6    Better than I remembered
    Click Element    ${STAR EDIT REVIEW}
    Edit review    7 Stars    This movie just keeps getting better
    Sleep    1s
    Verify one review exists in My Reviews
    Verify review text and rating    7    This movie just keeps getting better

Rating average is calculated correctly
    [Documentation]    Verifies that rating average is calculated correctly for a movie
    [Tags]    Review
    Seed users to test database
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Create a review for first movie on page
    Click Element    ${FIRST CARD ON PAGE}
    Verify rating average    5
    Logout user

    Fill form and login    regular@gmail.com    regularpw
    Verify logged in
    Wait Until Page Does Not Contain    You reviewed
    Create a review for first movie on page    8 Stars
    Click Element    ${FIRST CARD ON PAGE}
    Verify rating average    6.5
    Verify latest reviews count    2
    Logout user

    Fill form and login    moderator@gmail.com    moderatorpw
    Verify logged in
    Wait Until Page Does Not Contain    You reviewed
    Create a review for first movie on page    9 Stars
    Click Element    ${FIRST CARD ON PAGE}
    Verify rating average    7.3
    Verify latest reviews count    3
    Logout user

    Fill form and login    admin@gmail.com    adminpw
    Verify logged in
    Wait Until Page Does Not Contain    You reviewed
    Create a review for first movie on page    2 Stars
    Click Element    ${FIRST CARD ON PAGE}
    Verify rating average    6
    Verify latest reviews count    3

User can delete review from movie card menu
    [Documentation]    Verifies that user can delete review using using movie cards menu
    [Tags]    Review
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Create a review for first movie on page    9 Stars     Very good
    Navigate to My Reviews
    Verify one review exists in My Reviews
    Navigate to homepage
    Delete review for first movie on page
    Navigate to My Reviews
    Verify no reviews exist in My Reviews

User can delete review from detailed movie page
    [Documentation]    Verifies that user can delete review using detailed movie page
    [Tags]    Review
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Create a review for first movie on page    9 Stars     Very good
    Click Element    ${FIRST CARD ON PAGE}
    Wait Until Page Contains    Overview
    Delete review from detailed movie page
    Navigate to My Reviews
    Verify no reviews exist in My Reviews

User can delete review from watchlist
    [Documentation]    Verifies that user can delete review from his/her watchlist
    [Tags]    Review
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Add first movie on page to watchlist
    Create a review for first movie on page    9 Stars     Very good
    Navigate to Watchlist
    Delete review for first movie on page
    Navigate to My Reviews
    Verify no reviews exist in My Reviews

User can delete review from My Reviews
    [Documentation]    Verifies that user can delete review from his/her My Reviews
    [Tags]    Review
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Create a review for first movie on page    9 Stars     Very good
    Navigate to My Reviews
    Verify one review exists in My Reviews
    Verify review text and rating    9    Very good
    Delete review for first movie on page
    Sleep    1s
    Verify no reviews exist in My Reviews

Moderator can access, edit and delete users reviews
    [Documentation]    Verifies that moderator can access, edit and delete reviews of regular users
    [Tags]    Review
    Add user to test database    Moderator User     moderator@gmail.com    moderatorpw    moderator    ${False}
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Create a review for first movie on page    1 Star     This movie is !¤#$¤#%!&#¤%#!
    Logout user

    Fill form and login    moderator@gmail.com    moderatorpw
    Navigate to users
    Access users reviews    ${EMAIL}
    Verify one review exists in My Reviews
    Verify review text and rating    1    This movie is !¤#$¤#%!&#¤%#!

    Edit review for first movie on page    1 Star    This movie is terrible!
    Sleep    1s
    Verify one review exists in My Reviews
    Verify review text and rating    1    This movie is terrible!

    Delete review for first movie on page
    Sleep    1s
    Verify no reviews exist in My Reviews

Admin can access, edit and delete users reviews
    [Documentation]    Verifies that admin can access, edit and delete reviews of regular users
    [Tags]    Review
    Add user to test database    Admin User     admin@gmail.com    adminpw    admin    ${False}
    Navigate to login page
    Fill form and login    ${EMAIL}    ${PASSWORD}
    Verify logged in
    Create a review for first movie on page    1 Star     This movie is !¤#$¤#%!&#¤%#!
    Logout user

    Fill form and login    admin@gmail.com    adminpw
    Navigate to users
    Access users reviews    ${EMAIL}
    Verify one review exists in My Reviews
    Verify review text and rating    1    This movie is !¤#$¤#%!&#¤%#!

    Edit review for first movie on page    1 Star    This movie is terrible!
    Sleep    1s
    Verify one review exists in My Reviews
    Verify review text and rating    1    This movie is terrible!
    
    Delete review for first movie on page
    Sleep    1s
    Verify no reviews exist in My Reviews