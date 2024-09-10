# Django and React Authentication with JWT and HTTP-Only Cookies

This project implements a user authentication system using Django and React. It includes user registration, login, logout, and fetching user data. Authentication is handled using JWT (JSON Web Tokens) and HTTP-only cookies for improved security.

The project consists of two directories: 

- `lunch-vote-frontend`: Contains the React application
- `lunchvote`: Contains the Django backend

## Installation

To run this project on your local machine, follow the steps below:

### Prerequisites

Ensure you have the following installed on your local machine:

- Python 3.8 or higher
- Node.js v14.15.0 or higher
- npm 6.14.9 or higher

### Setup

1. Clone the repository:
    ```
    git clone 
    ```
2. Change into the directory:
    ```
    cd challenge
    ```

### Server

1. Navigate to the `server` directory:
    ```
    cd server
    ```
2. Install Django and other dependencies:
    ```
    pip install -r requirements.txt
    ```
3. Run the server:
    ```
    python manage.py runserver
    ```

### Client

1. Navigate to the `client` directory:
    ```
    cd ../client
    ```
2. Install all the dependencies:
    ```
    npm install
    ```
3. Run the client:
    ```
    npm start
    ```

Now, your application should be running at `localhost:3000`.

Note:
- The Django server should be running at the same time as the React application for the system to function properly.
- The application uses the email field instead of the username field for user identification.


## Task
Implement an API to vote which restaurant to go to for lunch.
Imagine that this API is usable by the frontend and you could create a UI on it.
Basic requirements:
1. Anyone can add, remove and edit a restaurant.
2. Each user has a maximum number of votes available per day (hard-coded, but
“configurable”). The first vote on the same restaurant is worth 1, the second 1/2 and from
the third onwards 1/4.
3. If the votes of a restaurant are identical then the winner is the restaurant with the most
votes from different users.
4. Show the history of the winners of the past days.
5. The number of votes available to a user is reset every day. The votes used in the previous
day no longer count for anything.
6. Don’t forget that frontend developers need to show users which restaurants can vote in
and which restaurant is the winner.
7. README on how to use the API, launch the project, architectural choices, etc.
Use Python, Django and a Docker container. Write tests to properly test the functionalities of the
API.

Commit your code to your personal git and share the link.


------------------------------Notes---------------------------------------

LunchVote
LunchVote is an application designed to facilitate restaurant voting for lunch decisions. Users can vote on various restaurants each day, manage their votes, and view historical winners. The system is built with Django for the backend and React for the frontend, utilizing JWT authentication with HTTP-only cookies for secure user management.

Motivation
To create a voting system using Django and React with JWT authentication and HTTP-only cookies for improved security.

Data Models

Restaurant: Represents each restaurant with attributes such as name and address.
Vote: Records user votes with timestamps and vote counts.
WinnerHistory: Tracks the daily winners based on total votes and distinct voters.
User: Manages user authentication and details.
Entity Relationship Diagram


Core Technologies

Django: Web framework for building the backend API.
React: Frontend library for building user interfaces.
Djangorestframework-simplejwt: JWT authentication library for Django.
Postgres: Open-source object-relational database.
Docker: Tool to package and run the application in an isolated environment.
Docker Compose: Tool for defining and running multi-container Docker applications.
pytest: Framework for testing the application.
precommit-hook, pylint, black, ruff, poetry, venv: Tools for code quality and environment management.


Implemented Functionalities
-JWT Authentication
-Password Hashing
-User Registration and Login Endpoints
-CRUD operations for restaurants
-Voting system with weighted votes
-Historical winner tracking
-Pagination for API responses
-Daily vote reset
-Separate database and environment for testing




Frontend and Backend Interaction: Ensure that both the Django backend and React frontend are running simultaneously for the application to function properly.
JWT Authentication: The frontend handles authentication via JWT stored in HTTP-only cookies for security.
Architectural Choices
1. Authentication
JWT Authentication: Utilizes djangorestframework-simplejwt for handling user authentication via JWT. This method ensures stateless and secure authentication.
2. Models
Restaurant: Represents each restaurant with attributes such as name and address.
Vote: Records user votes with timestamps and vote counts.
WinnerHistory: Tracks the daily winners based on total votes and distinct voters.
3. Voting Logic
Daily Vote Reset: Users' votes are reset daily to ensure fairness.
Vote Weighting: Different weights are assigned to votes based on the number of votes cast for a restaurant.
Winner Determination: The winning restaurant is decided based on the highest number of votes, with ties broken by the number of distinct voters.

LunchVote API Documentation

------------------------------Endpoints------------------------------------

Restaurant
Routes	           Method	    Endpoint	          Access
/restaurants	    GET	         /all	               All
/restaurants	    GET	         /my	               Owner
/restaurants	    GET	         /{restaurant_id}	   All
/restaurants	    DELETE	     /{restaurant_id}	   Superuser, Owner
/restaurants	    PUT	         /{restaurant_id}	   Superuser, Owner
/restaurants	    POST		                       Superuser, Active User
/restaurants/vote/	POST	                           Authenticated Users

Users


Routes	Method	Endpoint	Access
/users	GET	    /profile	Authenticated User
/users	GET	    /{user_id}	Superuser
/users	POST	/register	All
/users	POST	/login	    All


Vote History

Routes	                         Method    Endpoint	      Access
/history	                      GET	      /all     	    All
/history/{history_id}	          GET	 /{history_id}	    All
/history/todays_winner	          GET	/todays_winner	    All
/history/historical_winners	      GET	/historical_winners	All


Auth

Routes	Method	Endpoint	Access
/auth	POST	/login	     All
/auth	POST	/register	 All