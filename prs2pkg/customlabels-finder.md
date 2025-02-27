# GitHub PR Custom Labels Diff Checker
This script is designed to check if Salesforce Custom Labels have been modified in a list of GitHub pull requests (PRs). If changes are detected in the relevant CustomLabels files, it opens the PR diff in the web browser for review.

## Features
- Automatically detects the GitHub repository using gh repo view.
- Supports multiple PR numbers (comma-separated).
- Fetches all the files changed in the PR using GitHub's API and pagination, ensuring that all changes are covered 
- Checks if any of the files changed in the PR match the CustomLabels file path.
- Supports a dynamic file prefix for CustomLabels (e.g., src/sales/xyz).
- Prompts the user to confirm before opening the web browser to show the PR diff.


## Install
- Get [script](./customlabels-finder.sh)
- Copy this script to your usr/local/bin folder
- Make it executable: chmod +x customlabels-find.sh


## Usage
- Go to your git folder with correct branch checkedout
- run
```bash
check_custom_labels.sh -p 28426,28427,28428 -f "src/sales/xyz"
```
- -f arg will be just before the main in the path


```bash

# example usage
 customlabels-finder.sh -p 28426,28427 -f src/sales/project
🔍 Checking PR #28426...
✅ Custom Labels were modified in PR #28426.
🌍 About to open the web browser to show PR diff for #28426...
Opening .../pull/28426/files in your browser.
🔍 Checking PR #28427...
```


