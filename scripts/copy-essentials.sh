#!/bin/bash

check_errcode() {
    status=$?

    if [ $status -ne 0 ]; then
        echo "${1}"
        exit $status
    fi
}

# This script copies required essential files before running

echo "Copying configuration files..."
rm -rf ./dist/src/config
check_errcode "Failed to delete config files!"
mkdir -p ./dist/src/config
check_errcode "Failed to create configuration directory at dist!"
cp -Rf ./src/config/* ./dist/src/config
check_errcode "Failed to copy configuration files!"
echo "Configuration files succesfully copied!"
