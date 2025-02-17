# PRs to Package.xml Tool  

## Overview  
**PRs to Package.xml Tool** is a command-line tool for generating `package.xml` from Salesforce pull requests (PRs).  
It is a CLI version of the **[VS Code Extension](https://marketplace.visualstudio.com/items?itemName=mohanc5.mcghutils)**.

## Available at:
- [Tool](./prs-to-pkg-vscode.sh)


## Installation  

1. Save the script as `/usr/local/bin/prs-to-pkg-vscode.sh`.
2. Make it executable:  
   ```bash
   chmod +x /usr/local/bin/prs-to-pkg-vscode.sh
   ```

## Prerequisites  

- Install the **VS Code Extension**:  
  [MCGH Utils](https://marketplace.visualstudio.com/items?itemName=mohanc5.mcghutils)
- Ensure Python 3 (3.11 and above) is installed.

## Usage  

1. Navigate to your local **Git repository** and checkout the required branch (e.g., `develop`):
   ```bash
   git checkout develop
   ```
2. Run the script with a **comma-separated list of PR numbers**:
   ```bash
   prs-to-pkg-vscode.sh 1344,1356
   ```

## Script Functionality  

### 1. Extract PR Information  
The script extracts PR-related changes and saves them to a temporary CSV file (`/tmp/diff.csv`).  
It then displays **selected columns** from the extracted data.

### 2. Generate `package.xml`  
The script processes `diff.csv` to create a `package.xml` file for **Added, Modified, and Renamed** components.  
It copies the generated `package.xml` to the clipboard for easy pasting.

### 3. Open Package Bundle Tool  
After generating the package, the script opens the [Salesforce Package Bundle Tool](https://mohan-chinnappan-n5.github.io/sf/pkg-bundle/app.html?c) in a browser.

### 4. Handle Deletions  
The script separately processes **Deleted** components and updates `package.xml` accordingly.

## Example Output  

```bash
--- PRs to Package.xml tool ---
Extracting PR information...
Relevant PR changes:
Generating package.xml for Added, Modified, and Renamed components...
Opening Package Bundle Tool...
--- Deletions ---
Generating package.xml for Deleted components...
Process completed successfully!
```

## License  

MIT License © [Mohan Chinnappan](https://mohan-chinnappan-n.github.io/about/cv.html)

