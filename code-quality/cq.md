# Introduction

```
There is no such thing as "perfect" code — there is only better code!

Instead of seeking perfection, we should seek for is "continuous improvement"...

We rarely write tests for our tests — a human must ensure that tests are valid.

```

- Code Quality Is Everyone’s Responsibility including:
    - Developer
    - Tester

- Code quality aspects

|Aspect|Comments|
|---|---|
|Reliability|Probability that a system will run without failure over a specific period of operation|
|Maintainability|How easily software can be maintained|
|Testability|how well the software supports testing efforts|
|Portability|how usable the same software is in different environments|
|Reusability|whether existing assets — such as code — can be used again|

- Code quality Metrics

|Metric|Comments|
|---|---|
|Defect Metrics|Number of defects — and severity of those defects — are important metrics of overall quality.
|Complexity Metrics|Cyclomatic complexity for example|
|Testability|how well the software supports testing efforts|
|Portability|how usable the same software is in different environments|

- Ways to Improve Code Quality

|Way|Comments|
|---|---|
|Use a coding standard|Makes everyone to use the right style|
|Analyze code — before code reviews|Analyze code as soon as it’s written|
| Follow code review best practices|Manual code reviews are still important for verifying the intent of the code|
|Refactor legacy code (when necessary)|help you clean up your codebase and lower its complexity|


# Write Maintainable Testable  Good Code
- readable
- understandable
- testable


|Good Code|
|---|
|Does what it should|
|Follows a consistent style|
|It is easy to understand|
|Has been well-documented|
|It can be tested|

|Key Points|
|---|
|Avoid Code with global, mutable state - that any code can access, and any code can modify|
| A class should ask for its dependencies through its **constructor** rather than acquiring them itself - dependency injection|
|Optimize the code for the reader of the code, not the writer - Good Code Is Easily Read and Understood, in Part and in Whole|
|DRY - Don't repeat yourself - it is easier to maintain the code if it only exists in one place|
|Do the simplest, smallest thing you can do to add some value|


# Static Code Analysis
- Run Static Code Analysis tools like [PMD](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/mdapi/pmd-codescan.md) that attempt to highlight possible violations and vulnerabilities within ‘static’ (non-running) source code by using techniques such as Taint Analysis and Data Flow Analysis

- Integrated with IDEs like VSCode, [VSCode Apex PMD
](https://marketplace.visualstudio.com/items?itemName=mohanChinnappan.apex-pmd-code-scanner)

[![Demo of PMD VScode Extn](https://github.com/mohan-chinnappan-n/vscode-apex-pmd/raw/master/images/code-scan-vscode-6.gif)](https://github.com/mohan-chinnappan-n/vscode-apex-pmd/raw/master/images/code-scan-vscode-6.gif)


## New PMD report
### Demo (will be part of PMD 6.50.0)
[![PMD Report](https://raw.githubusercontent.com/mohan-chinnappan-n/kural-docs/master/img/new_pmd-report-1.gif)](https://raw.githubusercontent.com/mohan-chinnappan-n/kural-docs/master/img/new_pmd-report-1.gif)
## Screenshot
[![PMD Report Screenshot](https://github.com/mohan-chinnappan-n/cli-dx/raw/master/mdapi/img/pmd-report-2.1.png)](https://github.com/mohan-chinnappan-n/cli-dx/raw/master/mdapi/img/pmd-report-2.1.png)

# ESLint
- [ESLint VS Code Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## ESLinting 
- [![ESLint in LWC](img/eslint-1.png)](img/eslint-1.png)!

# Lightning Lint Service
- [Salesforce Lightning Code Scanner](https://mohansun-slds-lint.herokuapp.com/)


# Inclusive Language
- [Inclusive language scanning](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/inclusive/index.md)
- [Woke VS Code Extension](https://marketplace.visualstudio.com/items?itemName=get-woke.vscode-woke)
[![Woke Demo](https://raw.githubusercontent.com/get-woke/vscode-woke/main/assets/demo.gif)](https://raw.githubusercontent.com/get-woke/vscode-woke/main/assets/demo.gif)


# Code Review
- Peer Code Review
    - Individual programmers are less than **50% efficient** at finding bugs in their own software. 
- Code Walk-thru

|Goals|
|---|
|The overall code health of code base is improving over time||
|The codebase stays consistent, maintainable|

- What to look for in a Code Review?

    - The developers should test code well-enough that they work correctly by the time they get to code review. 

|Item|Comments|
|---|---|
|Design|Interactions in the code makes sense?|
|Functionality|Code is the manifest of what the developer intended?|
|Complexity|Is the code is more complex than it should be?. “can’t be understood quickly by code readers.” Over-engineering, where developers have made the code more generic than it needs to be |
|Tests|Unit, integration, or end-to-end tests|
|Naming|Developer pick good names for everything?|
|Comments| Developer has written clear comments in understandable Language. Comment should explain why some code exists, and should not be explaining what some code is doing. Regular expressions and complex algorithms often benefit greatly from comments that explain what they’re doing, for example. Note that comments are different from **documentation** of classes, modules, or functions, which should instead express the purpose of a piece of code, how it should be used, and how it behaves when used|
|Style|Developer follows the published style for a given programming language|
|Documentation| READMEs and generated reference docs|


- Code Review Summary

|Item|
|---|
|The code is well-designed.|
|The functionality is good for the users of the code.|
|Any UI changes are sensible and look good.|
|Any parallel programming is done safely.|
|The code isn’t more complex than it needs to be.|
|The developer isn’t implementing things they might need in the future but don’t know they need now.|
|Code has appropriate unit tests.|
|Tests are well-designed.|
|The developer used clear names for everything.|
|Comments are clear and useful, and mostly explain why instead of what.|
|Code is appropriately documented |
|The code conforms to our style guides|

## Note the developers
|Item|Comments|
|---|---|
|Don’t Take it Personally|The goal of review is to maintain the quality of the codebase and the products|
|Fix the Code|1. Clarify the code 2.code comment that explains why the code is there (if required) 3. Modify the code|
|Think Collaboratively|If you disagree with the reviewer, find ways to collaborate: ask for clarifications, discuss pros/cons, and provide explanations of why your method of doing things is better for the codebase|


                
# Apex Best Practices

|Practice|
|---|
|1. Bulkify your Code|
|2. Avoid SOQL Queries or DML statements inside FOR Loops|
|3. Bulkify your Helper Methods|
|4. Using Collections, Streamlining Queries, and Efficient For Loops|
|5. Streamlining Multiple Triggers on the Same Object|
|6. Querying Large Data Sets|
|7. Use of the Limits Apex Methods to Avoid Hitting Governor Limits|
|8. Use @future Appropriately|
|9. Writing Test Methods to Verify Large Datasets|
|10. Avoid Hardcoding IDs|

- [Refer: APEX BEST PRACTICES](https://mohan-chinnappan-n.github.io/sfdc/bp-apex.html#/1)

## Naming Conventions
- Based on [Java Naming Conventions](https://www.oracle.com/java/technologies/javase/codeconventions-namingconventions.html)


|Item|Notes|Example|
|---|---|---|
|Class Name|Should be unique, begin with an Uppercase letter. Do not contain underscores or spaces (except from the prefix and suffix).  Should be nouns in mixed cases, with first letter of each interval word capitalized|AccountController|
|Variable Name| should be in mixed case (camelCase) with a lowercase first letter. Internal words start with capital letters|geocodingUrl|
|Method Name|Should be verbs, in mixed case with the first letter lowercase, with the first letter of each internal word capitalized - camelCase|getPagedPropertyList(...)|
|Constants| Class constants should be all UPPERCASE with words separated by underscores|private static final String BASE_URL = 'https://nominatim.openstreetmap.org/search?format=json'|
Trigger|<ObjectName>Trigger, should follow Salesforce Trigger  – One trigger per object||



# Test Driven Development 
- Test Driven Development(TDD) = Test First Development(TFD) + refactoring
- First write the test code before the functional code.
- it's a way to get SelfTestingCode

![TDD](img/tdd-1.png)

|Steps|Comments|
|---|---|
|Write a quick test| Basically just enough code to fail|
|Run the test| It should fail|
|Write functional code| So that pass the test|
|Finally, run the test | To check whether it has passed|
|Re-factor until tests PASS to continue with further development||


# LWC Best Practices

- [LWC Best Practices - Naming, Wire, LDS ](https://github.com/mohan-chinnappan-n/lwc-bp/blob/master/lwc-bp.md)
- [Lightning Performance](https://mohan-chinnappan-n2.github.io/2019/lex/perf.html)


# SOQL Best Practices
- [Best Practices](https://mohan-chinnappan-n.github.io/sfdc/soql-sosl-bp.html#/home)

# Lightning Performance Best Practices
- [Best Practices](https://mohan-chinnappan-n.github.io/sfdc/lx-bp.html#/home)

# Large Data Volumes
- [Best Practices](https://mohan-chinnappan-n.github.io/sfdc/ldv.html#/home)



# LWC Test Coverage - Jest
|Write Jest tests to: |
|---|
|Test a component in isolation|
|Test a component’s public API (@api properties and methods, events)|
|Test basic user interaction (clicks)|
|Verify the DOM output of a component|
|Verify that events fire when expected|



## Simple Jest Demo 
[![Jest Demo](img/jest-simple-0.webm.gif)](img/jest-simple-0.webm.gif)
```
// app.js
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

```
// app.test.js
const sum = require('./app');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

```

```
yarn test
```

```
yarn test
yarn run v1.22.17
$ jest
 PASS  ./app.test.js
  ✓ adds 1 + 2 to equal 3 (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.519 s, estimated 1 s
Ran all test suites.
✨  Done in 1.76s.

```

## LWC Example (unedited)

[![LWC jest demo](img/jest-simple-1.webm.gif)](img/jest-simple-1.webm.gif)

## Using Sa11y for 508 compliance
[![LWC Jest 508 test](img/jest-508-1.webm.gif)](img/jest-508-1.webm.gif)

## More info
[![Testing Lightning Web Components](https://img.youtube.com/vi/NH0YQKJMTKg/0.jpg)](https://www.youtube.com/watch?v=NH0YQKJMTKg)

[![Automated Accessibility Tests with sa11y](https://img.youtube.com/vi/ScqZisOBbUM/0.jpg)](https://www.youtube.com/watch?v=ScqZisOBbUM)


- [LWC Recipes](https://github.com/trailheadapps/lwc-recipes)

# Visualizing Code Coverage

- This demo shows how to visualize code coverage in VS Code
![Demo](https://raw.githubusercontent.com/mohan-chinnappan-n/kural-docs/master/test-coverage/code-coverage-viz-1.webm.gif)
[How to setup video - Enabling Apex Code Coverage Overlay in VS Code | Developer Quick Takes](https://www.youtube.com/watch?v=-fwY2Wyhhao)


# LWC i18n

## Demo showing how to use Custom Labels for localization 
- English (US)
- French
- Spanish

- [![Demo](https://raw.githubusercontent.com/mohan-chinnappan-n/cli-dx/master/i18n/img/lwc-118n-1.webm.gif)](https://raw.githubusercontent.com/mohan-chinnappan-n/cli-dx/master/i18n/img/lwc-118n-1.webm.gif)


- [Refer: How to list custom labels using DX](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/mdapi/ls/list.md)

- Example:
```
sfdx mohanc:mdapi:ls -u mohan.chinnappan.n.sel@gmail.com -i listCL.json -t CustomLabel 
[ 'Greeting' ]
{
    "fullName": "Greeting",
    "language": "en_US",
    "protected": "true",
    "shortDescription": "Greeting",
    "value": "Hello World From LWC"
}
```



# Resources
- [Google Engineering Practices Documentation](https://google.github.io/eng-practices/)


- [Test Driven Development is the best thing that has happened to software design](https://www.thoughtworks.com/insights/blog/test-driven-development-best-thing-has-happened-software-design)

- [First 10 minutes of TDD intro episode 1 - Kent Beck ](https://www.youtube.com/watch?v=VVSSga1Olt8)
- [TheThreeRulesOfTdd - Uncle Bob](http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd)
- [What is Code Quality and how to improve it](https://www.perforce.com/blog/sca/what-code-quality-overview-how-improve-code-quality)
- [Building a JavaScript Testing Framework](https://cpojer.net/posts/building-a-javascript-testing-framework)

- [Static Code Analysis](https://owasp.org/www-community/controls/Static_Code_Analysis)

- [Code Validator](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/source/validation.md)
- [SFDC Data Model](https://mohan-chinnappan-n.github.io/sfdc/fs-cloud/model-sfdc.html)
- [Apex Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_dev_guide.htm)

# Generate
```
sfdx mohanc:slides:gen -i cq.md -o cq.md.html -t 'Notes on Code Quality'

```
[Page View](https://github.com/mohan-chinnappan-n5/mohan-chinnappan-n5.github.io/blob/master/code-quality/cq.md)
