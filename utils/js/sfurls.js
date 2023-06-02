
// sfurls.js
const getEle = id => document.getElementById(id);

let startUrl = 'https://d4x000007rxogeaq-dev-ed.my.salesforce.com';

let params = (new URL(document.location)).searchParams;
  //------- via clipboard
  let c = params.get('c');
  if (c !== null) await navigator.clipboard.readText().then((clipText) => {
      startUrl = clipText;
  });

getEle('instanceURL').value = startUrl;
Split(["#menu", "#content"], { sizes: [40, 60] });

 

const urls = [

    {"Setup":  'SetupOneHome'  },
    {"Object Manager":  'ObjectManager' },
    {"DeployStatus": 'DeployStatus'},
    {"OrgWideEmailAddresses": "OrgWideEmailAddresses"},
    
    {"Apex":  'ApexClasses'  },
   {"AppBuilder": 'FlexiPageList'},
    {"ApexTriggers": 'ApexTriggers'},
    
    {"Flows": 'Flows'},
    {"ConnectedApps": 'ConnectedApplication'},
    {"InstalledPackages": 'ImportedPackage'},

   {"BulkDataLoads": 'AsyncApiJobStatus'},
   
   {"CustomLabels": 'ExternalStrings'},
    {"CustomMetadata": 'CustomMetadata'},
  
    {"MatchingRules": 'MatchingRules'},
    {"EinsteinLeadScoring": 'SalesInsights' },
    {"Dashboard": 'o/Dashboard'},
    {"EmailToCase": 'EmailToCase'},
    {"Einstein Setup Assistant": 'SalesInsightsSetupAssistant'}







];


const lgEle = getEle('lg');
const instanceURL =  getEle('instanceURL').value;


for (const url of urls) {
    const liEle = document.createElement('li');
    liEle.setAttribute('class', 'list-group-item');
    const anchorEle = document.createElement('a');
    anchorEle.setAttribute('href', `${instanceURL}/lightning/setup/${url[Object.keys(url)[0]]}/home`);
    anchorEle.setAttribute('target', 'new');
    anchorEle.setAttribute('id',Object.keys(url)[0] );
    anchorEle.textContent = Object.keys(url)[0];
    liEle.appendChild(anchorEle);
    lgEle.appendChild(liEle);

}
getEle('gen').addEventListener('click', event => {
    for(const url of urls) {
        const instanceURL =  getEle('instanceURL').value;
        if (!instanceURL) instanceURL = "https://d4x000007rxogeaq-dev-ed.my.salesforce.com";
        getEle(Object.keys(url)[0]).setAttribute('href', `${instanceURL}/lightning/setup/${url[Object.keys(url)[0]]}/home`);
    }


});

