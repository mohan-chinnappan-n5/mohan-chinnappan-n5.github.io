#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 -p <pr_numbers_comma_separated> -f <file_prefix>"
    exit 1
}

# Parse command-line arguments
while getopts "p:f:" opt; do
    case ${opt} in
        p) PR_NUMBERS="$OPTARG" ;;      # PR numbers
        f) FILE_PREFIX="$OPTARG" ;;     # File prefix (e.g., "src/sales")
        *) usage ;;
    esac
done

# Ensure PR numbers and file prefix are provided
if [[ -z "$PR_NUMBERS" ]] || [[ -z "$FILE_PREFIX" ]]; then
    usage
fi

# Auto-detect GitHub repository
REPO=$(gh repo view --json nameWithOwner --jq '.nameWithOwner')

# Ensure REPO is detected
if [[ -z "$REPO" ]]; then
    echo "❌ Error: Could not determine the GitHub repository. Ensure you are in a Git repository with GitHub CLI authenticated."
    exit 1
fi

# Set LABELS_FILE with dynamic prefix
LABELS_FILE="$FILE_PREFIX/main/default/labels/CustomLabels.labels-meta.xml"
#LABELS_FILE="force-app/main/default/labels/CustomLabels.labels-meta.xml"  # For other use cases

# Convert comma-separated PR numbers into an array
IFS=',' read -ra PR_ARRAY <<< "$PR_NUMBERS"

# Loop through each PR
for PR_NUMBER in "${PR_ARRAY[@]}"; do
    echo "🔍 Checking PR #$PR_NUMBER..."

    # Get all changed files using gh api with pagination
    FILES_CHANGED=$(gh api --paginate repos/$REPO/pulls/$PR_NUMBER/files --jq '.[].filename')

    if echo "$FILES_CHANGED" | grep -q "$LABELS_FILE"; then
        echo "✅ Custom Labels were modified in PR #$PR_NUMBER."

         # Prompt the user before opening the browser
        echo "🌍 About to open the web browser to show PR diff for #$PR_NUMBER..."
        read -n 1 -s -r -p "Press any key to continue..."

        # Open the PR diff in the web browser
        gh pr diff "$PR_NUMBER" -w
    fi
done
