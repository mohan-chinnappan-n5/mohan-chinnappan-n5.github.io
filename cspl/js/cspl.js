/*
  class to create recording scripts

  mohan chinnappan 2022
*/
class CSPL {
  title;
  instanceUrl;
  timeout;
  constructor(title, instanceUrl, timeout) {
    this.title = title;
    this.instanceUrl = instanceUrl;
    this.timeout = timeout;
  }

  viewPortDef() {
    const def = {
      type: "setViewport",
      width: 1680,
      height: 595,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: false,
    };
    return def;
  }

  enableAll(countryISO) {
    const url = `${this.instanceUrl}/i18n/ConfigureCountry.apexp?countryIso=${countryISO}&setupid=AddressCleanerOverview&success=true`;
    const title =
      "configure states, countries, and territories ~ salesforce - developer edition";

    const def = [
      {
        type: "navigate",
        url,
        timeout: this.timeout,
        assertedEvents: [
          {
            type: "navigation",
            url,
            title,
          },
        ],
      },

      {
        type: "click",
        target: "main",
        selectors: [
          [
            "#configurecountry\\:form\\:stateRelatedListComponent\\:configStateCountryRelList\\:list\\:table\\:0\\:editActiveCol",
          ],
        ],
        offsetY: 12.2421875,
        offsetX: 143.5546875,
        button: "secondary",
        timeout: this.timeout,

      },
      {
        type: "click",
        target: "main",
        selectors: [
          ['aria/Active[role="checkbox"]'],
          [
            "#configurecountry\\:form\\:stateRelatedListComponent\\:configStateCountryRelList\\:list\\:table\\:checkAllActive",
          ],
        ],
        offsetY: 5.7421875,
        offsetX: 6.0546875,
        timeout: this.timeout,

      },
      {
        type: "click",
        target: "main",
        selectors: [
          ['aria/Visible[role="checkbox"]'],
          [
            "#configurecountry\\:form\\:stateRelatedListComponent\\:configStateCountryRelList\\:list\\:table\\:checkAllVisible",
          ],
        ],
        offsetY: 4.7421875,
        offsetX: 6.6015625,
        timeout: this.timeout,

      },
      {
        type: "click",
        target: "main",
        selectors: [
          [
            "#configurecountry\\:form\\:blockBottomButtons\\:j_id60\\:saveButtonBottom",
          ],
        ],
        offsetY: 10.7421875,
        offsetX: 22,
        timeout: this.timeout,

        assertedEvents: [
          {
            type: "navigation",
            url: "https://d4x000007rxogeaq-dev-ed.my.salesforce.com/i18n/ConfigureCountry.apexp",
            title: "",
          },
        ],
      },
    ];
    return def;
  }

  stepsDef(countryISO, stateName, stateCode) {
    const url = `${this.instanceUrl}/i18n/ConfigureCountry.apexp?countryIso=${countryISO}&setupid=AddressCleanerOverview&success=true`;
    const title =
      "configure states, countries, and territories ~ salesforce - developer edition";

    const def = [
      {
        type: "navigate",
        url,
        assertedEvents: [
          {
            type: "navigation",
            url,
            timeout: this.timeout,

            title,
          },
        ],
      },

      {
        type: "click",
        target: "main",
        selectors: [
          ['aria/New State[role="button"]'],
          [
            "#configurecountry\\:form\\:stateRelatedListComponent\\:configStateCountryRelList\\:list\\:j_id50\\:buttonAddNew",
          ],
        ],
        offsetY: 12.7421875,
        offsetX: 30.6015625,
        timeout: this.timeout,

        assertedEvents: [
          {
            type: "navigation",
            url: `${this.instanceUrl}/i18n/ConfigureCountry.apexp`,
            title: "",
          },
        ],
      },

      {
        type: "click",
        target: "main",
        selectors: [
          [
            "#configurenew\\:j_id1\\:blockNew\\:j_id9\\:nameSectionItem\\:editName",
          ],
        ],
        offsetY: 7.7421875,
        offsetX: 60.0859375,
        timeout: this.timeout,

      },

      {
        type: "change",
        value: `${stateName}`,
        selectors: [
          [
            "#configurenew\\:j_id1\\:blockNew\\:j_id9\\:nameSectionItem\\:editName",
          ],
        ],
        target: "main",
        timeout: this.timeout,

      },

      {
        type: "keyDown",
        target: "main",
        key: "Tab",
        timeout: this.timeout,

      },
      {
        type: "keyUp",
        key: "Tab",
        target: "main",
        timeout: this.timeout,

      },

      {
        type: "change",
        value: `${stateCode}`,
        selectors: [
          [
            "#configurenew\\:j_id1\\:blockNew\\:j_id9\\:codeSectionItem\\:editIsoCode",
          ],
        ],
        target: "main",
        timeout: this.timeout,

      },

      {
        type: "click",
        target: "main",
        selectors: [
          ["aria/Add"],
          ["#configurenew\\:j_id1\\:blockNew\\:j_id43\\:addButton"],
        ],
        offsetY: 4.2421875,
        offsetX: 17.6015625,
        timeout: this.timeout,

        assertedEvents: [
          {
            type: "navigation",
            url: `${this.instanceUrl}/i18n/ConfigureNewState.apexp`,
            title: "",
          },
        ],
      },
    ];
    return def;
  }

  processList(list) {
    const steps = [];
    steps.push(this.viewPortDef());

    for (const item of list) {
      let countryISO, name, doubleCode, stateCode, stateName;
      [countryISO, name, doubleCode, stateCode, stateName] = item;
      const itemStepsDef = this.stepsDef(countryISO, stateName, stateCode);
      for (const itemStepDef of itemStepsDef) {
        steps.push(itemStepDef);
      }
    }

    return { title: this.title, steps };
  }

  processActivateAll(list) {
    const steps = [];
    steps.push(this.viewPortDef());
    // make sure we process only once for a given country
    let processedCountries = [];
    for (const item of list) {
      let countryISO, name, doubleCode, stateCode, stateName;
      [countryISO, name, doubleCode, stateCode, stateName] = item;
      if (!processedCountries.includes(countryISO)) {
        const itemStepsDef = this.enableAll(countryISO);
        processedCountries.push(countryISO);
        for (const itemStepDef of itemStepsDef) {
          steps.push(itemStepDef);
        }
      }
    }

    return { title: this.title, steps };
  }
}

/*

                {
                    "type": "click",
                    "target": "main",
                    "selectors": [
                        [
                            "#configurenew\\:j_id1\\:blockNew\\:j_id9\\:activeSectionItem\\:editActive"
                        ]
                    ],
                    "offsetY": 2.2421875,
                    "offsetX": 7.0859375
                },
                {
                    "type": "click",
                    "target": "main",
                    "selectors": [
                        [
                            "#configurenew\\:j_id1\\:blockNew\\:j_id9\\:visibleSectionItem\\:editVisible"
                        ]
                    ],
                    "offsetY": 9.2421875,
                    "offsetX": 5.0859375
                },
*/
