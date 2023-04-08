FROM ubuntu:21.04



## https://github.com/salesforcecli/sfdx-cli
ARG SALESFORCE_CLI_VER=latest

## https://github.com/forcedotcom/SFDX-Data-Move-Utility
## https://help.sfdmu.com/quick-start
ARG SF_DMU_VER=4.11.1


## https://www.npmjs.com/package/sfpowerkit
ARG SF_POWERKIT_VER=4.1.5

## https://www.npmjs.com/package/@dxatscale/sfpowerscripts
## The SFDX CLI, sfpowerkit plugin, and sfdmu are required for this plugin to work. 
ARG SF_POWERSCRIPTS_VER=10.2.15

## https://www.npmjs.com/package/sfdx-browserforce-plugin
ARG SF_BROWSERFORCE_VER=2.8.0





# Install Node.js v14.x
RUN apt-get update  
RUN DEBIAN_FRONTEND=noninteractive apt-get install -qq \
        curl \
        sudo \
        git \
        jq \
        zip \
        vim \
        nano \

        unzip \
	    make \
	    libxkbcommon-x11-0

RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - \
    && sudo apt-get install -qq nodejs


# Install OpenJDK-8
RUN apt-get update -qq && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -qq openjdk-8-jdk && \
    apt-get clean -qq && \
	rm -rf /var/cache/oracle-jdk8-installer && \
    rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME


# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*



# Set XDG environment variables explicitly so that GitHub Actions does not apply
# default paths that do not point to the plugins directory
# https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
ENV XDG_DATA_HOME=/sfdx_plugins/.local/share
ENV XDG_CONFIG_HOME=/sfdx_plugins/.config
ENV XDG_CACHE_HOME=/sfdx_plugins/.cache

# Create isolated plugins directory with rwx permission for all users
# Azure pipelines switches to a container-user which does not have access
# to the root directory where plugins are normally installed
RUN mkdir -p $XDG_DATA_HOME && \
    mkdir -p $XDG_CONFIG_HOME && \
    mkdir -p $XDG_CACHE_HOME && \
    chmod -R 777 sfdx_plugins

RUN export XDG_DATA_HOME && \
    export XDG_CONFIG_HOME && \
    export XDG_CACHE_HOME



# Install SFDX CLI
RUN npm install --global sfdx-cli@${SALESFORCE_CLI_VER}

## add group 'devops' and 'dou1'
## -r for Create a system group.

## man: https://linux.die.net/man/8/useradd
## man: https://linux.die.net/man/8/groupadd

RUN groupadd -r devops && useradd -r -ms /bin/bash -g devops douser1

# RUN useradd -ms /bin/bash devops

USER douser1


# Install sfdx plugins

RUN echo 'y' | sfdx plugins:install sfdmu@${SF_DMU_VER}

RUN echo 'y' | sfdx plugins:install sfpowerkit@${SF_POWERKIT_VER}
RUN echo 'y' | sfdx plugins:install @dxatscale/sfpowerscripts@${SF_POWERSCRIPTS_VER}

RUN echo 'y' | sfdx plugins:install sfdx-browserforce-plugin@${SF_BROWSERFORCE_VER}

## mohanc 
## RUN echo 'y' | sfdx plugins:install sfdx-mohanc-plugins

##  want the container to execute at docker run this command
CMD /bin/bash


### build with
## docker build . -t mohanchinnappan/sfdx-devops

### Run with
# -i interactive
# -t allocate a pseudo-TTY
## docker run -it mohanchinnappan/sfdx-devops /bin/bash

### Push to docker hub
# docker push mohanchinnappan/sfdx-devops


