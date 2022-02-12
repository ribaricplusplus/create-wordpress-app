#!/usr/bin/env bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
cd /vagrant
if ! command -v node > /dev/null; then nvm install v16; fi
node ${CWAPP_NODE_ARGUMENTS} ./node_modules/.bin/jest ${CWAPP_JEST_ARGUMENTS}
