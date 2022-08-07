# Create global variables to be used later
ARG workdir=/app
ARG NODE_ENV=development

FROM node:14.20-alpine3.15 as base

# Configure environment variables
ENV NODE_ENV ${NODE_ENV}

FROM base as build

ARG workdir
ARG NODE_ENV

# Compile code in /compile directory
WORKDIR /compile

# Add bash support to alpine
# Read this guide for more info: https://www.cyberciti.biz/faq/alpine-linux-install-bash-using-apk-command/
RUN echo "NODE_ENV for build was set to: ${NODE_ENV}, starting build..." \
    && apk add --no-cache bash python2 make gcc g++

# Copy package.json and package-lock.json files for node_modules installation
# This allows caching take place
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./angular-src/package.json ./angular-src/package.json
COPY ./angular-src/package-lock.json ./angular-src/package-lock.json

# Copy the scripts directory
COPY ./scripts ./scripts

# Give permissions to all of the scripts, and install all dependencies using the script
RUN chmod +x ./scripts/* && npm run install:all

# Copy all of the required leftover-files
COPY . .

# Build web and create a distribution
RUN npm run build \
    # Copy the files required to run to the workdir
    && mkdir ${workdir} && cp -Rf ./dist ${workdir} \
    # Before we copy node modules, remove all dev modules
    && npm prune --production \
    && cd ./angular-src && npm prune --production && cd ../ \
    # Copy required node modules
    && cp -Rf ./node_modules ${workdir} \
    && cp -Rf ./angular-src/node_modules/* ${workdir}/node_modules/ \
    && cp ./package.json ${workdir} \
    # Remove source files, and delete bash
    && rm -Rf /compile \
    && apk del bash --purge

# Create clean image for distribution
FROM base

# Change the work dir to the directory we are actually running the code
WORKDIR /app

# Copy distribution files
COPY --from=build /app .

# Expose the port required for web (http and https)
EXPOSE 80 443 3000

# Give the node user permissions to access the /app
RUN chown -R node /app
USER node

# Start the built distribution
CMD [ "npm", "start" ]
