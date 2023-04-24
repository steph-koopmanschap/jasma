#!/bin/bash

echo "Deleting and reseting all migrations..."
# Delete all migration files
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete

# Delete the Django migration history
rm -rf api/__pycache__
rm -rf django_server/__pycache__
rm -rf */*/__pycache__
# Delete sqlite database
rm db.sqlite3
echo "Done. Ok."

# Recreate the database
#python manage.py makemigrations
#python manage.py migrate

