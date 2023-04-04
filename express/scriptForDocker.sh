#!/bin/bash

echo "Starting scriptForDocker.sh ..."

if [ "$START_FIRST_TIME" = true ]; then
    echo "Creating the database..."
    npm run db:init
    npm run db:resetTables
    echo "Database creation done."

    if [ "$NODE_ENV" = 'development' ]; then
        echo "Populating the database..."
        npm run db:generate 100
        echo "Database population done."
    fi
fi

echo "Starting server..."
npm run start
