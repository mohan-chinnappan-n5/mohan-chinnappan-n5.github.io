# Delta Deployments

![Farm](../img/cover/chromecast-farm-1.jpg)

## Topics

- [Assumptions](#assumptions)
- [Comparing - Delta vs full deployment ](#compare)
- [Delta deployment logs](#logs)
- [Recommendation](#recommendation)
- [Single Command to Delta Deployment](#deploy)
- [Detailed Steps](#full)
- [References and more tools](#refs)
----
<a name='assumptions'></a>
## Assumptions
- Version control should be the single-source of truth for the source code
- Version control should be kept up-to-date at any point in time
-----

<a name='compare'></a>

## Delta vs full deployment

| Full Deployment      | Delta |
| ----------- | ----------- |
| Adheres to the principles of container based deployments | You only deploy the delta - not deploying untouched code|
| Takes more deployment time |  Quicker Deployments |
| Simple toolset| Requires smarter toolset|
| Simple to keep track of deployments|Requires good documentation including commit-ids used for the deployments - Logs as shown below|

<a name='logs'></a>
## Delta Deployment Logs - example
|Deployment Date|Approval Ref#|Environment|From Commit-Id SHA-1|To Commit-Id SHA-1|Comments|
| ----------- | ----------- | ----------- | ----------- |----------- | ----------- |
| Dec-10-2022 | #123456 | UAT |  839861d | 0d306cc | 12 components |


<a name='recommendation'></a>
### Recommendation
- Each approach has a place in your deployment process. Start with a couple of full deployments and follow it with delta deployment

-----

- Refer : [Salesforce Blog on Delta deployment](https://developer.salesforce.com/blogs/2021/01/optimizing-unpackaged-deployments-using-a-delta-generation-tool)


## How do prepare for Delta deployment?
![delta deployment](https://d259t2jj6zp7qm.cloudfront.net/images/20210323154950/OptV2-2000x1000.png)


 

<a name='deploy'></a>
## Single command to do the delta deployment

- Download the script from [here](https://github.com/mohan-chinnappan-n/delta-deployment/blob/main/deltaDeploy.sh)
- [deltaDeploy](https://github.com/mohan-chinnappan-n/delta-deployment/blob/main/deltaDeploy.sh)



## Demo
```
~/deltatest [main] >bash deltaDeploy.sh
-----------------------------------
Delta Deployment
-----------------------------------
===== git log =====
29dff0a|mohan-chinnappan-n|mohan.chinnappan.n@gmail.com|cleanup
15ca632|mohan-chinnappan-n|mohan.chinnappan.n@gmail.com|delta image added
3456d9f|mohan-chinnappan-n|mohan.chinnappan.n@gmail.com|delta.md updated
474669c|mohan-chinnappan-n|mohan.chinnappan.n@gmail.com|Fruit Mango added
73ea22c|mohan-chinnappan-n|mohan.chinnappan.n@gmail.com|Fruit Mango added
171a81a|mohan-chinnappan-n|mohan.chinnappan.n@gmail.com|pineapple fruit classes removed
faa2d86|mohan-chinnappan-n|mohan.chinnappan.n@gmail.com|3 fruit classes added
fe12d89|mohan-chinnappan-n|mohan.chinnappan.n@gmail.com|init
-----------------------------------
FROM (Enter SHA1 for this commit FROM which we need to the delta deployment, defulat: HEAD^): fe12d89
TO (Enter SHA1 for this commit TO which we need to the delta deployment, default: HEAD): 29dff0a
----------------------------------- fe12d89 to 29dff0a -----------------------------------
----------------------------------- Preparing delta packages -----------------------------------
{
  "error": null,
  "output": ".",
  "success": true,
  "warnings": []
}
<---- SUCCESS: true
Check only? (Enter y/n, default: y): y
<---- Check only: -c 
Run TestClasses only? (Enter y/n, default: y): n
<---- testlevel  
Run deletion pre or post? (Enter pre or post, default: post)): 
post
<---- pre/post: post
----------------------------------- Deploying delta packages -----------------------------------
sfdx force:source:deploy -x package/package.xml --postdestructivechanges destructiveChanges/destructiveChanges.xml --verbose --loglevel TRACE
Deploying v55.0 metadata to mohan.chinnappan.n_ea2@gmail.com using the v56.0 SOAP API
Deploy ID: 0Af3h00000Rz0dNCAR
DEPLOY PROGRESS | ████████████████████████████████████████ | 3/3 Components

=== Deployed Source

 FULL NAME  TYPE      PROJECT PATH                                           
 ────────── ───────── ────────────────────────────────────────────────────── 
 HelloMango ApexClass force-app/main/default/classes/HelloMango.cls          
 HelloMango ApexClass force-app/main/default/classes/HelloMango.cls-meta.xml 
 HelloPeach ApexClass force-app/main/default/classes/HelloPeach.cls          
 HelloPeach ApexClass force-app/main/default/classes/HelloPeach.cls-meta.xml 
 HelloPear  ApexClass force-app/main/default/classes/HelloPear.cls           
 HelloPear  ApexClass force-app/main/default/classes/HelloPear.cls-meta.xml  
Deploy Succeeded.

```
----
<a name='full'></a>

## Full steps
- ![steps](https://raw.githubusercontent.com/mohan-chinnappan-n/delta-deployment/main/img/delta-concepts.png)

## Let us create DX Project 'deltatest' to provide the concepts
```
~  >sfdx force:project:create -n deltatest
target dir = /Users/mchinnappan
   create deltatest/config/project-scratch-def.json
   create deltatest/README.md
   create deltatest/sfdx-project.json
   create deltatest/.husky/pre-commit
   create deltatest/.vscode/extensions.json
   create deltatest/.vscode/launch.json
   create deltatest/.vscode/settings.json
   create deltatest/force-app/main/default/lwc/.eslintrc.json
   create deltatest/force-app/main/default/aura/.eslintrc.json
   create deltatest/scripts/soql/account.soql
   create deltatest/scripts/apex/hello.apex
   create deltatest/.eslintignore
   create deltatest/.forceignore
   create deltatest/.gitignore
   create deltatest/.prettierignore
   create deltatest/.prettierrc
   create deltatest/jest.config.js
   create deltatest/package.json

```
## Commit into git
```
~  >cd deltatest 

~/deltatest  >git init .
hint: Using 'master' as the name for the initial branch. This default branch name
hint: is subject to change. To configure the initial branch name to use in all
hint: of your new repositories, which will suppress this warning, call:
hint: 
hint: 	git config --global init.defaultBranch <name>
hint: 
hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
hint: 'development'. The just-created branch can be renamed via this command:
hint: 
hint: 	git branch -m <name>
Initialized empty Git repository in /Users/mchinnappan/deltatest/.git/
~/deltatest [master] >git branch -m main
~/deltatest [main] >git add -A
~/deltatest [main] >git commit -m init
[main (root-commit) fe12d89] init
 18 files changed, 255 insertions(+)
 create mode 100644 .eslintignore
 create mode 100755 .forceignore
 create mode 100644 .gitignore
 create mode 100755 .husky/pre-commit
 create mode 100755 .prettierignore
 create mode 100755 .prettierrc
 create mode 100644 .vscode/extensions.json
 create mode 100644 .vscode/launch.json
 create mode 100644 .vscode/settings.json
 create mode 100644 README.md
 create mode 100644 config/project-scratch-def.json
 create mode 100644 force-app/main/default/aura/.eslintrc.json
 create mode 100644 force-app/main/default/lwc/.eslintrc.json
 create mode 100644 jest.config.js
 create mode 100644 package.json
 create mode 100644 scripts/apex/hello.apex
 create mode 100644 scripts/soql/account.soql
 create mode 100644 sfdx-project.json
 ```

 ## Let us see the git commit log
```
~/deltatest [main] >git lg2        
* fe12d89 - Sun, 8 Jan 2023 12:59:54 -0500 (2 minutes ago) (HEAD -> main)
            init - mohan-chinnappan-n
```
  

## Let us create  3 classes HelloPeach HelloPear and HelloPineapple
```
~/deltatest [main] >sfdx force:apex:class:create -n HelloPeach -d force-app/main/default/classes         
target dir = /Users/mchinnappan/deltatest/force-app/main/default/classes
   create force-app/main/default/classes/HelloPeach.cls
   create force-app/main/default/classes/HelloPeach.cls-meta.xml

~/deltatest [main] >sfdx force:apex:class:create -n HelloPear -d force-app/main/default/classes
target dir = /Users/mchinnappan/deltatest/force-app/main/default/classes
   create force-app/main/default/classes/HelloPear.cls
   create force-app/main/default/classes/HelloPear.cls-meta.xml

~/deltatest [main] >sfdx force:apex:class:create -n HelloPineapple -d force-app/main/default/classes
target dir = /Users/mchinnappan/deltatest/force-app/main/default/classes
   create force-app/main/default/classes/HelloPineapple.cls
   create force-app/main/default/classes/HelloPineapple.cls-meta.xml
```

## Let us commit this change into git
```
~/deltatest [main] >git add -A
~/deltatest [main] >git commit -m '3 fruit classes added'
[main faa2d86] 3 fruit classes added
 6 files changed, 46 insertions(+)
 create mode 100644 force-app/main/default/classes/HelloPeach.cls
 create mode 100644 force-app/main/default/classes/HelloPeach.cls-meta.xml
 create mode 100644 force-app/main/default/classes/HelloPear.cls
 create mode 100644 force-app/main/default/classes/HelloPear.cls-meta.xml
 create mode 100644 force-app/main/default/classes/HelloPineapple.cls
 create mode 100644 force-app/main/default/classes/HelloPineapple.cls-meta.xml
```

## Let us see the git log for these changes
```
~/deltatest [main] >git lg3                                                                         
* faa2d86 - Sun, 8 Jan 2023 13:08:07 -0500 (12 seconds ago) (committed: Sun, 8 Jan 2023 13:08:07 -0500)  (HEAD -> main)
|           3 fruit classes added
* fe12d89 - Sun, 8 Jan 2023 12:59:54 -0500 (8 minutes ago) (committed: Sun, 8 Jan 2023 12:59:54 -0500) 
            init
```

## Using git diff to view the diff between these 2 SHAs fe12d89 and faa2d86 
```
~/deltatest [main] >git diff fe12d89...faa2d86
```

## Let us remove the HelloPineapple class and commit it into git
``` 
~/deltatest [main] >git add -A                           
~/deltatest [main] >git commit -m 'pineapple fruit classes removed'
[main 171a81a] pineapple fruit classes removed
 2 files changed, 10 deletions(-)
 delete mode 100644 force-app/main/default/classes/HelloPineapple.cls
 delete mode 100644 force-app/main/default/classes/HelloPineapple.cls-meta.xml
 ```

 ## Let us see the git logs
 ```
~/deltatest [main] >git lg3                                        
* 171a81a - Sun, 8 Jan 2023 13:10:14 -0500 (4 seconds ago) (committed: Sun, 8 Jan 2023 13:10:14 -0500)  (HEAD -> main)
|           pineapple fruit classes removed
* faa2d86 - Sun, 8 Jan 2023 13:08:07 -0500 (2 minutes ago) (committed: Sun, 8 Jan 2023 13:08:07 -0500) 
|           3 fruit classes added
* fe12d89 - Sun, 8 Jan 2023 12:59:54 -0500 (10 minutes ago) (committed: Sun, 8 Jan 2023 12:59:54 -0500) 
            init
```

## Let us view the diff between these SHAs faa2d89 and fe12d89 
```
~/deltatest [main] >git diff faa2d86..fe12d89 
~/deltatest [main] >git diff 171a81a..faa2d86
```


## Let us add the new class HelloMango

```

~/deltatest [main] >sfdx force:apex:class:create -n HelloMango -d force-app/main/default/classes
target dir = /Users/mchinnappan/deltatest/force-app/main/default/classes
   create force-app/main/default/classes/HelloMango.cls
   create force-app/main/default/classes/HelloMango.cls-meta.xml
```
## Commit it into git
```
~/deltatest [main] >git add -A
~/deltatest [main] >git commit -m 'Fruit Mango added'
[main 73ea22c] Fruit Mango added
 2 files changed, 566 insertions(+)
 create mode 100644 force-app/main/default/classes/HelloMango.cls
 create mode 100644 force-app/main/default/classes/HelloMango.cls-meta.xml
```

## Let us view the git log 
```
~/deltatest [main] >git lg                      
* 474669c - (64 seconds ago) Fruit Mango added - mohan-chinnappan-n (HEAD -> main)
* 73ea22c - (2 minutes ago) Fruit Mango added - mohan-chinnappan-n
* 171a81a - (17 minutes ago) pineapple fruit classes removed - mohan-chinnappan-n
* faa2d86 - (19 minutes ago) 3 fruit classes added - mohan-chinnappan-n
* fe12d89 - (27 minutes ago) init - mohan-chinnappan-n
```

## Let us run the sgd:source:delta to create package.xml and destructiveChanges.xml

- Install this plugin using
```
sfdx plugins:install sfdx-git-delta

```
- Check the plugin install
```
sfdx plugins
```

```
sfdx-git-delta 5.8.0 <------ from Sébastien Colladon
sfdx-mohanc-plugins 0.0.222 
```


-  This plugin generates the sfdx content in source format and destructive change from two git commits

- Our 'from' SHA is faa2d86  'to' SHA is 'faa2d86' output dir is current folder

```
~/deltatest [main] >sfdx sgd:source:delta -f faa2d86 -t 474669c -d -o .                  
{
  "error": null,
  "output": ".",
  "success": true,
  "warnings": []
}
```

![delta](https://github.com/mohan-chinnappan-n/delta-deployment/raw/main/img/delta-1.png)

### Additions
- Contains the metadata that has been added and changed and that needs to be deployed to the Org
```
~/deltatest [main] >cat package/package.xml 
<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>HelloMango</members>
        <name>ApexClass</name>
    </types>
    <version>55.0</version>
</Package>
```
- Deploy this by
```
sfdx force:source:deploy -x package/package.xml  -c --verbose --testlevel RunLocalTests --loglevel DEBUG
```

### Deletions
- Contains the metadata that has been removed that needs to be deleted from the Org
```
~/deltatest [main] >cat destructiveChanges/destructiveChanges.xml 
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>HelloPineapple</members>
        <name>ApexClass</name>
    </types>
    <version>55.0</version>
</Package>

```

- Perform deletion by

```
sfdx force:mdapi:deploy -d destructiveChanges

```
- Note this package.xml is an empty file required by DX CLI for the deployment of destructive changes 
```
tree destructiveChanges/
destructiveChanges/
├── destructiveChanges.xml
└── package.xml

```


## my .gitconfig

```
[alias]
    lg = lg1
    lg1 = lg1-specific --all
    lg2 = lg2-specific --all
    lg3 = lg3-specific --all
    lg1-specific = log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(auto)%d%C(reset)'
    lg2-specific = log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(auto)%d%C(reset)%n''          %C(white)%s%C(reset) %C(dim white)- %an%C(reset)'
    lg3-specific = log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset) %C(bold cyan)(committed: %cD)%C(reset) %C(auto)%d%C(reset)%n''          %C(white)%s%C(reset)%n''          %C(dim white)- %an <%ae> %C(reset) %C(dim white)(committer: %cn <%ce>)%C(reset)'
```

<a name='refs'></a>
## References

### Delta deployment
- [Salesforce Blog on Delta deployment](https://developer.salesforce.com/blogs/2021/01/optimizing-unpackaged-deployments-using-a-delta-generation-tool)

### Demo of Org query compare tool
<iframe width="800" height="500" src="https://www.youtube.com/embed/3eLkVv9djCg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


