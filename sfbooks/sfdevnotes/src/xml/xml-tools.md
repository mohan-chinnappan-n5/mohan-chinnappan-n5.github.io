# XML tools

## Topics
- [Checks email-Ids in  given folder of xml](#checkEmails)
- [Checks ObjectIds in  given folder of xml](#checkObjectIds)
- [XML Transformer](#xmlTransformer)
- [Using our CLI you can convert that XLF file into TSV](#stf)
- [Checks XML files in given folder is valid or not?](#valid)
- [Find Object.Field from Report Types](#reporttypes)

<a name='checkEmails'></a>
## Checks email-Ids in  given folder of xml

- You can use this tool to find out any hard-corded email ids are in the code


```
sfdx mohanc:xml:email --help
Checks emails in  given folder of xml

USAGE
  $ sfdx mohanc xml email [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -p, --path=<value>                                                                Path to the xml files folder
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for this command invocation

DESCRIPTION
  Checks emails in  given folder of xml

EXAMPLES
      ** Checks emails in  given folder of xml **
    
      sfdx mohanc:xml:email -p <path/to/xml_files>

```

##  Checks ObjectIds in  given folder of xml
- You can use this tool to find out any hard-corded ObjectIds  are in the code


```
sfdx mohanc:xml:objectId --help                           
Checks ObjectIds in  given folder of xml

USAGE
  $ sfdx mohanc xml objectId [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -p, --path=<value>                                                                Path to the xml files folder
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for this command invocation

DESCRIPTION
  Checks ObjectIds in  given folder of xml

EXAMPLES
      ** Checks ObjectIds in  given folder of xml **
    
      sfdx mohanc:xml:objectId -p <path/to/xml_files>
    

```

<a name='checkObjectIds'></a>
## Convert given XML file into JSON

```
Convert given XML file into JSON

USAGE
  $ sfdx mohanc xml xml2json [-i <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -i, --inputfilename=<value>                                                       Data file input in XML format
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for this command invocation

DESCRIPTION
  Convert given XML file into JSON

EXAMPLES
      ** Convert given XML file into JSON **
    
      sfdx mohanc:xml:xml2json -i /tmp/cd.xml 

```


### Demo
```
sfdx mohanc:xml:xml2json -i force-app/main/default/profiles/Admin.profile-meta.xml
bat force-app/main/default/profiles/Admin.profile-meta.xml.json 
───────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: force-app/main/default/profiles/Admin.profile-meta.xml.json
───────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ {
   2   │     "?xml": "",
   3   │     "Profile": {
   4   │         "custom": false,
   5   │         "objectPermissions": [
   6   │             {
   7   │                 "allowCreate": true,
   8   │                 "allowDelete": true,
   9   │                 "allowEdit": true,
  10   │                 "allowRead": true,
  11   │                 "modifyAllRecords": true,
  12   │                 "object": "Account_Plan__c",
  13   │                 "viewAllRecords": true
  14   │             },
  15   │             {
  16   │                 "allowCreate": true,
  17   │                 "allowDelete": true,
  18   │                 "allowEdit": true,
  19   │                 "allowRead": true,
  20   │                 "modifyAllRecords": true,
  21   │                 "object": "Sales_Play__c",
  22   │                 "viewAllRecords": true
  23   │             },
  24   │             {
  25   │                 "allowCreate": true,
  26   │                 "allowDelete": true,
  27   │                 "allowEdit": true,
  28   │                 "allowRead": true,
  29   │                 "modifyAllRecords": true,
  30   │                 "object": "Tree__c",
  31   │                 "viewAllRecords": true
:
```

<a name='xmlTransformer'></a>
## XML Transformer

```
sfdx mohanc:xml:transform --help                                                         
Transform given xml using XSLT

USAGE
  $ sfdx mohanc xml transform [-i <string>] [-t <string>] [-m <string>] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -i, --inputfilename=<value>                                                       Data file in XML format you want to do the transformation
  -m, --mtype=<value>                                                               metadata type: Supported: [package,profile, permset]
  -t, --xsltfilename=<value>                                                        XSLT file to do the transformation
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for this command invocation

DESCRIPTION
  Transform given xml using XSLT

EXAMPLES
      ** Transform given xml using XSLT **
    
      sfdx mohanc:xml:transform -i /tmp/cd.xml -t /tmp/cd.xslt
```
<iframe width="800" height="400" src="https://www.youtube.com/embed/dK2IzpwxO_w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


<a name='stf'></a>
## Using  CLI you can convert the XLF file into TSV

- [stf2tsvHtml.xsl](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/i18n/stf/xsl/stf2tsvHtml.xsl) used here
```
sfdx mohanc:xml:transform -i img/exported-2.xlf -t xsl/stf2tsvHtml.xsl
```

Above command will open a HTML page with TSV file loaded in a textarea. You can cut and paste the content of the textarea to create a TSV file.


![Xliff2tsv](https://raw.githubusercontent.com/mohan-chinnappan-n/cli-dx/master/i18n/stf/img/xliff2tsv.png)


- If you want to view the XLIFF file as a TSV page:

```
sfdx mohanc:xml:transform -i img/exported-2.xlf -t xsl/stf2tsv.xsl
=== Writing the output into file : img/exported-2.xlf.out.xml.html ===

```
![xmliff2tsv](https://raw.githubusercontent.com/mohan-chinnappan-n/cli-dx/master/i18n/stf/img/xliff2tsv2.png)




- If you want to view the XLIFF file as a HTML page:

```
sfdx mohanc:xml:transform -i img/exported-2.xlf -t xsl/stf2html.xsl
=== Writing the output into file : img/exported-2.xlf.out.xml.html ===

```
![xmliff2html](https://raw.githubusercontent.com/mohan-chinnappan-n/cli-dx/master/i18n/stf/img/xliff2html.png)

----

<a name='valid'></a>
## Checks XML files in given folder is valid or not? 
```
sfdx mohanc:xml:validate -p force-app/main/default/profiles/ --help
Checks given folder of xml is valid or not 

USAGE
  $ sfdx mohanc xml validate -p <string> [-i] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -i, --invalid                                                                     Print only invalid
  -p, --path=<value>                                                                (required) Path to the xml files folder
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for this command invocation

DESCRIPTION
  Checks given folder of xml is valid or not

EXAMPLES
      ** Checks given folder of xml is valid or not  **
    
      sfdx mohanc:xml:validate -p <path/to/xml_files> -i
      - lists out xml files in the given path are valid or not 
      -i flag provides only invalid files
   
```
### Demo
- You can redirect to a TSV file and view in a spreadsheet program

```
sfdx mohanc:xml:validate -p force-app/main/default/profiles/
force-app/main/default/profiles/Admin.profile-meta.xml	Admin.profile-meta.xml	true
force-app/main/default/profiles/Analytics Cloud Integration User.profile-meta.xml	Analytics Cloud Integration User.profile-meta.xml	true
force-app/main/default/profiles/Analytics Cloud Security User.profile-meta.xml	Analytics Cloud Security User.profile-meta.xml	true
force-app/main/default/profiles/Authenticated Website.profile-meta.xml	Authenticated Website.profile-meta.xml	true
force-app/main/default/profiles/Chatter External User.profile-meta.xml	Chatter External User.profile-meta.xml	true
force-app/main/default/profiles/Chatter Free User.profile-meta.xml	Chatter Free User.profile-meta.xml	true
force-app/main/default/profiles/Chatter Moderator User.profile-meta.xml	Chatter Moderator User.profile-meta.xml	true
force-app/main/default/profiles/ContractManager.profile-meta.xml	ContractManager.profile-meta.xml	true
force-app/main/default/profiles/Cross Org Data Proxy User.profile-meta.xml	Cross Org Data Proxy User.profile-meta.xml	true
force-app/main/default/profiles/Custom%3A Marketing Profile.profile-meta.xml	Custom%3A Marketing Profile.profile-meta.xml	true
force-app/main/default/profiles/Custom%3A Sales Profile.profile-meta.xml	Custom%3A Sales Profile.profile-meta.xml	true
force-app/main/default/profiles/Custom%3A Support Profile.profile-meta.xml	Custom%3A Support Profile.profile-meta.xml	true
force-app/main/default/profiles/Customer Community Login User.profile-meta.xml	Customer Community Login User.profile-meta.xml	true
force-app/main/default/profiles/Customer Community Plus Login User.profile-meta.xml	Customer Community Plus Login User.profile-meta.xml	true
force-app/main/default/profiles/Customer Community Plus User.profile-meta.xml	Customer Community Plus User.profile-meta.xml	true
force-app/main/default/profiles/Customer Community User.profile-meta.xml	Customer Community User.profile-meta.xml	true
force-app/main/default/profiles/Customer Portal Manager Custom.profile-meta.xml	Customer Portal Manager Custom.profile-meta.xml	true
force-app/main/default/profiles/Customer Portal Manager Standard.profile-meta.xml	Customer Portal Manager Standard.profile-meta.xml	true
force-app/main/default/profiles/External Apps Login User.profile-meta.xml	External Apps Login User.profile-meta.xml	true
force-app/main/default/profiles/External Identity User.profile-meta.xml	External Identity User.profile-meta.xml	true
force-app/main/default/profiles/Force%2Ecom - App Subscription User.profile-meta.xml	Force%2Ecom - App Subscription User.profile-meta.xml	true
force-app/main/default/profiles/Force%2Ecom - Free User.profile-meta.xml	Force%2Ecom - Free User.profile-meta.xml	true
force-app/main/default/profiles/Gold Partner User.profile-meta.xml	Gold Partner User.profile-meta.xml	true
force-app/main/default/profiles/Guest License User.profile-meta.xml	Guest License User.profile-meta.xml	true
force-app/main/default/profiles/High Volume Customer Portal User.profile-meta.xml	High Volume Customer Portal User.profile-meta.xml	true
force-app/main/default/profiles/HighVolumePortal.profile-meta.xml	HighVolumePortal.profile-meta.xml	true
force-app/main/default/profiles/Identity User.profile-meta.xml	Identity User.profile-meta.xml	true
force-app/main/default/profiles/MarketingProfile.profile-meta.xml	MarketingProfile.profile-meta.xml	true
force-app/main/default/profiles/Minimum Access - Salesforce.profile-meta.xml	Minimum Access - Salesforce.profile-meta.xml	true
force-app/main/default/profiles/mohanc Profile.profile-meta.xml	mohanc Profile.profile-meta.xml	true
force-app/main/default/profiles/Partner App Subscription User.profile-meta.xml	Partner App Subscription User.profile-meta.xml	true
force-app/main/default/profiles/Partner Community Login User.profile-meta.xml	Partner Community Login User.profile-meta.xml	true
force-app/main/default/profiles/Partner Community User.profile-meta.xml	Partner Community User.profile-meta.xml	true
force-app/main/default/profiles/PlatformPortal.profile-meta.xml	PlatformPortal.profile-meta.xml	true
force-app/main/default/profiles/Read Only.profile-meta.xml	Read Only.profile-meta.xml	true
force-app/main/default/profiles/Silver Partner User.profile-meta.xml	Silver Partner User.profile-meta.xml	true
force-app/main/default/profiles/SolutionManager.profile-meta.xml	SolutionManager.profile-meta.xml	true
force-app/main/default/profiles/Standard.profile-meta.xml	Standard.profile-meta.xml	true
force-app/main/default/profiles/StandardAul.profile-meta.xml	StandardAul.profile-meta.xml	true
force-app/main/default/profiles/Work%2Ecom Only User.profile-meta.xml	Work%2Ecom Only User.profile-meta.xml	true
```

<a name='reporttypes'></a>
## Find Object.Field from Report Types
```

# get the json file for the given xml file
sfdx mohanc:xml:xml2json -i  MyReport.reportType-meta.xml
# get the Object.Fields from the the reports
sfdx mohanc:data:jq  -i MyReport.reportType-meta.xml.json -f '.ReportType.sections[].columns[] | .table + "." + .field'

"Account.Type"
"Account.RecordType"
"Account.Parent"
"Account.BillingAddress"
"Account.BillingStreet"
"Account.BillingCity"
"Account.BillingState"
"Account.BillingPostalCode"
"Account.BillingCountry"
"Account.BillingStateCode"
"Account.BillingCountryCode"
"Account.BillingLatitude"
"Account.BillingLongitude"
"Account.BillingGeocodeAccuracy"
...

```

