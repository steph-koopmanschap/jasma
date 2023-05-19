#!/bin/bash

# Allow to run command everytime the server gets restarted
# We could expand upon this using STAGE?

echo "Prepare database migrations"
python manage.py makemigrations

echo "Apply database migrations"
python manage.py migrate

echo "Starting server"
python manage.py runserver
