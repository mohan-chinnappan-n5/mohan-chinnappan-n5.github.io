// app.js
// commit scripts gen 
// mohan chinnappan

const getEle = (id) => document.getElementById(id);
Split(["#code", "#content"], {
    sizes: [40, 60],
});

  // Record the start time when the DOMContentLoaded event is fired
  document.addEventListener('DOMContentLoaded', function() {
    const domContentLoadedTime = performance.now();
    console.log(`DOM Loaded Time: ${domContentLoadedTime} milliseconds`);
  });

  // Record the start time when the load event is fired
  window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page Load Time: ${loadTime} milliseconds`);

    // Now the page is ready for user interaction
    const readyForInteractionTime = performance.now();
    console.log(`Ready for User Interaction Time: ${readyForInteractionTime} milliseconds`);
  });

getEle('hiwbtn').addEventListener('click',function() {
    // Use smooth scrolling to navigate to the section
    document.querySelector('#hiw').scrollIntoView({
        behavior: 'smooth'
    });
} )
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
        const org = getEle('org').value ||  'mohan@org1.com';
        const projectName = getEle('projectName').value || 'MyProj';
        const repo = getEle('repo').value  || '/Users/mohan/proj/repo1';
        const jira = getEle('jira').value || 'J-1234';
        const cmtMsg = getEle('cmtMsg').value || 'Adding a new filed opts in Account';
        const parentBranch = getEle('parentBranch').value || 'developer';
        const userName = getEle('userName').value || 'Mohan Chinnappan';
        const items = getEle('items').value || "'Layout', 'CustomObject'";

  
        

        // Create the Bash script
        const script = `
#!/bin/bash





#--------------------
# run it by:
# bash build.sh
#--------------------

#--- Parameters ---
ORG="${org}"
USER_NAME="${userName}"
REPO="${repo}"
JIRA="${jira}"
CMT_MSG="${cmtMsg}"
PARENT_BRANCH="${parentBranch}"
ITEMS="${items}"


#--------------------


#------------------------------------
#  util print message funtion
#-----------------------------------
line='---------------------------------------------------------------------------------------------'
function print_msg() {
    local msg=$1
    echo -e  $line 
    echo -e  $msg 
    echo -e  $line 
}
function print_err() {
    local msg=$1
    echo -e  $line 
    echo -e  $msg 
    echo -e  $line 
}
function print_info() {
    local msg=$1
    echo -e  $line 
    echo -e  $msg 
    echo -e  $line 
}



function create_branch() {
    local branch_name=$1

    # Check if the branch already exists
    if git rev-parse --verify "$branch_name" >/dev/null 2>&1; then
        print_err "Warning: Branch '$branch_name' already exists."
        return 1
    fi

    # Create and checkout the new branch
    git branch "$branch_name"
    git checkout "$branch_name"

    # Check if the branch creation was successful
    if [ "$(git rev-parse --abbrev-ref HEAD)" != "$branch_name" ]; then
        print_err "Error: Failed to create or switch to branch '$branch_name'."
        return 1
    fi

    print_info "Branch '$branch_name' created and checked out successfully."
    return 0
}

print_info "--- Let us check out the code ---"

print_info === get the current codebase REPO: \${REPO} parent_branch: \${PARENT_BRANCH}  
cd "\${REPO}"
git checkout \${PARENT_BRANCH}
git pull

# make a branch
print_info "--- Creating the branch ---"
create_branch "fastpath-\${JIRA}"


#-----------------

print_info "--- Get the details of the code update done by the user \${USER_NAME} ---"
query_file='/tmp/_my_sm.soql'
query="SELECT
Id,
LastModifiedBy.Name,
MemberIdOrName,        
MemberType,
MemberName,
RevisionNum, RevisionCounter,
IsNameObsolete,
LastModifiedById,
IsNewMember,
ChangedBy                      
FROM SourceMember    
WHERE LastModifiedBy.Name = '$USER_NAME'
AND MemberType IN ($ITEMS)
"

echo $query > $query_file
cat $query_file

# get the gen_packagexml.py
curl https://raw.githubusercontent.com/mohan-chinnappan-n/shell-scripts/master/py/gen_packagexml.py -o /tmp/gen_packagexml.py 

print_info "sf data query -f $query_file  -o $ORG -t -r csv |   python3 /tmp/gen_packagexml.py > package.xml"
sf data query -f $query_file  -o $ORG -t -r csv |   python3 /tmp/gen_packagexml.py > package.xml

# sf project generate --name  $4
# OR
# cd \${REPO_DIR}

sf force source retrieve --manifest package.xml -o $ORG

git add -A
git commit -m "\${CMT_MSG}"
## requires approver
#git push




`;

        // Set the script in the Monaco Editor
        editor.setValue(script);

        // Store input in localStorage
        const data = { org, projectName, repo, jira, cmtMsg, parentBranch, userName, items };
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
        getEle('userName').value = savedData.userName;
        getEle('items').value = savedData.items;



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
