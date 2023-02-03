#! /bin/bash

# This script sets up the app. Installs all node modules and creates a database

# NOTE: 
# https://github.com/imthenachoman/How-To-Secure-A-Linux-Server

echo "Setting up the app..."

echo "Installing dependecies..."
sudo apt update
#JASMA App Specific installs
sudo apt install nodejs npm redis-server postgresql 
#Jasma production server install. NTP is time management.
sudo apt install nginx ntp
#Create backup of NTP default config file.
sudo cp --archive /etc/ntp.conf /etc/ntp.conf-COPY-$(date +"%Y%m%d%H%M%S")
#Change NTP config file to remove bad or unresponsive time servers.
sudo sed -i -r -e "s/^((server|pool).*)/# \1         # commented by $(whoami) on $(date +"%Y-%m-%d @ %H:%M:%S")/" /etc/ntp.conf
echo -e "\npool pool.ntp.org iburst         # added by $(whoami) on $(date +"%Y-%m-%d @ %H:%M:%S")" | sudo tee -a /etc/ntp.conf
#Reload NTP config file
sudo service ntp restart
sudo systemctl status ntp
sudo ntpq -p

echo "Prepare firewall..."
sudo ufw limit in ssh comment 'allow SSH connections in'
sudo ufw allow out 53 comment 'allow DNS calls out'
sudo ufw allow out 123 comment 'allow NTP out'
#sudo ufw allow 22/tcp #SSH
sudo ufw allow 80/tcp #HTTP
sudo ufw allow 443/tcp #HTTPS
sudo ufw allow 5000/tcp #EXPRESSJS
# sudo ufw allow 3000/tcp #NEXTJS
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
sudo cp next/.env.example next/.env.production
sudo cp express/.env.example express/.env

echo "Installing node modules..."
sudo npm run installAll

echo "Build NextJS..."
cd next
sudo npm run build

echo "Disabling NextJS telemetry data collection"
npx next telemetry disable
cd ..

echo "Changing PSQL postgres root user password to 'example' (change this manually later)"
echo "The postgres root user password needs to be same as in /express/.env"
echo "Use the following command to change the password: "
#echo "sudo -u postgres psql --echo-queries -c \"ALTER ROLE postgres WITH LOGIN PASSWORD 'example';\""
sudo -u postgres psql --echo-queries -c "ALTER ROLE postgres WITH LOGIN PASSWORD 'example';"

echo "Creating the database..."
sudo npm run db:init
sudo npm db:resetTables

echo "Current listening ports:"
sudo ss -lntup

echo "Set up complete."
echo "View DOCS.md for documentation and more technical info."
echo "Please check the /express/.env and /next/.env.production files for the correct environment variables."

#--DEPRECATED--
# Set file permissions 
#chmod u+x init_db.sh
#chmod u+x install-node-modules.sh
# Install modules
#./install-node-modules.sh
# Create database
#./server/db/init_db.sh
#--DEPRECATED--