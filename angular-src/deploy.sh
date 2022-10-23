#!/bin/bash

# Build the docker image
docker-compose build web

# Stop the running container, if failed continue
docker-compose stop web || true

# Get the tag
version=${node ./scripts/get-version.js}

# Now tag the existing image
docker tag app:latest $version

# Now run the new container
docker-compose up -d web