FROM node:16

## refer: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

## Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon:
EXPOSE 8080
## node serve.js
CMD [ "node", "server.js" ]

### build with
## docker build . -t mohanchinnappan/node-web-app

### Run with
# -d runs the container in detached mode, leaving the container running in the background. 
# The -p flag redirects a public port to a private port (8080) inside the container.
## docker run -p 49160:8080 -d mohanchinnappan/node-web-app

### Push to docker hub
# docker push mohanchinnappan/node-web-app

