# Sa11y

- Sa11y helps to write automated accessibility tests. 
- Sa11y helps you detect machine-knowable static DOM accessibility issues.
- Sa11y is based on [axe-core](https://github.com/dequelabs/axe-core), an accessibility testing JavaScript engine. 
- Sa11y provides support for Jest, WebdriverIO, and generic JavaScript tests. 
- Sa11y is used internally by teams at Salesforce - it is [open source](https://github.com/salesforce/sa11y#docs)



Sa11y ensures your DOM follows a set of accessibility guidelines (WCAG) and best practices. 
This is a list of some of the issues that sa11y will help you with, and some of the issues you will have to manually test:

Test for|@sa11y/jest|@sa11y/wdio|@sa11y/assert (generic JS)
|---|---|---|--|
|Use of semantic structure of the DOM|Yes|Yes|Yes
|Utilization of ARIA attributes|Yes|Yes|Yes
|Offering text-based alternatives for images & icons|Yes|Yes|Yes
|Navigation aids for screen readers|Yes|Yes|Yes
|Not using deprecated elements that hurt a11y, as <blink>, <maarquee>, meta refresh or server side image maps|Yes|Yes|Yes
|**Appropriate use of colors, with enough contrast**|No|Yes|No
|**Audio, Video elements**|No|Yes|No
|**App support of keyboard navigation and appropriate focus implementation**|No|No|No
|**Accessibility guidelines that apply only to mobile, as an adequate use of gestures**|No|No|No

----


Note our [base components](https://developer.salesforce.com/docs/component-library/overview/components), as well as [SLDS](https://www.lightningdesignsystem.com/), try to follow accessibility standards as much as possible.

**Key points**:

- The use of semantic structure of the DOM, and the utilization of [ARIA](https://www.w3.org/TR/wai-aria/) attributes (if needed) to allow assistive technologies to correctly identify the markup meaning.
- The appropriate use of colors, with enough contrast and not relying on them as the only way to convey information.
- Making sure the app is fully accessible using the **keyboard alone** (i.e. no mouse!) with a correct implementation of focus.


## Salesforce + a11y =>  Sa11y

- Install in your sfdx project
```
npm install -D @sa11y/jest

```

- [Sample package.json after this install](https://github.com/mohan-chinnappan-n/sally/blob/main/package.json)

```json
 {
  "name": "salesforce-app",
  "private": true,
  "version": "1.0.0",
  "description": "Salesforce App",
  "scripts": {
    "lint": "eslint **/{aura,lwc}/**",
    "test": "npm run test:unit",
    "test:unit": "sfdx-lwc-jest",
    "test:unit:watch": "sfdx-lwc-jest --watch",
    "test:unit:debug": "sfdx-lwc-jest --debug",
    "test:unit:coverage": "sfdx-lwc-jest --coverage",
    "prettier": "prettier --write \"**/*.{cls,cmp,component,css,html,js,json,md,page,trigger,xml,yaml,yml}\"",
    "prettier:verify": "prettier --list-different \"**/*.{cls,cmp,component,css,html,js,json,md,page,trigger,xml,yaml,yml}\"",
    "postinstall": "husky install",
    "precommit": "lint-staged"
  },
  "devDependencies": {
    "@lwc/eslint-plugin-lwc": "^1.1.2",
    "@prettier/plugin-xml": "^2.0.1",

    "@sa11y/jest": "^5.2.0",
    
    "@salesforce/eslint-config-lwc": "^3.2.3",
    "@salesforce/eslint-plugin-aura": "^2.0.0",
    "@salesforce/eslint-plugin-lightning": "^1.0.0",
    "@salesforce/sfdx-lwc-jest": "^1.1.0",
    "eslint": "^8.11.0",
    "eslint-plugin-import": "^2.25.4",
    "eslint-plugin-jest": "^26.1.2",
    "husky": "^7.0.4",
    "lint-staged": "^12.3.7",
    "prettier": "^2.6.0",
    "prettier-plugin-apex": "^1.10.0"
  },
  "lint-staged": {
    "**/*.{cls,cmp,component,css,html,js,json,md,page,trigger,xml,yaml,yml}": [
      "prettier --write"
    ],
    "**/{aura,lwc}/**": [
      "eslint"
    ]
  }
}




```

## Sample 
- helloConditionalRendering.html

```html
<template>
   <template if:true={isDetails}>
     <p>Jackfruits are great</p>
   </template> 
</template>


```

- helloConditionalRendering.js
```js
import { LightningElement, api } from 'lwc';
export default class HelloConditionalRendering extends LightningElement {
    @api isDetailsAvailable;
}

```

### Test
```js

import { createElement } from 'lwc';
import HelloConditionalRendering from 'c/helloConditionalRendering';

describe('c-hello-conditional-rendering', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // accessability test
    it('is it accessible', async () => {
        // Arrange
        const element = createElement('c-hello-conditional-rendering', {
            is: HelloConditionalRendering
        });

        // Act
        document.body.appendChild(element);
        element.isDetailsAvailable = true;

        // Assert
        await expect(element).toBeAccessible();
    });
});


```
### Successful test

The following line make it accessible to Sa11y
```js
element.isDetailsAvailable = true; 
```

```
npm run test:unit
```

```

> salesforce-app@1.0.0 test:unit
> sfdx-lwc-jest

 PASS  force-app/main/default/lwc/helloConditionalRendering/__tests__/helloConditionalRendering.test.js
  c-hello-conditional-rendering
    ✓ TODO: test case generated by CLI command, please fill in test logic (10 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.976 s
Ran all test suites.
```

#### Failed test run

If you comment out this line:

```js
element.isDetailsAvailable = true; 

```

```
~/Sa11y-1/Sa11ytest  >npm run test:unit
```

```

> salesforce-app@1.0.0 test:unit
> sfdx-lwc-jest

 FAIL  force-app/main/default/lwc/helloConditionalRendering/__tests__/helloConditionalRendering.test.js
  c-hello-conditional-rendering
    ✕ is it accessible (8 ms)

  ● c-hello-conditional-rendering › is it accessible

    TypeError: expect(...).toBeAccessible is not a function

      23 |         // const div = element.shadowRoot.querySelector('div');
      24 |
    > 25 |         await expect(element).toBeAccessible();
         |                               ^
      26 |     });
      27 | });

      at Object.toBeAccessible (force-app/main/default/lwc/helloConditionalRendering/__tests__/helloConditionalRendering.test.js:25:31)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.728 s
Ran all test suites.

```


### Video

<iframe width="1000" height="600" src="https://www.youtube.com/embed/ScqZisOBbUM?si=fTmojdQK2n7uy_qH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


### Resources

- [SLDS Accessibility Overview ](https://www.lightningdesignsystem.com/accessibility/overview/)
- [Get Started with Web Accessibility](https://trailhead.salesforce.com/content/learn/trails/get-started-with-web-accessibility)
- [Salesforce Accessibility Automation Libraries](https://github.com/salesforce/sa11y)