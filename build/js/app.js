// app.js
// commit scripts gen 
// mohan chinnappan

const getEle = (id) => document.getElementById(id);
Split(["#code", "#content"], {
    sizes: [40, 60],
});

let editor;
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: "echo script comes here...",
        language: "shell",
        theme: "vs-dark",
        automaticLayout: true
    });

    // Event listener for the "Create Script" button
    getEle('generateScript').addEventListener('click', function () {
        const org = getEle('org').value;
        const projectName = getEle('projectName').value;
        const repo = getEle('repo').value;
        const jira = getEle('jira').value;
        const cmtMsg = getEle('cmtMsg').value;
        const parentBranch = getEle('parentBranch').value;

        // Create the Bash script
        const script = `
#!/bin/bash




#--- option select lib
source ./opt-select-lib.sh

#-- query lib
source ./query-lib.sh

#--------------------
# run it by:
# bash build.sh
#--------------------

#--- Parameters ---
ORG="${org}"
PROJECT_NAME="${projectName}"
REPO="${repo}"
JIRA="${jira}"
CMT_MSG="${cmtMsg}"
PARENT_BRANCH="${parentBranch}"
#--------------------

#--- Form the SOQL for querying ---
QUERY_FILE=/tmp/sourcemember_query.soql
SELECT_OUT_FILE=/tmp/sm_select.csv

cat <<EOF > $QUERY_FILE
SELECT Id,
MemberType,MemberName,         
RevisionNum, RevisionCounter,  
LastModifiedById, IsNewMember,
ChangedBy                      
FROM SourceMember              
WHERE isNewMember = true AND
LastModifiedById IN (SELECT Id FROM User WHERE userName='${org}' )

EOF

mkdir BUILD; cd BUILD
git clone ${repo} 
cd  ${projectName}

echo '==== Create a branch ==='

git branch ${jira}
git checkout ${jira}


# sfdx mohanc:tooling:query -q ./sourceMember_new2.soql > sourceMembers.csv
sf data query -f $QUERY_FILE  -o ${org} -t -r csv > sourceMembers2.csv 
select_records sourceMembers2.csv   ${SELECT_OUT_FILE}


echo "=== Get source status (remote changes) ==="
sfdx force:source:status -u ${org} -r --concise  --json > /tmp/_status.json

# Convert JSON to CSV using jq
csv_data=$(cat  /tmp/_status.json  | jq -r '.result[] | [.fullName, .type, .state, .ignored, .origin, .actualState] | @csv')

# Add header row
header="fullName,type,state,ignored,origin,actualState"
csv_data_with_header="${header}\n${csv_data}"

# Write CSV data to a file
echo -e "$csv_data_with_header" > /tmp/_status.csv

csv_query_to_csv /tmp/_status.csv "SELECT fullName, type FROM temp_table WHERE ignored='false' " /tmp/output.csv

echo '=== Pull the code from the org ==='
# https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_source_tracking.htm
# https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_source_tracking_see_changes.htm
sfdx force:source:pull  -f  -u ${org} 


echo '=== Commit the changes ==='
git add -A
git commit -m "${cmtMsg}"

echo "=== Merge to ${parentBranch} ==="

git checkout ${parentBranch}
git merge ${jira}
git push 

`;

        // Set the script in the Monaco Editor
        editor.setValue(script);

        // Store input in localStorage
        const data = { org, projectName, repo, jira, cmtMsg, parentBranch };
        localStorage.setItem('scriptData', JSON.stringify(data));
    });

    // Load previous input from localStorage
    const savedData = JSON.parse(localStorage.getItem('scriptData'));
    if (savedData) {
        getEle('org').value = savedData.org;
        getEle('projectName').value = savedData.projectName;
        getEle('repo').value = savedData.repo;
        getEle('jira').value = savedData.jira;
        getEle('cmtMsg').value = savedData.cmtMsg;
        getEle('parentBranch').value = savedData.parentBranch;
        getEle('generateScript').click();
    }
});

const downloadSh = data => {
    // Generate download link
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'build.sh';
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
}


getEle('tosh').addEventListener('click', event => {
    downloadSh(editor.getValue())
});