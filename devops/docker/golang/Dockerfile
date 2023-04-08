FROM golang:1.16-alpine

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
# https://docs.docker.com/engine/reference/builder/#copy
COPY *.go ./

# Build
RUN go build -o /docker-gs-ping

# This is for documentation purposes only.
# To actually open the port, runtime parameters
# must be supplied to the docker command.
EXPOSE 8090

# (Optional) environment variable that our dockerised
# application can make use of. The value of environment
# variables can also be set via parameters supplied
# to the docker command on the command line.
#ENV HTTP_PORT=8081

# Run
CMD [ "/docker-gs-ping" ]



### build with
## docker build . -t mohanchinnappan/golang-web-app

### Run with
# -d runs the container in detached mode, leaving the container running in the background. 
# The -p flag redirects a public port to a private port (8090) inside the container.
## docker run -p 2000:8090 -d mohanchinnappan/golang-web-app

### Push to docker hub
# docker push mohanchinnappan/golang-web-app



