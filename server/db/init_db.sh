#! /bin/bash

# This script creates the JASMA database, including tables.

echo "Opening PostGreSQL... Initializing database..."
psql -U postgres --echo-queries --file='./db/create_db.sql'
echo "Create database tables..."
psql postgresql://jasma_admin:a@localhost:5432/jasma_db?sslmode=require --echo-queries --file='./db/create_tables.sql'
echo "Database initilization done."
