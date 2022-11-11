#! /bin/bash

# This script creates the JASMA database, including tables.

echo "Opening PostGreSQL... Initializing database..."
psql -U postgres --echo-queries --file='./init_db.sql'
echo "Database initilization done."