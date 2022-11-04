#! /bin/bash

# This script automatically install all node_modules in every folder of the project where it is needed.
echo "Installing node_modules with NPM..."
npm install
npm audit
# cd server
# npm install
# npm audit
# cd ..
# cd client
# npm install
# npm audit
# cd ..
echo "Done. node_modules are installed."
echo "You can now use 'npm start' to start up the project"
