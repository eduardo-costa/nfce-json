# NFCe to Json

# Consts

LinuxStdBase = trusty
AppName		 = nfce-json
AppLocal	 = /$(AppName)

# Root folder for NGINX, Mongo and Node sources and configs
DeployRoot  = /usr/local/var/$(AppLocal)

# Tools and servers folders
MongoDBRoot = $(DeployRoot)/mongodb
MongoDBLog  = $(MongoDBRoot)/log
ServerRoot  = $(DeployRoot)/server
ServerLog   = $(ServerRoot)/log

# Local folders where sources and files resides
LocalRoot   		= ./deploy

LocalServerConfig = $(LocalRoot)/config
LocalServerData	  = $(LocalRoot)/server
LocalClientData   = $(LocalRoot)/client

repo:
	
all: 	

clean:	
	# Stop everything
	make -i stop	
	
destroy:	
	
stop:	
	# Stop node servers
	sudo forever stop nfce-json
	
install:
	
	# Updates OS repositories listings
	sudo apt-get update
	
	# Install all goodies
	make -i install-node
	make -i install-mongo
		
	# Runs mongodb daemon with custom config files
	make -i run-mongo
	
	# Run nodejs daemons
	make -i run-node
	
install-mongo:
	# Load MongoDB package lists
	sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10	
	echo "deb http://repo.mongodb.org/apt/ubuntu "$(LinuxStdBase)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
	
	# Updates apt-get 
	sudo apt-get update
		
	# Installs mongo
	sudo apt-get install -y mongodb-org
	
install-node:	
	# Install nodejs
	sudo apt-get install -y nodejs
	
	# Alias for calling nodejs as 'node'
	sudo ln -s -f /usr/bin/nodejs /usr/bin/node
	
	# Install NPM
	sudo apt-get install -y npm
	
	# Install 'forever' package
	sudo npm install forever -g
	
	# Install required NPM packages
	sudo npm install
	
run-mongo:	
	# Copies configuration files 
	sudo cp -r $(LocalServerConfig)/mongodb/ $(DeployRoot)
		
	# Starts mongodb with new config file
	sudo mongod --config $(MongoDBRoot)/mongod.conf

run-node:
	sudo forever stop editor	
	sudo forever start -a -l $(ServerLog)/log.log -e $(ServerLog)/err.log -o $(ServerLog)/out.log --workingDir $(LocalServerData) --uid "editor" $(LocalServerData)/app.js -vvvv

update-server:
	# Updates from versioning
	make -i repo
	
	# Installs/Update npm packages if needed
	sudo npm install
	
	# Restart daemons
	make -i run-node
	
update:
	# Updates from versioning
	make -i repo
	
	# Installs/Update npm packages
	sudo npm install
	
	# Restart nodejs daemons
	make -i run-node
	
	
	
	
