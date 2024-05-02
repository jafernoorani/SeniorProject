"""
Run this to install an Apache web server
configured as a reverse proxy for nodejs
"""

# update packages
sudo apt update

# install apache, enable and check status
sudo apt install -y apache2
sudo systemctl enable apache2
sudo systemctl status apache2

# Configure reverse proxy
# Enable proxy mods
sudo a2enmod proxy proxy_http
cat proxy_conf.txt > /etc/apache2/sites-available/000-default.conf
# Restart apache
sudo systemctl restart apache2

# Install Nodejs and npm
sudo apt install -y nodejs npm
# Ensure latest npm is installed
npm install -y v20.6.0
sudo n latest
hash -r
node --version
# Install node packages
npm install mysql express bcrypt
