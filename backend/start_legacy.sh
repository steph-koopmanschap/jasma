#!/bin/bash

venv_folder = "./venv"

cd backend

echo "Copying environment variables..."
rm .env
cat ../.env/.local/.django/.env >> .env  
cat ../.env/.local/.django/.secrets.env >> .env
cat ../.env/.local/.postgres/.env >> .env

if [ ! -d "$venv_folder" ]; then
    echo "No python virtual env detected."
    echo "Creating python virtual venv..."
    python3 -m venv venv
fi

echo "Starting python venv"
source venv/bin/activate
echo "Installing requirements..."
cd ../compose/local/django/
pip install -r requirements.txt

echo "Making migrations..."
cd ../../../backend

python manage.py makemigrations
python manage.py migrate
echo "DONE."
#echo "Starting Django server..."
#python manage.py runserver
