# This is a Vagrantfile used for testing.

Vagrant.configure("2") do |config|
	config.vm.box = "ubuntu/jammy64"

	config.vm.define("client") do |client|

		client.vm.provider "virtualbox" do |v|
			v.name = "Test Client"
			v.memory = 1024
			v.cpus = 1
		end

		client.vm.network "private_network", ip: "192.168.56.126", hostname: true
		# Node.js debugging - does not work though https://github.com/nodejs/node/issues/11591
		client.vm.network( "forwarded_port", guest: 9229, host: 9229 )

		client.vm.provision :shell, path: "vagrant/provision/client.sh"
	end

	config.vm.define("server") do |server|

		server.vm.provider "virtualbox" do |v|
			v.name = "Test Server"
			v.memory = 1024
			v.cpus = 1
		end

		server.vm.provision :shell, path: "vagrant/provision/provision.sh"

		server.vm.network "private_network", ip: "192.168.56.125", hostname: true

		server.vm.hostname = "testserver.local"
	end

	# See https://stackoverflow.com/a/54481502 and https://terryl.in/en/vagrant-up-hangs/#:~:text=up%20going%20on.-,Bug%20for%20bionic64,-If%20you%20are
    config.vm.provider "virtualbox" do |vb|
        vb.customize ["modifyvm", :id, "--cableconnected1", "on"]

		vb.customize ["modifyvm", :id, "--uart1", "0x3F8", "4"]
		vb.customize ["modifyvm", :id, "--uartmode1", "file", File::NULL]
    end

end
