#! /bin/bash

# This script sets up the app. Installs all node modules and creates a database

echo "Setting up the app..."

# Set file permissions
chmod u+x init_db.sh
chmod u+x install-node-modules.sh
# Remove NextJS telemetry data collection
npx next telemetry disable

# Create database
./server/db/init_db.sh
# Install modules
./install-node-modules.sh

echo "Set up complete."
