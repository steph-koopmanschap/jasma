#! /bin/bash

# This script sets up the app. Installs all node modules and creates a database

echo "Setting up the app..."

echo "Installing dependecies..."
sudo apt update
sudo apt install nodejs npm redis-server postgresql nginx

echo "Prepare firewall..."
sudo ufw allow 80/tcp #HTTP
sudo ufw allow 443/tcp #HTTPS
sudo ufw allow 5000/tcp #EXPRESSJS
sudo ufw allow 3000/tcp #NEXTJS
sudo ufw allow 22/tcp #SSH
sudo ufw enable
sudo ufw reload
sudo ufw status

echo "Prepare nginx configs..."
sudo chown -R www-data: /var/www/jasma
sudo cp /jasma.conf /etc/nginx/sites-available/jasma.conf #For Debian/Ubuntu systems
sudo cp /jasma.conf /etc/nginx/conf.d/jasma.conf #For RedHat/CentOS systems
sudo ln -s /etc/nginx/sites-available/jasma.conf /etc/nginx/sites-enabled/jasma.conf 
sudo systemctl restart nginx

echo "Prepare .env files..."
sudo cp /next/.env.example /next/.env.production
sudo cp /express/.env.example /express/.env

echo "Install node modules..."
sudo npm run installAll

echo "Build NextJS..."
cd next
sudo npm run build

# Remove NextJS telemetry data collection
npx next telemetry disable
cd ..

#--DEPRECATED--
# Set file permissions 
#chmod u+x init_db.sh
#chmod u+x install-node-modules.sh
# Install modules
#./install-node-modules.sh
# Create database
#./server/db/init_db.sh
#--DEPRECATED--

echo "Set up complete."
echo "View DOCS.md for documentation and more technical info."
