# LWC Linting using ESLint

- ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making **code more consistent and avoiding bugs**.
- ES stands for EcmaScript

## @lwc/eslint-plugin-lwc

```
$ npm install eslint @babel/core @babel/eslint-parser @lwc/eslint-plugin-lwc --save-dev

```


```
cat .eslintrc
```

```json
{
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "requireConfigFile": false,
        "babelOptions": {
            "parserOpts": {
                "plugins": ["classProperties", ["decorators", { "decoratorsBeforeExport": false }]]
            }
        }
    },

    "plugins": ["@lwc/eslint-plugin-lwc"],

    "rules": {
        "@lwc/lwc/no-deprecated": "error",
        "@lwc/lwc/valid-api": "error",
        "@lwc/lwc/no-document-query": "error"
    }
}
```


## New SFDX Project

- ESLint plugin already included in the new SFDX Project which was created with
```
sfdx force:project:create  -n ProjectName
```

- run ``` npm install``` to install the ESLint plugin and other dependencies


```
cat .eslintignore 
```
```
**/lwc/**/*.css
**/lwc/**/*.html
**/lwc/**/*.json
**/lwc/**/*.svg
**/lwc/**/*.xml
**/aura/**/*.auradoc
**/aura/**/*.cmp
**/aura/**/*.css
**/aura/**/*.design
**/aura/**/*.evt
**/aura/**/*.json
**/aura/**/*.svg
**/aura/**/*.tokens
**/aura/**/*.xml
**/aura/**/*.app
.sfdx

```
- Create a lwc 
```
sfdx force:lightning:component:create --type lwc -n HelloPeach
```

```
cat package.json     
```
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
## References
- [Configuring ESLint](https://eslint.org/docs/latest/use/configure/)
- [ Notes on Code Quality](https://developer.salesforce.com/tools/vscode/en/lwc/writing#linting)
- [Salesforce VS Code extensions](https://developer.salesforce.com/tools/vscode/en/lwc/writing#linting)
- [Official ESLint rules for Lightning Web Components (LWC)](https://github.com/salesforce/eslint-plugin-lwc)
