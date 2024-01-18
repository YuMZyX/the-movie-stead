# Instructions
Instructions on how to use The Movie Stead application.

## Visitor
When visiting the site for the first time, user will be taken to 'Trending movies' page which is also the home page of the application. Visitor has four possible options in the top navigation bar from left to right:
* The Movie Stead logo, which will take user to home page
* Movies menu button, which has options for 'Trending movies' (home page) and 'Discover movies'
  * Trending movies shows 20 pages of currently trending movies and a possibility to search movies by title and release year
  * Discover movies shows 20 TMDB top rated movies at first, but when user specifies a search criteria the movies are updated to match the search. User can search movies by genre, min release date, max release date, min runtime and max runtime. Results can be sorted by movie title, by TMDB rating, by release date or by popularity. User can also filter the page results with search string.
* Stars button which will lead to 'Trending stars' page showing 20 pages of currently trending persons of the movies industry and a possibility to search for stars by name
* Account menu icon which has links to 'Login' and 'Sign Up' pages

For those using the application with a mobile or tablet device the movies and stars links are under a hamburger menu in the navigation bar.

#### Trending movies and Discover movies
* Each movie has a 'more' icon button in the top right corner which opens a menu. For visitors the menu only contains a notice and a link to login for accessing more features.
* Each movie can be clicked to access a detailed page of the specific movie with information like release date, genres, runtime and overview. If a registered user has reviewed the movie visitor can also see the movies rating average (blue star icon) and 3 latest reviews.
* When using the search at trending movies page the search field is mandatory and release year is voluntary. After clicking 'Search' user will be taken to a new page with search results.
* When using the advanced search at discover movies page the search results are shown at the same page as soon as user uses any of the search options.

#### Stars
* Each star can be clicked to access a detailed page of the specific person with information like age, place of birth, famous movies and biography.
* When using the search at trending stars page the search results are shown at the same page after the search string is debounced.

#### Sign Up
* To access more features visitor can sign up by filling the sign up form. Each field is required and the form will assist in entering a valid value for each field.
* After clicking the 'SIGN UP' button with valid values the user will automatically be logged in and taken to the home page.
* Currently the email address does not require verification and recovering forgotten password requires contacting admin.

#### Login
* Once a user has registered he/she can always login to his account by entering email address and password to the login form and signing in.

## Registered user
Registered user can access all the features that visitor can plus more.  

In addition to the options that visitor has in navigation bar (or hamburger menu if using mobile or tablet), registered user has two more options:
* Watchlist button which will take user to a page showing his/her watchlist.
* My Reviews button which will take user to a page showing movies that he/she has reviewed.

The account menu icon now contains link to 'My account' page and a button to log out instead of 'Login' and 'Sign Up' links.

#### Trending movies and Discover movies
* Movie menu opened from the 'more' icon button now contains buttons 'Add to Watchlist' and 'Create a review' for each movie. If movie is already added to watchlist and reviewed the menu contains 'Remove from Watchlist' and 'Edit review' buttons instead.
* Detailed page of a specific movie now also contains icon buttons for adding/removing from watchlist and creating/editing review. If you have reviewed the specific movie, your rating is shown in a yellow star icon that can be clicked to edit your review.

#### Watchlist
* Shows all the movies that user has added to his/her watchlist with a possibility to filter the watchlist with a search string and to sort the watchlist by date added and movie title.
* Each movie can be clicked to access detailed page of the specific movie and each movie has the 'more' icon for adding/removing from watchlist and creating/editing review.

#### My Reviews
* Shows all the movies that user has reviewed with a possibility to filter the list with a search string and to sort the reviews by date added, your rating and movie title.
* Each movie can be clicked to access detailed page of the specific movie and each movie has the 'more' icon for adding/removing from watchlist and creating/editing review.
* Each movie has a star icon showing your rating. The star icon can be clicked to edit your review for the movie.

#### Creating/editing/deleting movie review
* Clicking create/edit review from 'more' icon menu or from movies detailed page opens up a dialog with a form.
  * When creating review the form is empty and has a mandatory 'your rating' field to pick rating from 1 to 10 and a voluntary text field for writing a review. After rating has been given user can click 'CREATE REVIEW' to submit the review.
  * When editing review the form is already filled with your previous rating and review text and they can be modified. After editing the review user can submit the edited review by clicking 'EDIT REVIEW'.
  * To delete a review user must first click 'Edit review' from 'more' icon menu or from movies detailed page and then click 'REMOVE REVIEW' and confirm the popup dialog.
 
#### My account
* User can access his/her 'My Account' page from the account menu in the top right corner.
* 'My Account' page shows information about the user like date joined, email, date joined and the number of movies in watchlist and moviews reviewed with links to watchlist and my reviews pages.

#### Logout
* User can log out anytime by clicking the 'Logout' button in the account menu. When logging out the current session is destroyed and user is taken to login page.

## Moderator
Moderator can access all the features that registered user can plus more.

In addition to the options that registered user has in the navigation bar, moderator has one more option:
* Users button which will take moderator to user management page.

#### User management
* User management page has a table (DataGrid) that contains all registered users. Table has columns ID, Name, Email address, Disabled?, Reviews and Actions.
* Moderator can click users name to access 'My Account' page to see the users information and link to his/her reviews.
* Moderator can directly click 'Check' link in the Reviews column to access users reviews
  * At users reviews page moderator can edit/remove reviews if they are inapproriate.
* Moderator can edit specific users disabled status by either disabling the user or by removing the disabled status. Save icon must be clicked for the changes to take place.
  * When disabled user is not able to login and the current session will be destroyed when user tries to access a feature that requires login.
* Moderator can filter the table by search string and sort by any column to find specific users.

## Admin
Admin can access all the features that moderator can plus more.

#### User management
* User management page has a table that contains all users, including moderators. The table has additional Role column.
* Admin can completely remove a user by clicking the Delete icon and confirming the dialog popup.
* Admin can promote an user to moderator by changing the users role to moderator and clicking Save icon.
* Admin can demote a moderator to user by changing the moderators role to user and clicking Save icon.


  
