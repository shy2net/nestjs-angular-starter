#!/bin/bash

# This script copies required essential files before running

echo "Copying configuration files..."
rm -rf ./dist/src/config
mkdir ./dist/src/config
cp -Rf ./src/config/* ./dist/src/config
echo "Configuration files succesfully copied!"
