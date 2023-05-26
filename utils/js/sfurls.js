
// sfurls.js

const getEle = id => document.getElementById(id);

Split(["#menu", "#content"], { sizes: [40, 60] });

 

const urls = [

    {"Setup":  'SetupOneHome'  },
    {"Object Manager":  'ObjectManager' },
    {"Apex":  'Apex'  },
    {"ApexTriggers": 'ApexTriggers'},
    {"Flows": 'Flows'},
    {"DeployStatus": 'DeployStatus'},
    {"ObjectManager": 'ObjectManager'},
    {"InstalledPackages": 'ImportedPackage'},

    {"ConnectedApps": 'ConnectedApplication'},

   {"BulkDataLoads": 'AsyncApiJobStatus'},
   {"AppBuilder": 'FlexiPageList'},

   {"CustomLabels": 'ExternalStrings'},
   {"AppBuilder": 'FlexiPageList'},

    {"MatchingRules": 'MatchingRules'},
    {"CustomMetadata": 'CustomMetadata'},
    {"EinsteinLeadScoring": 'SalesInsights' },
    {"Dashboard": 'o/Dashboard'},
    {"EmailToCase": 'EmailToCase'},
    {"OrgWideEmailAddresses": "OrgWideEmailAddresses"}





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

