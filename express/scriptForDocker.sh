#!/bin/bash

if [ "$START_FIRST_TIME" = true ]; then
    npm run db:init
    npm run db:resetTables

    if [ "$NODE_ENV" = 'development' ]; then
        npm run db:generate 100
    fi
fi

npm run start
