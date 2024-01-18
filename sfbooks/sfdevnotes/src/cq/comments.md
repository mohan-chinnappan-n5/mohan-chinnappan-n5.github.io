# Comments

## Topics
- [Standards for Apex Code Comments](#apexcomments)
- [Tools to check for Apex Code Comments](#tools)

----

<a name='apexcomments'></a>
## Apex Code Comments

## Class level

| token | description |
|-------|-------------|
| @author | the author of the class |
| @date | the date the class was first implemented |
| @group | a group to display this class under, in the menu hierarchy|
| @group-content | a relative path to a static html file that provides content about the group|
| @description | one or more lines that provide an overview of the class|

```
/*******************************************************************************************
* @name         FruitService 
* @author       FirstName LastName <auth@email.com>
* @date         01/02/2022
* @group        Fruit Services
* @description  This class contains all methods related to managing Fruits in Salesforce.  
*******************************************************************************************/

/* 
MODIFICATION LOG
* Version          Developer          Date               Description
*-------------------------------------------------------------------------------------------
*  1.0              FullName          01/02/2022          Initial Creation                                                      
******************************************************************************************
*/
```

## Method level
| token | description |
|-------|-------------|
| @description | one or more lines that provide an overview of the method|
| @param *param name* | a description of what the parameter does|
| @return | a description of the return value from the method|
| @example | Example code usage. This will be wrapped in <code> tags to preserve whitespace|

```
/**************************************************************************************
* @description  This method finds count of the given Fruit  and returns it
* @param		String - name - Fruit name
* @return       Integer - Value retrieved . 
* @example     
* FruitService.getFruitsCount('mango')
**************************************************************************************/ 
public static IntegerI(String name) {
   // ... 
   
}
```


<a name='tools'></a>


## Tools to check for the comments in the repo
```
Check for comments in given folder with  Apex classes

USAGE
  $ sfdx mohanc:regex:apex:checkComments2 [-d <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --directoryname=directoryname                                                 Directory containing Apex Class
                                                                                    files

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE


    ** Check for comments in given folder with  Apex classes **
  
    $ sfdx  mohanc:regex:apex:checkComments2 -d <directory containing source code>
  

```
- You can redirect the output to a file like this to open in your spreadsheet program

```
sfdx mohanc:regex:apex:checkComments2 -d ascent-develop/src/sales/channel-fundamentals/main/default/classes > REPO_comments2-status-jul-12-2022.csv

```

## References
- [ApexDoc](https://github.com/SalesforceFoundation/ApexDoc/blob/master/README.md)