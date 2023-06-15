# Directory Structure Documentation For JASMA

## Table of Contents

### /frontend

The frontend client. (NextJS)

### /frontend/app
All kinds of app-wide matters, both in the technical sense (e.g., context providers) and in the business sense (e.g., analytics).
this directory contains app segment files

### /frontend/pages
Contains complete Application pages files

### /frontend/shared
Contains react components, utilities, and other code that can be shared troughout the app.

### /frontend/widgets
Contains Independent and self-contained blocks (React components) for pages.

### /frontend/features
Processing of user scenarios => ```Actions that a user can make in the application to interact with the business entities to achieve a valuable outcome.```

### /frontend/entities
Contains business entities that domain logic operates 

### /frontend/public
Contains static assets to be served

### /backend

The backend server. (Django)

### /backend/django_server

Config files for the django server.

### /backend/api

All the files for JASMA main API server.

### /backend/api/constants

Constants for the backend.

### /backend/api/management/commands

Custom commands to use with the Django server.

### /backend/api/migrations

Changes applied to the PostGreSQL database.
The Postgres tables are defined in the models folder.

### /backend/api/tests

Tests for the Django API server.

### /backend/api/urls

The routes or URLS of the API endpoints are defined here. (Might be changed in the future to urls.py)

### /backend/api/views

All the view functions. The actual logic and proccesing of the API endpoints are defined here.

### /backend/media

All the user uploaded media files are stored here. Including images, videos, audios, and profile avatar pics.

### /docs

Files for documentation about the app.

### /testing 

Files use for testing the app.

### /testing/tests

Individual tests.

### /testing/utils

Utilities and shared code for tests.

### /testing/test_data

Dummy test data for tests.

### /archive

Old deprecated code of JASMA that is archived here for future reference.
Do not expect this code to work.

### /nginx

HTTP and HTTPS Config files for the NGINX webserver.

### /monitor

An individual app for monitoring JASMA. (Not done yet).

### /.env

All the .env files (environment variables) are stored here. <br/>
Each app has its own folder for its .env files.

### /.vscode

Config files for Visual Studio Code

### /.github

Github repo config files and github workflows.

### /compose

Config files for Docker. Dockerfile for each app is stored here. <br/>
Each app as its own folder for its docker config files.
