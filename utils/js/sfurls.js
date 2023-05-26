
// sfurls.js

const getEle = id => document.getElementById(id);

Split(["#menu", "#content"], { sizes: [40, 60] });

getEle('gen').addEventListener('click', event => {
    const instanceURL = getEle('instanceURL').value;
    getEle('setup').setAttribute('href', `${instanceURL}/lightning/setup/SetupOneHome/home`);
    getEle('OM').setAttribute('href', `${instanceURL}/lightning/setup/ObjectManager/home`);
    getEle('flows').setAttribute('href', `${instanceURL}/lightning/setup/Flows/home`);
    getEle('deployStatus').setAttribute('href', `${instanceURL}/lightning/setup/DeployStatus/home`);
    getEle('installedPackages').setAttribute('href', `${instanceURL}/lightning/setup/ImportedPackage/home`);
    getEle('apex').setAttribute('href', `${instanceURL}/lightning/setup/ApexClasses/home`);
    getEle('triggers').setAttribute('href', `${instanceURL}/lightning/setup/ApexTriggers/home`);
    getEle('connectedApps').setAttribute('href', `${instanceURL}/lightning/setup/ConnectedApplication/home`);
    getEle('connectBulkDataLoads').setAttribute('href', `${instanceURL}/lightning/setup/AsyncApiJobStatus/home`);
    getEle('appBuilder').setAttribute('href', `${instanceURL}/lightning/setup/FlexiPageList/home`);

    getEle('customLabels').setAttribute('href', `${instanceURL}/lightning/setup/ExternalStrings/home`);
    getEle('CustomMetadata').setAttribute('href', `${instanceURL}/lightning/setup/CustomMetadata/home`);

});

