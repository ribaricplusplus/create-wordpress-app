#!/usr/bin/env bash

apt-get -y update

# Install node for user vagrant
VAGRANT_NVM_DIR=/home/vagrant/.nvm
runuser -l vagrant -c 'wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash'
runuser -l vagrant -c "source ${VAGRANT_NVM_DIR}/nvm.sh; nvm install v16"

# Install docker and docker-compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker vagrant
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Setup SSH into server machine
ID_RSA_PATH=/home/vagrant/.ssh/id_rsa
ssh-keygen -t rsa -N '' -f "$ID_RSA_PATH" <<< $'\ny'
chown vagrant:vagrant $ID_RSA_PATH
chown vagrant:vagrant /home/vagrant/.ssh/id_rsa.pub
cp -f /home/vagrant/.ssh/id_rsa.pub /vagrant/vagrant/share

# Run wp-env start so that docker images are pulled and it doesn't take forever subsequently
runuser -l vagrant -c "source ${VAGRANT_NVM_DIR}/nvm.sh; mkdir -p initial-wp-env; cd initial-wp-env; npm i -g @wordpress/env; wp-env start; wp-env destroy"

# Get composer
apt-get -y install php-cli
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === '906a84df04cea2aa72f40b5f787e49f22d4c2f19492ac310e8cba5b96ac8b64115ac402c8cd292b8a03482574915d1a8') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
mv composer.phar /usr/local/bin/composer
chmod a+rwx /usr/local/bin/composer
