# Design Testing
- App Designer
    
# Unit Testing (story development)
- Developer/Admin
    - Scratch org
    - Unit Test Evidence

Implementation Type|Tools|
---|---|
Apex|Apex Unit Testing, Apex Test Data Factory|
Aura|Jasmine or Mocha|
LWC|Jest|


# System Testing (verify)
- System tester/QA
    - Scratch org
    - Test Evidence

# Regression Testing (validate and integration)
- QA Engineer
    - Partial Sandbox
    - Regression Evidence
# Smoke Testing  (Release validation)
- DevOps Engineer
    - Full Copy Sandbox
    - Release Evidence 
    - Manual testing for one-off validations
    - Automated test tools end-to-end testing
# UAT (Release validation)
- Product Owner
    - Full Copy Sandbox
    - Sign off
    - Test evidence with screenshots


# What not to test
- Test on your customizations
- Test not much on
    - Standard Apps 


# LWC with Jest
- Use Jest to write unit tests for all of your Lightning web components
- [salesforce / sfdx-lwc-jest](https://github.com/salesforce/sfdx-lwc-jest)
- [Test Lightning Web Components](https://developer.salesforce.com/tools/vscode/en/lwc/testing)

## Videos
- [Testing Lightning Web Components](https://www.youtube.com/watch?v=NH0YQKJMTKg)

## Local testing
- Standard javascript testing
- Flexible config and popular JS tools
- Testing in isolation - No platform access
- Tests must be saved in the Version Control
- No coverage requirements as of now

## [Jest](https://jestjs.io/)

- Open Source From Facebook
- Can run tests in parallel
- Well documented
- Has good extensions
- Replicates entire DOM tree (virtual JSDOM) and you perform operations on the JSDOM using standard Web APIs (Selectors, Events...)
- Can run in CI environment, WebDriver environment
- Open Source - extendable with Extensions you can write

### sfdx-lwc-jest
- Brings lwc specific testing features
- Base Lightning component mocks 
    - source code may not be available at your machine like ```lightning-button```
    - framework provides mocks to simulate base components
    - mocks takes care of the events the base components sends and receives
- @wire mocking utility
    - 



# References
- [Salesforce Test Automation](https://www.youtube.com/watch?v=8Kes203utZM)
- [Test Lightning Web Components](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/testing)

