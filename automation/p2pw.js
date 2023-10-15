const convertPuppeteerJsonToPlaywright = require('./puppeteerToPlaywright');

const puppeteerJson = {
  "actions": [
    {
      "action": "goto",
      "url": "https://salesforce.com"
    },
    {
      "action": "screenshot",
      "path": "salesforce.png"
    }
  ]
};

convertPuppeteerJsonToPlaywright(puppeteerJson);

