# Directory Structure Documentation For JASMA

## Table of Contents

### /frontend

The frontend client. (NextJS)

### /frontend/app
All kinds of app-wide matters, both in the technical sense (e.g., context providers) and in the business sense (e.g., analytics).
this directory contains app segment files

### /frontend/pages
contains complete Application pages files

### /frontend/shared
contains reused module sand non-business specific files => ```Isolated modules, components and abstractions that are detached from the specifics of the project or business. ```

### /frontend/widgets
contains Independent and self-contained blocks for pages

### /frontend/features
Processing of user scenarios => ```Actions that a user can make in the application to interact with the business entities to achieve a valuable outcome.```

### /frontend/entities
contains : Business entities that domain logic operates 

### /frontend/public
contains static assets to be served


### /backend

The backend server. (Django)

### /docs

Files for documentation about the app.

### /testing 

Files use for testing the app.

### /archive

Old deprecated code of JASMA that is archived here for future reference.
Do not expect this code to work.

### /nginx

HTTP and HTTPS Config files for the NGINX webserver.

### /monitor

An individual app for monitoring JASMA. 

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
