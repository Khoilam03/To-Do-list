# To-Do-list
This project aims to create a to do list for the users. This project uses react, django, and rest framework.

frontend: the front end of the project. It uses react and javascript in order to show the users the list of the to do.
Within the frontend:
- src: this directory holds the components of the frontends
- - components: this contains all of the pages of the javascript
- - - Homepage.js: Home page
- - - CreateToDo.js: this is the main page to show the user the to do list
- - - Calendar.js: this is the script for the calendar

- static: this directory holds the css format for the frontend and the script for the program to run

myapp: the back end of the project. It uses django and follow the rest api, following crud format
- serializers.py: this shows what we want to hold and what the front end could get and edit from

calendarapi: this is another rest api that contains the data for the date and how many tasks are completed.

mockProject: the main, running the project

