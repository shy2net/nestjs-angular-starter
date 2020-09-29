#!/bin/bash

# Install all of the dependencies, including the development and productin
function install_deps() {
    # Install dev depdendencies but ignore postinstall script
    npm install --only=dev --ignore-scripts

    # If we are running on CI, don't run postinstall
    if [ $CI ]; then
        echo "Running CI, skipping postinstall scripts..."
        # Install prod dependencies and run postinstall script if exists
        npm install --only=prod --ignore-scripts
    else
        # Install prod dependencies and run postinstall script if exists
        npm install --only=prod
    fi
}

echo "Installing all dependencies for NodeJS & Angular..."
install_deps

# Install the angular deps
pushd angular-src
install_deps
popd
echo "Finished installing dependencies!"
