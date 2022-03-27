# Goals
1. Clean data/metadata (automated)
2. Clean Scratch orgs (automated)
3. Code scan integration, (automated)


    - codescan : ```catch them young```
    - ![sonarlint](img/sq-lint-0.png)
        - [**At Developer Side**](#1)
         - [PMD Scan at IDE VS Code](https://marketplace.visualstudio.com/items?itemName=mohanChinnappan.apex-pmd-code-scanner) 
         - [Sonar Lint at IDE VS Code](https://www.sonarlint.org/vscode))
       
        - **In the pipeline**
            -  [Sonar-scanner in the pipeline](#2)

4. Integrating tools like [org.viz](https://mohan-chinnappan-n5.github.io/sf-security/security.md.html#10) 

5. Performance measurements
    - speedtest.js [Lightning Performance tips](https://mohan-chinnappan-n2.github.io/2019/lex/perf.html)
    - [Lighthouse](https://developers.google.com/web/tools/lighthouse)

6. Integration with Slack

7. Test-Automation


# Code Scan at Developer side

- ![code-scan at dev](img/sq-lint-0.png)

- [PMD at developer side (VS code Extension](https://marketplace.visualstudio.com/items?itemName=mohanChinnappan.apex-pmd-code-scanner)

- ![PMD VS Code](img/pmd-vscode-1.png)

- ![PMD VS Code demo](https://github.com/mohan-chinnappan-n/vscode-apex-pmd/raw/master/images/code-scan-vscode-6.gif)

## SonarLint
- [SonarLint](https://www.sonarqube.org/sonarlint/?referrer=sonarqube-welcome)
    - [VS Code SonarLint](https://www.sonarlint.org/vscode)
- ![SonarLint Demo](img/sonarLint-1.webm.gif)

# Salesforce Lightning Code Scanner

- [Salesforce Lightning Code Scanner App](https://mohansun-slds-lint.herokuapp.com/)

![Demo](img/slds-scanner-1.webm.gif)

# Code Scan in the deployment pipeline
- Sonar-scanner in the pipeline

- [Download SonarQube](https://www.sonarqube.org/success-download-community-edition/)

## Start SonarQube Server
```
cd codescan/sonarqube/sonarqube-9.3.0.51899

./bin/macosx-universal-64/sonar.sh console

```

![allow sq](img/sq-allow-1.png)

![sq server starting](img/sq-server-start.png)

## Install sonar-scanner on mac
```
brew install sonar-scanner

```

## Setting up the project
![setting up sonar project](img/sq-create-project.webm.gif)


- Running
```
sonar-scanner \
  -Dsonar.projectKey=pythontest \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=c0fbb7cac9403c341a51307a69ad9f1104e9744c

```

- Note: ``` -Dsonar.login=c0fbb7cac9403c341a51307a69ad9f1104e9744c``` is the project key

- Viewing scanner output

- ![scanner output](img/sq-output-1.webm.gif)

# SonarLint
![sonarlint](img/sq-lint-0.png)

![running](img/sq-scanner-1.webm.gif)


# Branching

- ![git-b0](img/git/gitb-0.png)

- ![git-b1](img/git/gitb-1.png)


- ![git-b2](img/git/gitb-2.png)

- ![git-b3](img/git/gitb-3.png)

- ![git-b4](img/git/gitb-4.png)

# Performance Measurements

- speedtest.js 
    - [Lightning Performance tips](https://mohan-chinnappan-n2.github.io/2019/lex/perf.html)

- ![speedtest](https://mohan-chinnappan-n2.github.io/2019/lex/img/octane-score.png)

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
    - ![Lighthouse](img/lighthouse.png)
 

# Integration with Slack

![Jenkins - slack](img/jenkins-slack-1.png)

- Slack Notifcations Plugin
- ![Slack Notifications](img/slack-notification.png)
- ![Slack Notifications2](img/slack-notification-2.png)


- Will be based on TCRM (Tableau CRM slack integration work)
- Demos of Tableau CRM slack integration work 
## Desktop

![Demo1](img/slack/image6.gif)

![Demo2](img/slack/image7.gif)

## Mobile

![Demo3](img/slack/image8.gif)




# References

## SFDX
- [SFDX Slides](https://mohan-chinnappan-n.github.io/sfdc/dx.html#/home)

## Code Scan

### SonarQube
- [SonarQube download](https://www.sonarqube.org/success-download-community-edition/)
- [SonalQube install](https://docs.sonarqube.org/latest/setup/get-started-2-minutes/)
- [Security and Preferences - SonarQube](https://community.sonarsource.com/t/sonar-cannot-start-once-updated-to-macos-catalina-error-as-wrapper-cannot-be-opened-because-the-developer-cannot-be-verified/16439/2)
- [SonarQube install on Mac](https://techblost.com/how-to-setup-sonarqube-locally-on-mac/)

- [SonarLint](https://www.sonarqube.org/sonarlint/?referrer=sonarqube-welcome)
    - [VS Code SonarLint](https://www.sonarlint.org/vscode)
- [SonarQube - Apex Rules](https://rules.sonarsource.com/apex)

# Creation

```
sfdx mohanc:slides:gen -i bp.md  -o bp.md.html -t 'DevOps Best Practices'

```




