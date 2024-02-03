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
        const from = getEle('from').value ||  'HEAD~3';
        const to = getEle('to').value || 'HEAD';
        const repo = getEle('repo').value  || '/Users/mohan/proj/repo1';
        const parentBranch = getEle('parentBranch').value || 'developer';

  
        

        // Create the Bash script
        const script = `
#!/bin/bash





#--------------------
# run it by:
# bash bkp.sh
#--------------------

#--- Parameters ---
FROM="${from}"
TO="${to}"
REPO="${repo}"
PARENT_BRANCH="${parentBranch}"


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

print_msg "Preparing Delta package for $FROM to $TO..."
sfdx sgd:source:delta -f $FROM -t $TO  -o .  > _delta_.json
cat _delta_.json
print_msg "The package.xml is under package folder"
cat package/package.xml

print_msg "Opening Bundle builder..."


pbcopy < package/package.xml
open "https://mohan-chinnappan-n5.github.io/sf/pkg-bundle/app.html?c"






`;

        // Set the script in the Monaco Editor
        editor.setValue(script);

        // Store input in localStorage
        const data = { from, to, repo, parentBranch };
        localStorage.setItem('bkp_scriptData', JSON.stringify(data));
    });

    // Load previous input from localStorage
    const savedData = JSON.parse(localStorage.getItem('bkp_scriptData'));
    if (savedData) {
        getEle('from').value = savedData.from;
        getEle('to').value = savedData.to;
        getEle('repo').value = savedData.repo;
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
    link.download = 'bkp.sh';
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
}


getEle('tosh').addEventListener('click', event => {
    downloadSh(editor.getValue())
});
