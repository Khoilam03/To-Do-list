# To-Do-list
This project aims to create a to-do list for the users. This project uses React, Django, and REST framework.

frontend: the front end of the project. It uses React and JavaScript in order to show the users the list of the to-dos.
Within the frontend:
- src: this directory holds the components of the frontend.
  - components: this contains all of the pages of the JavaScript.
    - Homepage.js: Home page.
    - CreateToDo.js: this is the main page to show the user the to-do list.
    - Calendar.js: this is the script for the calendar.

- static: this directory holds the CSS format for the frontend and the script for the program to run.

myapp: the back end of the project. It uses Django and follows the REST API, following the CRUD format.
- serializers.py: this shows what we want to hold and what the frontend could get and edit from.

calendarapi: this is another REST API that contains the data for the date and how many tasks are completed.

mockProject: the main, running the project.

## How to run:
1. Run `docker-compose build`.
2. Then run `docker-compose up`.
3. Then use the port `127.0.0.1:8000/`.
4. The main page is `127.0.0.1:8000/create`.
