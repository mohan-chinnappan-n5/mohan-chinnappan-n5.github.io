#!/bin/bash

#---------------------------------
# file name:  prs-to-pkg-vscode.sh
# author: mohan chinnappan
#---------------------------------

#-----------------------#
# Salesforce package.xml creator
# This is command line version of vscode extension
# . https://marketplace.visualstudio.com/items?itemName=mohanc5.mcghutils
# make sure to install this vscode extension before installing this script


#-----------------------#
# INSTALL:
# Store this into /usr/local/bin (say prs-to-pkg-vscode.sh)
# make it into executable
# chmod +x  prs-to-pkg-vscode.sh 
#-----------------------#

#-----------------------#
# USAGE:
# go to the git folder and do git checkout (example: git checkout develop)
# run this command: (pr_numbers is comma separated list of PRS: example, 1344,1356)
#  prs-to-pkg-vscode.sh pr_numbers (example: prs-to-pkg-vscode.sh 1344,1356 )
#-----------------------#


# ANSI color codes for formatting output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}--- PRs to Package.xml tool ---${NC}" >&2

# Define paths and constants
SCRIPTS=~/.vscode/extensions/mohanc5.mcghutils-0.0.31/scripts
API_VER=60.0

# Extract PR details and save to a CSV file
echo -e "${YELLOW}Extracting PR information...${NC}"
python ${SCRIPTS}/pr_info.py -p "$1" > /tmp/diff.csv 

# Display relevant columns from the CSV file (fields: 6, 8, 2, 7)
echo -e "${GREEN}Relevant PR changes:${NC}"
cut -f6,8,2,7 -d',' /tmp/diff.csv  

echo -e "${CYAN}--- Package Generation ---${NC}" >&2

# Generate package.xml for added, modified, and renamed components
echo -e "${YELLOW}Generating package.xml for Added, Modified, and Renamed components...${NC}"
python3 ${SCRIPTS}/diffy-pkg-gen.py --change-types 'Added,Modified,Renamed' --csv-file /tmp/diff.csv \
 --metadata-mapping-file ${SCRIPTS}/metadata_mapping.json --api-version ${API_VER} | tee >(pbcopy)

# Open the package bundle tool in a browser
echo -e "${BLUE}Opening Package Bundle Tool...${NC}"
open "https://mohan-chinnappan-n5.github.io/sf/pkg-bundle/app.html?c"

echo -e "${RED}--- Deletions ---${NC}" >&2

# Generate package.xml for deleted components
echo -e "${YELLOW}Generating package.xml for Deleted components...${NC}"
python3 ${SCRIPTS}/diffy-pkg-gen.py --change-types 'Deleted' --csv-file /tmp/diff.csv \
 --metadata-mapping-file ${SCRIPTS}/metadata_mapping.json --api-version ${API_VER}

echo -e "${GREEN}Process completed successfully!${NC}"
