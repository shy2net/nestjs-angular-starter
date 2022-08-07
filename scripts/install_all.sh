#!/bin/bash

function install_deps() {
    npm ci --include=dev
}

echo "Installing all dependencies for NodeJS & Angular..."
install_deps

# Install the angular deps
pushd angular-src
install_deps
popd
echo "Finished installing dependencies!"
