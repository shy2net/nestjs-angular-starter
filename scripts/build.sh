#!/bin/bash

check_errcode() {
    status=$?

    if [ $status -ne 0 ]; then
        echo "${1}"
        exit $status
    fi
}

echo "Checking for missing dependencies before build..."

# Check if node_modules exists, if not throw an error
if [ ! -d "./node_modules" ] || [ ! -d "./angular-src/node_modules" ]; then
    echo "node_modules are missing! running install script..."
    npm run install:all
    echo "Installed all missing dependencies! starting installation..."
else
    echo "All dependencies are installed! Ready to run build!"
fi

# This script compiles typescript and Angular 7 application and puts them into a single NodeJS project
ENV=${NODE_ENV:-production}
echo -e "\n-- Started build script for Angular & NodeJS (environment $ENV) --"
echo "Removing dist directory..."
rm -rf dist

echo "Compiling typescript..."
./node_modules/.bin/tsc -p ./tsconfig.build.json
check_errcode "Failed to compile typescript! aborting script!"

echo "Copying essential files..."
bash ./scripts/copy-essentials.sh

check_errcode "Failed to copy essential files! aborting script!"

echo "Starting to configure Angular app..."
pushd angular-src

echo "Building Angular app for $ENV..."
./node_modules/.bin/ng build --aot --prod --configuration $ENV
check_errcode "Failed to build angular! stopping script!"

# TODO: Remove this 'if' statment until the 'fi' if you don't want SSR at all
if [ $ENV == "production" ]; then
    echo "Building Angular app for SSR..."
    ./node_modules/.bin/ng run angular-src:server:production
    check_errcode "Failed to build Angular app for SSR! aborting script!"
else
    echo "Skipping build for SSR as environment is NOT production"
fi

echo "Copying angular dist into dist directory..."
mkdir ../dist/angular
cp -Rf dist/* ../dist/angular
check_errcode "Failed to copy anuglar dist files! aborting script!"

echo "Removing angular-src dist directory..."
rm -rf dist

# Go back to the current directory
popd

echo "-- Finished building Angular & NodeJS, check dist directory --"
