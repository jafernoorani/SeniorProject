"""
Run this script to install a MariaDB database
"""

# Update system packages
sudo apt update
# Install mariadb
sudo apt install -y mariadb-server
# Enable mariadb
systemctl status enable mariadb.service

# Mariadb secure installation
printf "\n n\n n\n y\n y\n y\n y\n" | sudo mysql_secure_installation

# Configure Mariadb to listen on all ports
cat db_port_conf.txt > /etc/mysql/mariadb.cnf
cat db_bind_addr_conf.txt > /etc/mysql/mariadb.conf.d/50-server.cnf

# Apply configuration changes
systemctl restart mariadb
