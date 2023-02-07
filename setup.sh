#! /bin/bash

echo "This script sets up the app. Installs all node modules and creates a database"
echo "This script assumes your current working directory is jasma-main"
echo "Current working directory:"
pwd

# NOTE: 
# https://github.com/imthenachoman/How-To-Secure-A-Linux-Server

echo "Setting up the app..."

echo "Installing dependecies..."
sudo apt update
#JASMA App Specific installs
sudo apt install nodejs npm redis-server postgresql  
#Jasma production server install. NTP is time management.
sudo apt install nginx ntp ufw openssl
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
#ufw allow "Nginx Full" 
sudo ufw allow 5000/tcp #JASMA-API
# sudo ufw allow 3000/tcp #JASMA-NEXTJS
sudo ufw allow 4000/tcp #JASMA-MEDIA-SERVER
sudo ufw allow 4000/udp #JASMA-MEDIA-SERVER
sudo ufw enable
sudo ufw reload
sudo ufw status

echo "Disabling Apache Server..."
sudo systemctl stop apache2
sudo systemctl disable apache2

echo "Creating self signed SSL Certificate..."
openssl req -x509 -newkey rsa:4096 -keyout jasma-ssl-key.key -out jasma-ssl-cert.crt -days 7
echo "SSL Certification done."

echo "Prepare nginx configs..."
sudo rm /etc/nginx/sites-enabled/default #Remove default conifg
sudo mkdir /var/ww/jasma
sudo chown -R www-data: /var/www/jasma
sudo mkdir /etc/nginx/ssl
sudo mv ./jasma-ssl-cert.crt /etc/nginx/ssl/jasma-ssl-cert.crt
sudo mv ./jasma-ssl-key.key /etc/nginx/ssl/jasma-ssl-key.key
sudo cp ./jasmaHTTPS.conf /etc/nginx/sites-available/jasma.conf #For Debian/Ubuntu systems. Copy jasma confHTTPS to nginx dir.
sudo cp ./jasmaHTTPS.conf /etc/nginx/conf.d/jasma.conf #For RedHat/CentOS systems
#sudo cp ./jasma.conf /etc/nginx/sites-available/jasma.conf #For Debian/Ubuntu systems. Copy jasma conf to nginx dir.
#sudo cp ./jasma.conf /etc/nginx/conf.d/jasma.conf #For RedHat/CentOS systems
sudo ln -s /etc/nginx/sites-available/jasma.conf /etc/nginx/sites-enabled/jasma.conf #Enable Jasma config.
sudo systemctl restart nginx

echo "Prepare .env files..."
cp next/.env.example next/.env.production
cp express/.env.example express/.env

echo "Installing node modules..."
sudo chown -R 1000:1000 "/root/.npm" #Allow permissions for NPM
sudo npm install pm2 -g #PM2 is a production build NodeJS process manager. Which runs node as a deamon.
npm run installAll

echo "Build NextJS..."
cd next
npm run build

echo "Disabling NextJS telemetry data collection"
npx next telemetry disable
cd ..

echo "Changing PSQL postgres root user password to 'example' (change this manually later)"
sudo -u postgres psql --echo-queries -c "ALTER ROLE postgres WITH LOGIN PASSWORD 'example';"

echo "Creating the database..."
npm run db:init
npm run db:resetTables

echo "Current listening ports:"
sudo ss -lntup

sudo systemctl status postgresql
sudo systemctl status redis-server
sudo systemctl status nginx

echo "------------"
echo "Set up complete."
echo "------------"
echo "View DOCS.md for documentation and more technical info."
echo "Please check the following files and configure the domain name or ip address and port correctly in these files:"
echo "/express/.env"
echo "/next/.env.production"
echo "/etc/nginx/sites-available/jasma.conf (run the command: \"sudo systemctl restart nginx\" after changing this file.)"
echo "------------"
echo "The current password of the PostGreSQL (PSQL) root user 'postgres' is 'example'. " 
echo "The postgres root user password needs to be same as in /express/.env file."
echo "Use the following command to change the password: (change 'example' to something else)"
echo "sudo -u postgres psql --echo-queries -c \"ALTER ROLE postgres WITH LOGIN PASSWORD 'example';\""
echo "------------"
echo "The self signed SSL certificate is not valid for production and expires in 7 days."
echo "Replace the following files with a valid SSL Certificate:"
echo "/etc/nginx/ssl/jasma-ssl-cert.crt"
echo "/etc/nginx/ssl/jasma-ssl-key.key"
echo "------------"
echo When everything is configured you can start the production server with the following command:
echo npm run start:pm2
echo or
echo npm run start