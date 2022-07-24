#!/bin/bash

set -e

mkdir -p /var/www/wordpress
chmod a+rwx /var/www/wordpress

apt-get update
apt-get install -y apache2

# Copy the vhost config file
cp /vagrant/vagrant/config/apache/wpdevtests.local.conf /etc/apache2/sites-available/wpdevtests.local.conf

# Disable the default vhost file
a2dissite 000-default

# Enable our custom vhost file
a2ensite wpdevtests.local.conf

apt-get install -y php php-bcmath php-bz2 php-cli php-curl php-intl php-json php-mbstring php-opcache php-soap php-xml php-xsl php-zip php-gmp php-mysql libapache2-mod-php

systemctl restart apache2

DBHOST=localhost
DBNAME=wordpress
DBUSER=wp
DBPASSWD=password

apt-get -y install mariadb-server

# Create the database and grant privileges
CMD="mariadb -e"

$CMD "CREATE DATABASE IF NOT EXISTS $DBNAME"
$CMD "GRANT ALL PRIVILEGES ON $DBNAME.* TO '$DBUSER'@'%' IDENTIFIED BY '$DBPASSWD';"
$CMD "FLUSH PRIVILEGES;"

systemctl restart mariadb

# Install WP CLI
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
mv wp-cli.phar /bin/wp

# Install WordPress
cd /var/www/wordpress
wp core download --allow-root
wp config create --dbname=$DBNAME --dbuser=$DBUSER --dbpass=$DBPASSWD --dbhost=$DBHOST --allow-root
wp core install --url=wpdevtests.local --title=WPDevTests --admin_user=admin --admin_password=password --admin_email=test@wpdevtests.local --allow-root
chmod a+rwx -R /var/www/wordpress

# Let client access server through ssh
cat /vagrant/vagrant/share/id_ecdsa.pub >> /home/vagrant/.ssh/authorized_keys

# Create test folder
cd /home/vagrant
mkdir testfolder
echo 'Hello world' > testfolder/file.txt
chown -R vagrant:vagrant testfolder/
