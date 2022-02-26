### **Topics**

- [Goals](#Goals)
- [Security Health Check](#Security_Health_Check)
- [Clickjacking](#Clickjacking)
- [Phishing](#Phishing)
- [Browser fingerprint](#Browser_fingerprint) 
- [Session Hijacking Event Store](#Session_Hijacking_Event_Store)
- [XSS](#XSS)
- **Tools**
    - [Health Check](#Health_Check)
    - [User Audit](#User_Audit)
    - [Org Viz](#org_viz)
    - [Apex sharing check](#Apex_sharing_check)
    - [Check Profile Permissions](#Check_Profile_Permissions)
    - [Check PermissionSet Permissions](#Check_PermissionSet_Permissions)
    - [Guest Profile permissions](#Guest_Profile_permissions)
    - [Role Hierarchy](#Role_Hierarchy)
    - [Org wide settings](#owd)
    - [Experience Cloud](#ec)
    - [Sharing Debugger](#sd)
    - [Optimizer](#Optimizer)
    - [Real-Time Event Monitoring ](#em)
    - [Field Audit Trail](#fat)
    - [Org Metric](#orgmetric)
- [Resources](#resources)

# Goals
- The Salesforce security features enable you to empower your users to do their jobs safely and efficiently

- Implement security controls that you think are appropriate for the sensitivity of your data. 

- Protect your data from unauthorized access from outside your company and from inappropriate usage by your users.

<a name="Security Health Check"></a>

# Security Health Check
|Item|Section|Standard Value|
|---|---|---|
|Enable clickjack protection for customer Visualforce pages with standard headers|Session settings|Enabled|
|Enable clickjack protection for customer Visualforce pages with headers disabled|Session setting|Enabled|
|Require HttpOnly attribute|Session setting|Enabled|
|Maximum invalid login attempts|Password Policies|3|
|Expired Certificate|Certificate and Key Management|0|
|Lock sessions to the domain in which they were first used|Session Settings|Enabled|

![Fixing security issues](img/fix-Security-risks-1.png)

<a name="Clickjacking"></a>
# Clickjacking (click + hijacking)
```
Tricking a user into clicking on something different from what the user perceives,
 thus potentially revealing confidential information or allowing others 
 to take control of their computer while clicking on seemingly innocuous objects, 
 including web pages.

 In a clickjacking attack, the user is presented with a false interface, 
 where their input is applied to something they cannot see
 like transparent div on the top of the iframe (what the user sees) and high z-index
 and wrap that div with malicious link

 - when the user clicks, the user will taken to the malicious link
```
![Clickjaking](img/clickjacking-2.png)

## 4 levels in community cloud

- ![4 Levels](img/ec-security-privacy.png)
- 1. Allow framing by any page (**no protection**)
- 2. Allows framing of your Visualforce site pages by pages on your external domains that are added to the *Trusted Domains for Inline Frames list*. 
- **3.** Allow framing by the **same origin** only (**recommended**): The default level for Experience Cloud sites. 
- 4. Don’t allow framing by any page (**most protection**): The most secure level
    - But for Salesforce Tabs + Visualforce sites, it can cause certain pages to appear **as blank pages**. 
    - To avoid this issue, **use the default setting instead**.
![Exp cloud settings](img/ec-clickjack-1.png)

<a name="Phishing"></a>
# Phishing
- Technique that attempts to acquire sensitive information, such as usernames, passwords, and credit card details, by masquerading (pretend to be someone one is not) as a trustworthy person or entity. 
- Can occur via:
    - email, text messaging, voice calls, and other avenues.
- With a goal to:
    - direct targets (users) to click a link and enter valuable information or to open an attachment with the goal of downloading malware onto the target’s device.
## Malware 
- is a software designed to infiltrate or damage a computer system **without the owner's informed consent**.

# Cross site scripting (XSS)
-  Attacker can insert unauthorized JavaScript, VBScript, HTML, or other **active content** into a web page viewed by other users. 
- A malicious script inserted into a page in this manner can hijack the **user’s session, submit unauthorized transactions as the user**, steal confidential information, or simply deface the page.

- Cross-site scripting works by manipulating a vulnerable web site so that it returns malicious JavaScript to users. When the **malicious code executes inside a victim's browser**, the attacker can fully compromise their interaction with the application.


```
https://insecure-website.com/status?message=All+is+well.
- Renders:
<p>Status: All is well.</p>

```

- Attacker passes script code via message parameter here:
```
https://insecure-website.com/status?message=<script>/*+Bad+stuff+here...+*/</script>

- Renders the script doing bad stuff:
<p>Status: <script>/* Bad stuff here... */</script></p>

```

- Refer
[WEBSITE SECURITY](https://mohan-chinnappan-n.github.io/sfdc/website-security.html#/home)

## DOM based XSS
```
// get search data entered by the user via search input field
const search = document.getElementById('search').value;

const results = document.getElementById('results');
// whatever user put in the search element is render here in results element
results.innerHTML = `You searched for: ${search}`; 

// if the attacker entered bad stuff in the search box, it will render
//  the bad stuff in the result element
 You searched for: <img src=1 onerror='/* Bad stuff here... */'>

 // PREVENT it by encoding it


```
- ![prevent XSS](img/enocde-2.png)

## Node.js
```
const xssFilters = require('xss-filters');
const unsafeFirstNname = req.query.firstName;
const safeFirstName = xssFilters.inHTMLData(unsafeFirstName);

```

- [Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)

## Prevention
- Filter input on arrival. At the point where user input is received, filter as strictly as possible based on what is expected or valid input.

- Encode data on output
    -  If your page is processing GET parameter say userInput make sure that parameter is html encoded  before using in your page.


# SQL and SOQL Injection

- Exploiting query parameters to execute arbitrary SQL instructions is called SQL Injection 

```

// code with possible SQL Injection attack 
router.get('/email', (req, res) => {
  db.query('SELECT email FROM users WHERE id = ' + req.query.id);
    .then((record) => {
      // do stuff
      res.send(record[0]);
    })
});

```

```
//  parameterized queries would suffice to prevent the SQL Injection
router.get('/email', (req, res) => {
  db.query('SELECT email FROM users WHERE id = $1', req.query.id);
    .then((record) => {
      // do stuff
      res.send(record[0]);
    })
})

// refer: https://checkmarx.gitbooks.io/js-scp/content/

```

- Following code is vulnerable to SOQL Injection: if we get value of name from Visualforce page

```java
public class SOQLController {
    public String name {
        get { return name;}
        set { name = value;}
    } 
    public PageReference query() {
        String qryString = 'SELECT Id FROM Contact WHERE ' +
            '(IsDeleted = false and Name like \'%' + name + '%\')'; // <--------
        List<Contact> queryResult = Database.query(qryString);
        System.debug('query result is ' + queryResult);
        return null;
    }
}
```

- Used binding to take care of the SOQL inject as shown below:

```java
public class SOQLController { 
    public String name { 
        get { return name;} 
        set { name = value;} 
    } 
    public PageReference query() { 
        String queryName = '%' + name + '%';
        List<Contact> queryResult = [SELECT Id FROM Contact WHERE 
           (IsDeleted = false and Name like :queryName)]; //<---- binding variable is used here
        System.debug('query result is ' + queryResult);
        return null; 
    } 
}
```

- Use the following CLI command for checking possible SOQL injection
```
sfdx mohanc:security:apex -u  mohan.chinnappan.n_ea2@gmail.com

```
```
=== Possible SOQL Injections ===
 
```

```json
[
{
    name: 'SoftphoneContactSearchController',
    SOQLInject: true,
    match: [
      "SELECT Id, Phone, Name, Title, Account.Name FROM Contact WHERE (id = :name OR Name LIKE :('%' + name + '%') OR firstname LIKE :('%' + name + '%') OR lastname LIKE :('%' + name + '%') OR phone LIKE :('%' + name + '%')) LIMIT 10]){              contactList.add(contact);          }          return JSON.serialize(contactList);      }  }"
    ]
  },
  {
    name: 'SOQLControllerInjection',
    SOQLInject: true,
    match: [
      "SELECT Id FROM Contact WHERE ' +              '(IsDeleted = false and Name like \\'%' + name + '%\\')';          List<Contact> queryResult = Database.query(qryString);          System.debug('query result is ' + queryResult);          return null;      }  }"
    ]
  }
]
```


<a name="Browser_fingerprint"></a>
# Browser fingerprint
- A browser fingerprint is a **collection of features that together identify a device**.
- Salesforce uses these features to build a model of the user’s original browser fingerprint when they logged in. 
- Salesforce uses this model to detect whether a user’s session was hijacked.

|Feature|
|---|
|window|
|userAgent|
|timestamp|
|screen|
|plugins|
|originApp|
|webSockets|
|sessionStorage|
|platform|
|indexedDb|
|ipAddress|

<a name="Session_Hijacking_Event_Store"></a>
# Session Hijacking Event Store 

 
- SessionHijackingEvent and its storage equivalent SessionHijackingEventStore track **when unauthorized users gain ownership of a Salesforce user’s session with a stolen session identifier**. 
- To detect such an event, Salesforce evaluates how significantly a user’s current browser **fingerprint diverges from the previously known fingerprint**. 
- Salesforce uses a probabilistically inferred **significance of change**.

![Session Hijacking](img/SessionHijackingEventStore.png)

<a name="Health_Check"></a>
# Health Check

- [Use Health Check to Scan Your Security Configurations](https://trailhead.salesforce.com/en/content/learn/modules/security_basics/security_basics_healthcheck)
- [Video: Learn About Security Health Check (Lightning Experience) | Salesforce](https://www.youtube.com/watch?v=jC0ciHZrkh0)

<a name="User_Audit"></a>
# User Audit

- Sharing Data Model Interactive 
[![Sharing Data Model Interactive](https://mohan-chinnappan-n.github.io/sfdc/fs-cloud/img/sharing.png))](https://mohan-chinnappan-n.github.io/sfdc/fs-cloud/model-sfdc.html)


![User ERD](img/User-erd.svg)

- [Admin Best Practices: Remove Security Risks From Your Org With a User Audit](https://trailhead.salesforce.com/live/videos/a2r3k000001n2jh/admin-best-practices-remove-security-risks-from-your-org-with-a-user-audit/)


|Step|Details|
|---|---|
|Maintain|Maintain an accurate user roster and ensure the **principle of least privileges** applied to user permissions|
|Review|Correctly Configure user access within the org  using **permission sets, permission set groups, FLS**|
|Align|Protect access to a Salesforce org by implementing security controls such as **MFA, SSO and Login IP Ranges**|
|Analyze|Gain visibility into the security of an org using tools like: **Health Check, Optimizer, Security Center**|


|Bad Practice|Best Practice|
|---|---|
|Allowing users (or admins) to share logins| Give each user their own login|
|Users have permissions to see and do more than they need to do their jobs |Ensure the correct level of access as org changes happen, or when employees join/leave the company|
|Granting admin access for all users|Grant admin access to the smallest number of users possible (typically 1-5, depending on the size of your company)|
|Allowing users that have left the company to remain active for a period of time after leaving|Deactivate users in a timely manner after departure |
|Not reviewing privileges on a regular basis | Set time aside quarterly or bi-annually to review and reevaluate user privileges, part of release cycle|

|Checklist|
|---|
|Review user list and last login date|
|Deactivate users who no longer need access, do not rename users|
|Remove unused profiles and permission sets/permission set groups per Optimizer results|
|Align Salesforce access levels and job functions, do not align directly to the org chart|

- Active users who haven't logged in within 60 days

```
SELECT Name,
Username,
IsActive,
UserRole.Name,
Profile.Name,
LastLoginDate
FROM User
WHERE 
  IsActive = true AND
  LastLoginDate < LAST_N_DAYS:60 
```
![not logged in last 90 days](img/userNotloggedIn-90-days.png)

|User Audit Action Items|
|---|
|Custom profiles that have system admin privileges|
|Active users who haven't logged in within 60 days|
|Unused roles, profiles, permission sets|
|Setup Audit Trail|
|A large number (5+) of system admin users or users utilizing admin permissions?|
|Re-run Salesforce Optimizer for a fresh report to track progress|

- Unused Profiles
```
SELECT 
Id,
Name 
FROM Profile
 WHERE Id NOT IN (SELECT ProfileId FROM User)


```
![Unused Profile](img/UnUsedProfile.png)

- Unused PermissionSets
```sql
SELECT 
Id,
Name,
ProfileId,
Profile.Name
FROM PermissionSet
 WHERE ProfileId NOT IN (SELECT Id FROM Profile)


```
![unused Permset](img/unusedPermSet.png)

- Used PermissionSets
```
SELECT 
Id,
Name,
ProfileId,
Profile.Name
FROM PermissionSet
 WHERE ProfileId  IN (SELECT Id FROM Profile)


```
![Used Permset](img/usedPermSet.png)

- Unused Roles

![UserRole ERD](https://mohan-chinnappan-n.github.io/sfdc/fs-cloud/img/UserRole.svg)

```sql
SELECT Name 
FROM UserRole
WHERE Id NOT IN (SELECT UserRoleId FROM User)
```

- Users with System Admin Profile
```sql
SELECT Id FROM User 
WHERE Profile.Name = 'System Administrator'
```
![sys admin profile users](img/sysAdmin-Users.png)


|Preparing for, Communicating and Managing Security Changes|
|---|
|Perform your user audit|
|Document proposed changes and security protocols|
|Present findings to leadership; get executive sponsorship|
|Create a plan to update user permissions (build in testing if necessary)|
|Communicate the changes (and then communicate again!) to users|
|Make sure you're aware of ALL the implications of changing user permissions/ privileges before making updates|

![5 security habits](https://d3nqfz2gm66yqg.cloudfront.net/images/20210808202049/security_habits.png)


## Apps
- [Permission Helper App](https://appexchange.salesforce.com/appxListingDetail?listingId=a0N3A00000FeF99UAF)
- [Admins SECURITY ](https://admin.salesforce.com/security)
    - [5 Security Habits That Will Help Your Admin Career](https://admin.salesforce.com/blog/2021/5-security-habits-that-will-help-your-admin-career)
    - [Admin Best Practices: Security ](https://trailhead.salesforce.com/live/videos/a2r3k000001WFIi/admin-best-practices-security/)


<a name="org_viz"></a>
# Org visualization tool
```
Visualize the Org

USAGE
  $ sfdx mohanc:org:viz

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target 
                                                  org

  --apiversion=apiversion                         override the api version used for api requests made by this 
                                                  command

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE

              Visualize the org
              sfdx mohanc:org:viz

      

```

## Example Usage
```
sfdx mohanc:org:viz -u  mohan.chinnappan.n_ea2@gmail.com 

=== Working on getOrgData
=== Working on getOrgLimits
=== Working on getCount:ApexClass
=== Working on getCount:ApexPage
=== Working on getCount:ConnectedApplication
=== Working on getCount:CustomPermission
=== Working on getCount:ExternalDataSource
=== Working on getCount:FieldPermissions
=== Working on getCount:FieldSecurityClassification
=== Working on getCount:Group
=== Working on getCount:GroupMember
=== Working on getCount:NamedCredential
=== Working on getCount:ObjectPermissions
=== Working on getCount:PackageLicense
=== Working on getCount:PermissionSet
=== Working on getCount:PermissionSetAssignment
=== Working on getCount:PermissionSetGroup
=== Working on getCount:PermissionSetLicense
=== Working on getCount:Profile
=== Working on getCount:QueueSobject
=== Working on getCount:SetupAssistantStep
=== Working on getCount:SetupEntityAccess
=== Working on getCount:User
=== Working on getCount:UserLicense
=== Working on getCount:UserPackageLicense
=== Working on getCount:UserRole
=== Working on getCount:Account
=== Working on getCount:AccountContactRole
=== Working on getCount:Asset
=== Working on getCount:Campaign
=== Working on getCount:CampaignMember
=== Working on getCount:Case
=== Working on getCount:CaseStatus
=== Working on getCount:Contact
=== Working on getCount:Contract
=== Working on getCount:ContractContactRole
=== Working on getCount:Lead
=== Working on getCount:Opportunity
=== Working on getCount:OpportunityCompetitor
=== Working on getCount:OpportunityContactRole
=== Working on getCount:OpportunityStage
=== Working on getCount:Order
=== Working on getCount:Partner
=== Working on getCount:PartnerRole
=== Working on getCount:Account
=== Working on getCount:Case
=== Working on getCount:CaseComment
=== Working on getCount:CaseHistory
=== Working on getCount:CaseSolution
=== Working on getCount:Contact
=== Working on getCount:Solution
=== Working on getPackageInfo
=== Working on EntityDefinitionSummary:Account
=== Working on EntityDefinitionSummary:Contact
=== Working on EntityDefinitionSummary:AccountContactRole
=== Working on EntityDefinitionSummary:Opportunity
=== Working on EntityDefinitionSummary:OpportunityContactRole
=== Working on EntityDefinitionSummary:OpportunityCompetitor
=== Working on EntityDefinitionSummary:Lead
=== Working on EntityDefinitionSummary:Case
=== Working on EntityDefinitionSummary:Campaign
=== Working on EntityDefinitionSummary:CampaignMember
=== Working on EntityDefinitionSummary:Asset
=== Working on EntityDefinitionSummary:Contract
=== Working on EntityDefinitionSummary:ContractContactRole
=== Working on EntityDefinitionSummary:Order
=== Working on getApexCodeCoverage
=== Working on getBusinessProcess
=== Working on getCertificate
=== Working on CspTrustedSite
=== Writing Org JSON in file Org.json ...
=== Writing visualization in file Org.svg ...
Visualization done. "open  Org.svg" in Chrome Browser to view the Visualization.

```
- [Full view](https://raw.githubusercontent.com/mohan-chinnappan-n5/mohan-chinnappan-n5.github.io/master/sf-security/img/Org.svg)
![Sample Viz](img/Org.svg)


<a name="Apex_sharing_check"></a>
# Apex sharing check

![ApexClass ERD](img/ApexClass-erd.svg)

- Use the following CLI command to find out the Apex Classes ```with and without sharing ```
```
sfdx mohanc:security:apex -u  mohan.chinnappan.n_ea2@gmail.com 
```

```json
{
    "withSharing": [
        {
            "name": "ClassDiagramCreatorCtrl",
            "withSharing": true
        },
        {
            "name": "MultiselectController",
            "withSharing": true
        },
        {
            "name": "ERDCreatorCtrl",
            "withSharing": true
        },
        ...
    ],
    "withoutSharing": [
        {
            "name": "PlantUMLClassDiagram",
            "withSharing": false
        },
        {
            "name": "PlantUMLERDiagram",
            "withSharing": false
        },
        {
            "name": "SelectOptionSorter",
            "withSharing": false
        },
        {
            "name": "CodeMetrics",
            "withSharing": false
        },
        {
            "name": "ApexClassForTests",
            "withSharing": false
        },
        {
            "name": "ApexParser",
            "withSharing": false
        },
        {
            "name": "ClassDiagramCreatorCtrl",
            "withSharing": false
        },
        {
            "name": "CommunitiesSelfRegController",
            "withSharing": false
        },
        {
            "name": "AsyncExecutionExample",
            "withSharing": false
        },
        
        ...
         
         
    ]
}


```

<a name="Check_Profile_Permissions"></a>
# Check Profile Permissions
![Permission ERD](https://mohan-chinnappan-n.github.io/sfdc/fs-cloud/img/Profile.svg)


```
sfdx mohanc:security:profile -p 'Customer Community Login User' -u  mohan.chinnappan.n_ea2@gmail.com
```

```json
{
    "totalSize": 1,
    "done": true,
    "records": [
        {
            "attributes": {
                "type": "Profile",
                "url": "/services/data/v54.0/sobjects/Profile/00e3h000001kqJPAAY"
            },
            "Id": "00e3h000001kqJPAAY",
            "Name": "Customer Community Login User",
             "UserLicense": {
                "attributes": {
                    "type": "UserLicense",
                    "url": "/services/data/v54.0/sobjects/UserLicense/1003h000001Gef6AAC"
                },
                "Name": "Customer Community Login"
            },
            "PermissionsEmailSingle": false,
            "PermissionsEmailMass": false,
            "PermissionsEditTask": false,
            "PermissionsEditEvent": false,
            "PermissionsExportReport": false,
            "PermissionsImportPersonal": false,
            "PermissionsDataExport": false,
            "PermissionsManageUsers": false,
            "PermissionsEditPublicFilters": false,
            "PermissionsEditPublicTemplates": false,
            "PermissionsModifyAllData": false,
            "PermissionsManageCases": false,
            "PermissionsMassInlineEdit": false,
            "PermissionsManageSolutions": false,
            "PermissionsCustomizeApplication": false,
            "PermissionsEditReadonlyFields": false,
            "PermissionsRunReports": false,
            "PermissionsViewSetup": false,
            "PermissionsTransferAnyEntity": false,
            "PermissionsNewReportBuilder": false,
            "PermissionsActivateContract": false,
            "PermissionsActivateOrder": false,
            "PermissionsImportLeads": false,
            "PermissionsManageLeads": false,
            "PermissionsTransferAnyLead": false,
            "PermissionsViewAllData": false,
            "PermissionsEditPublicDocuments": false,
            "PermissionsViewEncryptedData": false,
            "PermissionsEditBrandTemplates": false,
            "PermissionsEditHtmlTemplates": false,
            "PermissionsChatterInternalUser": false,
            "PermissionsDeleteActivatedContract": false,
            "PermissionsChatterInviteExternalUsers": false,
            "PermissionsSendSitRequests": false,
            "PermissionsManageRemoteAccess": false,
            "PermissionsCanUseNewDashboardBuilder": false,
            "PermissionsManageCategories": false,
            "PermissionsConvertLeads": false,
            "PermissionsPasswordNeverExpires": false,
            "PermissionsUseTeamReassignWizards": false,
            "PermissionsEditActivatedOrders": false,
            "PermissionsInstallMultiforce": false,
            "PermissionsPublishMultiforce": false,
            "PermissionsChatterOwnGroups": true,
            "PermissionsEditOppLineItemUnitPrice": false,
            "PermissionsCreateMultiforce": false,
            "PermissionsBulkApiHardDelete": false,
            "PermissionsSolutionImport": false,
            "PermissionsManageCallCenters": false,
            "PermissionsManageSynonyms": false,
            "PermissionsViewContent": false,
            "PermissionsManageEmailClientConfig": false,
            "PermissionsEnableNotifications": true,
            "PermissionsManageDataIntegrations": false,
            "PermissionsDistributeFromPersWksp": false,
            "PermissionsViewDataCategories": false,
            "PermissionsManageDataCategories": false,
            "PermissionsAuthorApex": false,
            "PermissionsManageMobile": false,
            "PermissionsApiEnabled": false,
            "PermissionsManageCustomReportTypes": false,
            "PermissionsEditCaseComments": false,
            "PermissionsTransferAnyCase": false,
            "PermissionsContentAdministrator": false,
            "PermissionsCreateWorkspaces": false,
            "PermissionsManageContentPermissions": false,
            "PermissionsManageContentProperties": false,
            "PermissionsManageContentTypes": false,
            "PermissionsManageExchangeConfig": false,
            "PermissionsManageAnalyticSnapshots": false,
            "PermissionsScheduleReports": false,
            "PermissionsManageBusinessHourHolidays": false,
            "PermissionsManageDynamicDashboards": false,
            "PermissionsCustomSidebarOnAllPages": false,
            "PermissionsManageInteraction": false,
            "PermissionsViewMyTeamsDashboards": false,
            "PermissionsModerateChatter": false,
            "PermissionsResetPasswords": false,
            "PermissionsFlowUFLRequired": false,
            "PermissionsCanInsertFeedSystemFields": false,
            "PermissionsActivitiesAccess": true,
            "PermissionsEmailTemplateManagement": true,
            "PermissionsEmailAdministration": true,
            "PermissionsManageChatterMessages": false,
            "PermissionsAllowEmailIC": false,
            "PermissionsChatterFileLink": false,
            "PermissionsForceTwoFactor": false,     
            "PermissionsViewEventLogFiles": false,
            "PermissionsManageNetworks": false,
            "PermissionsManageAuthProviders": false,
            "PermissionsRunFlow": true,
            "PermissionsCreateCustomizeDashboards": false,
            "PermissionsCreateDashboardFolders": false,
            "PermissionsViewPublicDashboards": false,
            "PermissionsManageDashbdsInPubFolders": false,
            "PermissionsCreateCustomizeReports": false,
            "PermissionsCreateReportFolders": false,
            "PermissionsViewPublicReports": false,
            "PermissionsManageReportsInPubFolders": false,
            "PermissionsEditMyDashboards": false,
            "PermissionsEditMyReports": false,
            "PermissionsViewAllUsers": false,
            "PermissionsConnectOrgToEnvironmentHub": false,
            "PermissionsCreateCustomizeFilters": false,
            "PermissionsContentHubUser": false,
            "PermissionsGovernNetworks": false,
            "PermissionsSalesConsole": false,
            "PermissionsTwoFactorApi": false,
            "PermissionsDeleteTopics": false,
            "PermissionsEditTopics": false,
            "PermissionsCreateTopics": true,
            "PermissionsAssignTopics": true,
            "PermissionsIdentityEnabled": false,
            "PermissionsIdentityConnect": false,
            "PermissionsContentWorkspaces": false,
            "PermissionsCustomMobileAppsAccess": false,
            "PermissionsViewHelpLink": false,
            "PermissionsManageProfilesPermissionsets": false,
            "PermissionsAssignPermissionSets": false,
            "PermissionsManageRoles": false,
            "PermissionsManageIpAddresses": false,
            "PermissionsManageSharing": false,
            "PermissionsManageInternalUsers": false,
            "PermissionsManagePasswordPolicies": false,
            "PermissionsManageLoginAccessPolicies": false,
            "PermissionsManageCustomPermissions": false,
            "PermissionsCanVerifyComment": false,
            "PermissionsManageUnlistedGroups": false,
            "PermissionsInsightsAppDashboardEditor": false,
            "PermissionsManageTwoFactor": false,
            "PermissionsInsightsAppUser": false,
            "PermissionsInsightsAppAdmin": false,
            "PermissionsInsightsAppEltEditor": false,
            "PermissionsInsightsAppUploadUser": false,
            "PermissionsInsightsCreateApplication": false,
            "PermissionsLightningExperienceUser": false,
            "PermissionsConfigCustomRecs": false,
            "PermissionsSubmitMacrosAllowed": false,
            "PermissionsBulkMacrosAllowed": false,
            "PermissionsManageSessionPermissionSets": false,
            "PermissionsManageTemplatedApp": false,
            "PermissionsUseTemplatedApp": false,
            "PermissionsSendAnnouncementEmails": false,
            "PermissionsChatterEditOwnPost": false,
            "PermissionsChatterEditOwnRecordPost": false,
            "PermissionsWaveTabularDownload": false,
            "PermissionsImportCustomObjects": false,
            "PermissionsDelegatedTwoFactor": false,
            "PermissionsChatterComposeUiCodesnippet": false,
            "PermissionsSelectFilesFromSalesforce": true,
            "PermissionsModerateNetworkUsers": false,
            "PermissionsMergeTopics": false,
            "PermissionsSubscribeToLightningReports": false,
            "PermissionsManagePvtRptsAndDashbds": false,
            "PermissionsAllowLightningLogin": false,
            "PermissionsCampaignInfluence2": false,
            "PermissionsViewDataAssessment": false,
            "PermissionsRemoveDirectMessageMembers": true,
            "PermissionsCanApproveFeedPost": false,
            "PermissionsAddDirectMessageMembers": true,
            "PermissionsAllowViewEditConvertedLeads": false,
            "PermissionsShowCompanyNameAsUserBadge": true,
            "PermissionsAccessCMC": false,
            "PermissionsViewHealthCheck": false,
            "PermissionsManageHealthCheck": false,
            "PermissionsPackaging2": false,
            "PermissionsManageCertificates": false,
            "PermissionsCreateReportInLightning": false,
            "PermissionsPreventClassicExperience": false,
            "PermissionsHideReadByList": false,
            "PermissionsListEmailSend": false,
            "PermissionsFeedPinning": false,
            "PermissionsChangeDashboardColors": false,
            "PermissionsManageRecommendationStrategies": false,
            "PermissionsManagePropositions": false,
            "PermissionsCloseConversations": false,
            "PermissionsSubscribeReportRolesGrps": false,
            "PermissionsSubscribeDashboardRolesGrps": false,
            "PermissionsUseWebLink": true,
            "PermissionsHasUnlimitedNBAExecutions": false,
            "PermissionsViewOnlyEmbeddedAppUser": false,
            "PermissionsViewAllActivities": false,
            "PermissionsSubscribeReportToOtherUsers": false,
            "PermissionsLightningConsoleAllowedForUser": false,
            "PermissionsSubscribeReportsRunAsUser": false,
            "PermissionsSubscribeToLightningDashboards": false,
            "PermissionsSubscribeDashboardToOtherUsers": false,
            "PermissionsCreateLtngTempInPub": false,
            "PermissionsTransactionalEmailSend": false,
            "PermissionsViewPrivateStaticResources": false,
            "PermissionsCreateLtngTempFolder": false,
            "PermissionsApexRestServices": false,
            "PermissionsEnableCommunityAppLauncher": true,
            "PermissionsGiveRecognitionBadge": false,
            "PermissionsLtngPromoReserved01UserPerm": false,
            "PermissionsManageSubscriptions": false,
            "PermissionsWaveManagePrivateAssetsUser": false,
            "PermissionsCanEditDataPrepRecipe": false,
            "PermissionsAddAnalyticsRemoteConnections": false,
            "PermissionsManageSurveys": false,
            "PermissionsRecordVisibilityAPI": false,
            "PermissionsViewRoles": false,
            "PermissionsCanManageMaps": false,
            "PermissionsLMOutboundMessagingUserPerm": false,
            "PermissionsModifyDataClassification": false,
            "PermissionsPrivacyDataAccess": false,
            "PermissionsQueryAllFiles": false,
            "PermissionsModifyMetadata": false,
            "PermissionsManageCMS": false,
            "PermissionsSandboxTestingInCommunityApp": false,
            "PermissionsViewFlowUsageAndFlowEventData": false,
            "PermissionsCanEditPrompts": false,
            "PermissionsViewUserPII": false,
            "PermissionsManageHubConnections": false,
            "PermissionsB2BMarketingAnalyticsUser": false,
            "PermissionsTraceXdsQueries": false,
            "PermissionsViewAllCustomSettings": false,
            "PermissionsViewAllForeignKeyNames": false,
            "PermissionsAddWaveNotificationRecipients": false,
            "PermissionsHeadlessCMSAccess": false,
            "PermissionsConsentApiUpdate": false,
            "UserLicenseId": "1003h000001Gef6AAC",
            "UserType": "CspLitePortal",
            "CreatedDate": "2020-07-13T19:30:57.000+0000",
            "CreatedById": "0053h000002xQ5sAAE",
            "LastModifiedDate": "2021-10-09T11:19:17.000+0000",
            "LastModifiedById": "0053h000003de6eAAA",
            "SystemModstamp": "2021-10-09T11:19:17.000+0000",
            "Description": null,
            "LastViewedDate": null,
            "LastReferencedDate": null
        }
    ]
}
```

## System Admin Profile
```
sfdx mohanc:security:profile -u  mohan.chinnappan.n_ea2@gmail.com -p 'System Administrator'
```

```
{
    "totalSize": 1,
    "done": true,
    "records": [
        {
            "attributes": {
                "type": "Profile",
                "url": "/services/data/v54.0/sobjects/Profile/00e3h000001kqJMAAY"
            },
            "Id": "00e3h000001kqJMAAY",
            "Name": "System Administrator",
            "UserLicense": {
                "attributes": {
                    "type": "UserLicense",
                    "url": "/services/data/v54.0/sobjects/UserLicense/1003h000001GeewAAC"
                },
                "Name": "Salesforce"
            },
            "PermissionsEmailSingle": true,
            "PermissionsEmailMass": true,
            "PermissionsEditTask": true,
            "PermissionsEditEvent": true,
            "PermissionsExportReport": true,
            "PermissionsImportPersonal": true,
            "PermissionsDataExport": true,
            "PermissionsManageUsers": true,
            "PermissionsEditPublicFilters": true,
            "PermissionsEditPublicTemplates": true,
            "PermissionsModifyAllData": true,
            "PermissionsManageCases": true,
            "PermissionsMassInlineEdit": true,
            "PermissionsManageSolutions": true,
            "PermissionsCustomizeApplication": true,
            "PermissionsEditReadonlyFields": true,
            "PermissionsRunReports": true,
            "PermissionsViewSetup": true,
            "PermissionsTransferAnyEntity": true,
            "PermissionsNewReportBuilder": true,
            "PermissionsActivateContract": true,
            "PermissionsActivateOrder": true,
            "PermissionsImportLeads": true,
            "PermissionsManageLeads": true,
            "PermissionsTransferAnyLead": true,
            "PermissionsViewAllData": true,
            "PermissionsEditPublicDocuments": true,
            "PermissionsViewEncryptedData": false,
            "PermissionsEditBrandTemplates": true,
            "PermissionsEditHtmlTemplates": true,
            "PermissionsChatterInternalUser": true,
            "PermissionsDeleteActivatedContract": true,
            "PermissionsChatterInviteExternalUsers": true,
            "PermissionsSendSitRequests": true,
            "PermissionsManageRemoteAccess": true,
            "PermissionsCanUseNewDashboardBuilder": true,
            "PermissionsManageCategories": true,
            "PermissionsConvertLeads": true,
            "PermissionsPasswordNeverExpires": false,
            "PermissionsUseTeamReassignWizards": true,
            "PermissionsEditActivatedOrders": true,
            "PermissionsInstallMultiforce": true,
            "PermissionsPublishMultiforce": true,
            "PermissionsChatterOwnGroups": true,
            "PermissionsEditOppLineItemUnitPrice": true,
            "PermissionsCreateMultiforce": true,
            "PermissionsBulkApiHardDelete": false,
            "PermissionsSolutionImport": true,
            "PermissionsManageCallCenters": true,
            "PermissionsManageSynonyms": true,
            "PermissionsViewContent": false,
            "PermissionsManageEmailClientConfig": true,
            "PermissionsEnableNotifications": true,
            "PermissionsManageDataIntegrations": true,
            "PermissionsDistributeFromPersWksp": true,
            "PermissionsViewDataCategories": true,
            "PermissionsManageDataCategories": true,
            "PermissionsAuthorApex": true,
            "PermissionsManageMobile": true,
            "PermissionsApiEnabled": true,
            "PermissionsManageCustomReportTypes": true,
            "PermissionsEditCaseComments": true,
            "PermissionsTransferAnyCase": true,
            "PermissionsContentAdministrator": true,
            "PermissionsCreateWorkspaces": true,
            "PermissionsManageContentPermissions": true,
            "PermissionsManageContentProperties": true,
            "PermissionsManageContentTypes": true,
            "PermissionsManageExchangeConfig": true,
            "PermissionsManageAnalyticSnapshots": true,
            "PermissionsScheduleReports": true,
            "PermissionsManageBusinessHourHolidays": true,
            "PermissionsManageDynamicDashboards": true,
            "PermissionsCustomSidebarOnAllPages": false,
            "PermissionsManageInteraction": true,
            "PermissionsViewMyTeamsDashboards": true,
            "PermissionsModerateChatter": true,
            "PermissionsResetPasswords": true,
            "PermissionsFlowUFLRequired": true,
            "PermissionsCanInsertFeedSystemFields": true,
            "PermissionsActivitiesAccess": true,
            "PermissionsEmailTemplateManagement": true,
            "PermissionsEmailAdministration": true,
            "PermissionsManageChatterMessages": false,
            "PermissionsAllowEmailIC": false,
            "PermissionsChatterFileLink": true,
            "PermissionsForceTwoFactor": false,
            "PermissionsViewEventLogFiles": true,
            "PermissionsManageNetworks": true,
            "PermissionsManageAuthProviders": true,
            "PermissionsRunFlow": false,
            "PermissionsCreateCustomizeDashboards": true,
            "PermissionsCreateDashboardFolders": true,
            "PermissionsViewPublicDashboards": true,
            "PermissionsManageDashbdsInPubFolders": true,
            "PermissionsCreateCustomizeReports": true,
            "PermissionsCreateReportFolders": true,
            "PermissionsViewPublicReports": true,
            "PermissionsManageReportsInPubFolders": true,
            "PermissionsEditMyDashboards": true,
            "PermissionsEditMyReports": true,
            "PermissionsViewAllUsers": true,
            "PermissionsConnectOrgToEnvironmentHub": true,
            "PermissionsCreateCustomizeFilters": true,
            "PermissionsContentHubUser": false,
            "PermissionsGovernNetworks": false,
            "PermissionsSalesConsole": false,
            "PermissionsTwoFactorApi": false,
            "PermissionsDeleteTopics": true,
            "PermissionsEditTopics": true,
            "PermissionsCreateTopics": true,
            "PermissionsAssignTopics": true,
            "PermissionsIdentityEnabled": false,
            "PermissionsIdentityConnect": false,
            "PermissionsContentWorkspaces": true,
            "PermissionsCustomMobileAppsAccess": false,
            "PermissionsViewHelpLink": true,
            "PermissionsManageProfilesPermissionsets": true,
            "PermissionsAssignPermissionSets": true,
            "PermissionsManageRoles": true,
            "PermissionsManageIpAddresses": true,
            "PermissionsManageSharing": true,
            "PermissionsManageInternalUsers": true,
            "PermissionsManagePasswordPolicies": true,
            "PermissionsManageLoginAccessPolicies": true,
            "PermissionsManageCustomPermissions": true,
            "PermissionsCanVerifyComment": true,
            "PermissionsManageUnlistedGroups": true,
            "PermissionsInsightsAppDashboardEditor": false,
            "PermissionsManageTwoFactor": false,
            "PermissionsInsightsAppUser": false,
            "PermissionsInsightsAppAdmin": false,
            "PermissionsInsightsAppEltEditor": false,
            "PermissionsInsightsAppUploadUser": false,
            "PermissionsInsightsCreateApplication": false,
            "PermissionsLightningExperienceUser": true,
            "PermissionsConfigCustomRecs": false,
            "PermissionsSubmitMacrosAllowed": true,
            "PermissionsBulkMacrosAllowed": true,
            "PermissionsManageSessionPermissionSets": false,
            "PermissionsManageTemplatedApp": false,
            "PermissionsUseTemplatedApp": false,
            "PermissionsSendAnnouncementEmails": false,
            "PermissionsChatterEditOwnPost": true,
            "PermissionsChatterEditOwnRecordPost": true,
            "PermissionsWaveTabularDownload": false,
            "PermissionsImportCustomObjects": true,
            "PermissionsDelegatedTwoFactor": true,
            "PermissionsChatterComposeUiCodesnippet": false,
            "PermissionsSelectFilesFromSalesforce": true,
            "PermissionsModerateNetworkUsers": false,
            "PermissionsMergeTopics": true,
            "PermissionsSubscribeToLightningReports": true,
            "PermissionsManagePvtRptsAndDashbds": true,
            "PermissionsAllowLightningLogin": false,
            "PermissionsCampaignInfluence2": false,
            "PermissionsViewDataAssessment": true,
            "PermissionsRemoveDirectMessageMembers": true,
            "PermissionsCanApproveFeedPost": false,
            "PermissionsAddDirectMessageMembers": true,
            "PermissionsAllowViewEditConvertedLeads": false,
            "PermissionsShowCompanyNameAsUserBadge": true,
            "PermissionsAccessCMC": false,
            "PermissionsViewHealthCheck": true,
            "PermissionsManageHealthCheck": true,
            "PermissionsPackaging2": true,
            "PermissionsManageCertificates": true,
            "PermissionsCreateReportInLightning": false,
            "PermissionsPreventClassicExperience": false,
            "PermissionsHideReadByList": false,
            "PermissionsListEmailSend": true,
            "PermissionsFeedPinning": false,
            "PermissionsChangeDashboardColors": true,
            "PermissionsManageRecommendationStrategies": true,
            "PermissionsManagePropositions": true,
            "PermissionsCloseConversations": false,
            "PermissionsSubscribeReportRolesGrps": true,
            "PermissionsSubscribeDashboardRolesGrps": true,
            "PermissionsUseWebLink": true,
            "PermissionsHasUnlimitedNBAExecutions": false,
            "PermissionsViewOnlyEmbeddedAppUser": false,
            "PermissionsViewAllActivities": false,
            "PermissionsSubscribeReportToOtherUsers": true,
            "PermissionsLightningConsoleAllowedForUser": true,
            "PermissionsSubscribeReportsRunAsUser": true,
            "PermissionsSubscribeToLightningDashboards": true,
            "PermissionsSubscribeDashboardToOtherUsers": true,
            "PermissionsCreateLtngTempInPub": false,
            "PermissionsTransactionalEmailSend": true,
            "PermissionsViewPrivateStaticResources": false,
            "PermissionsCreateLtngTempFolder": true,
            "PermissionsApexRestServices": true,
            "PermissionsEnableCommunityAppLauncher": true,
            "PermissionsGiveRecognitionBadge": true,
            "PermissionsLtngPromoReserved01UserPerm": false,
            "PermissionsManageSubscriptions": true,
            "PermissionsWaveManagePrivateAssetsUser": false,
            "PermissionsCanEditDataPrepRecipe": false,
            "PermissionsAddAnalyticsRemoteConnections": false,
            "PermissionsManageSurveys": false,
            "PermissionsRecordVisibilityAPI": false,
            "PermissionsViewRoles": true,
            "PermissionsCanManageMaps": false,
            "PermissionsLMOutboundMessagingUserPerm": false,
            "PermissionsModifyDataClassification": true,
            "PermissionsPrivacyDataAccess": true,
            "PermissionsQueryAllFiles": false,
            "PermissionsModifyMetadata": true,
            "PermissionsManageCMS": true,
            "PermissionsSandboxTestingInCommunityApp": false,
            "PermissionsViewFlowUsageAndFlowEventData": true,
            "PermissionsCanEditPrompts": false,
            "PermissionsViewUserPII": true,
            "PermissionsManageHubConnections": true,
            "PermissionsB2BMarketingAnalyticsUser": false,
            "PermissionsTraceXdsQueries": false,
            "PermissionsViewAllCustomSettings": false,
            "PermissionsViewAllForeignKeyNames": false,
            "PermissionsAddWaveNotificationRecipients": false,
            "PermissionsHeadlessCMSAccess": false,
            "PermissionsConsentApiUpdate": true,
            "UserLicenseId": "1003h000001GeewAAC",
            "UserType": "Standard",
            "CreatedDate": "2020-07-13T19:30:57.000+0000",
            "CreatedById": "0053h000002xQ5sAAE",
            "LastModifiedDate": "2021-10-09T11:19:17.000+0000",
            "LastModifiedById": "0053h000003de6eAAA",
            "SystemModstamp": "2021-10-09T11:19:17.000+0000",
            "Description": null,
            "LastViewedDate": null,
            "LastReferencedDate": null
        }
    ]
}
```

<a name="Check_PermissionSet_Permissions"></a>
# Check PermissionSet Permissions

![PermissionSetERD](https://mohan-chinnappan-n.github.io/sfdc/fs-cloud/img/PermissionSet.svg)

```
sfdx mohanc:security:permissionSet -p 'Sales_Ops' -u  mohan.chinnappan.n_ea2@gmail.com
```

```json
{
    "totalSize": 1,
    "done": true,
    "records": [
        {
            "attributes": {
                "type": "PermissionSet",
                "url": "/services/data/v54.0/sobjects/PermissionSet/0PS3h000001Xik5GAC"
            },
            "Id": "0PS3h000001Xik5GAC",
            "Name": "Sales_Ops",
            "Profile": null,
            "License": null,
            "PermissionsEmailSingle": false,
            "PermissionsEmailMass": false,
            "PermissionsEditTask": false,
            "PermissionsEditEvent": false,
            "PermissionsExportReport": false,
            "PermissionsImportPersonal": false,
            "PermissionsDataExport": false,
            "PermissionsManageUsers": false,
            "PermissionsEditPublicFilters": false,
            "PermissionsEditPublicTemplates": false,
            "PermissionsModifyAllData": false,
            "PermissionsManageCases": false,
            "PermissionsMassInlineEdit": false,
            "PermissionsManageSolutions": false,
            "PermissionsCustomizeApplication": false,
            "PermissionsEditReadonlyFields": false,
            "PermissionsRunReports": false,
            "PermissionsViewSetup": false,
            "PermissionsTransferAnyEntity": false,
            "PermissionsNewReportBuilder": false,
            "PermissionsActivateContract": false,
            "PermissionsActivateOrder": false,
            "PermissionsImportLeads": false,
            "PermissionsManageLeads": false,
            "PermissionsTransferAnyLead": false,
            "PermissionsViewAllData": false,
            "PermissionsEditPublicDocuments": false,
            "PermissionsViewEncryptedData": false,
            "PermissionsEditBrandTemplates": false,
            "PermissionsEditHtmlTemplates": false,
            "PermissionsChatterInternalUser": false,
            "PermissionsDeleteActivatedContract": false,
            "PermissionsChatterInviteExternalUsers": false,
            "PermissionsSendSitRequests": false,
            "PermissionsManageRemoteAccess": false,
            "PermissionsCanUseNewDashboardBuilder": false,
            "PermissionsManageCategories": false,
            "PermissionsConvertLeads": false,
            "PermissionsPasswordNeverExpires": false,
            "PermissionsUseTeamReassignWizards": false,
            "PermissionsEditActivatedOrders": false,
            "PermissionsChatterOwnGroups": false,
            "PermissionsEditOppLineItemUnitPrice": false,
            "PermissionsBulkApiHardDelete": false,
            "PermissionsSolutionImport": false,
            "PermissionsManageCallCenters": false,
            "PermissionsManageSynonyms": false,
            "PermissionsViewContent": false,
            "PermissionsManageEmailClientConfig": false,
            "PermissionsEnableNotifications": false,
            "PermissionsManageDataIntegrations": false,
            "PermissionsDistributeFromPersWksp": false,
            "PermissionsViewDataCategories": false,
            "PermissionsManageDataCategories": false,
            "PermissionsAuthorApex": false,
            "PermissionsManageMobile": false,
            "PermissionsApiEnabled": false,
            "PermissionsManageCustomReportTypes": false,
            "PermissionsEditCaseComments": false,
            "PermissionsTransferAnyCase": false,
            "PermissionsContentAdministrator": false,
            "PermissionsCreateWorkspaces": false,
            "PermissionsManageContentPermissions": false,
            "PermissionsManageContentProperties": false,
            "PermissionsManageContentTypes": false,
            "PermissionsManageExchangeConfig": false,
            "PermissionsManageAnalyticSnapshots": false,
            "PermissionsScheduleReports": false,
            "PermissionsManageBusinessHourHolidays": false,
            "PermissionsManageDynamicDashboards": false,
            "PermissionsCustomSidebarOnAllPages": false,
            "PermissionsManageInteraction": false,
            "PermissionsViewMyTeamsDashboards": false,
            "PermissionsModerateChatter": false,
            "PermissionsResetPasswords": false,
            "PermissionsFlowUFLRequired": false,
            "PermissionsCanInsertFeedSystemFields": false,
            "PermissionsActivitiesAccess": false,
            "PermissionsEmailTemplateManagement": false,
            "PermissionsEmailAdministration": false,
            "PermissionsManageChatterMessages": false,
            "PermissionsAllowEmailIC": false,
            "PermissionsChatterFileLink": false,
            "PermissionsForceTwoFactor": false,
            "PermissionsViewEventLogFiles": false,
            "PermissionsManageNetworks": false,
            "PermissionsManageAuthProviders": false,
            "PermissionsRunFlow": false,
            "PermissionsCreateCustomizeDashboards": false,
            "PermissionsCreateDashboardFolders": false,
            "PermissionsViewPublicDashboards": false,
            "PermissionsManageDashbdsInPubFolders": false,
            "PermissionsCreateCustomizeReports": false,
            "PermissionsCreateReportFolders": false,
            "PermissionsViewPublicReports": false,
            "PermissionsManageReportsInPubFolders": false,
            "PermissionsEditMyDashboards": false,
            "PermissionsEditMyReports": false,
            "PermissionsViewAllUsers": false,
            "PermissionsConnectOrgToEnvironmentHub": false,
            "PermissionsCreateCustomizeFilters": false,
            "PermissionsContentHubUser": false,
            "PermissionsGovernNetworks": false,
            "PermissionsSalesConsole": false,
            "PermissionsTwoFactorApi": false,
            "PermissionsDeleteTopics": false,
            "PermissionsEditTopics": false,
            "PermissionsCreateTopics": false,
            "PermissionsAssignTopics": false,
            "PermissionsIdentityEnabled": false,
            "PermissionsIdentityConnect": false,
            "PermissionsContentWorkspaces": false,
            "PermissionsCustomMobileAppsAccess": false,
            "PermissionsViewHelpLink": false,
            "PermissionsManageProfilesPermissionsets": false,
            "PermissionsAssignPermissionSets": false,
            "PermissionsManageRoles": false,
            "PermissionsManageIpAddresses": false,
            "PermissionsManageSharing": false,
            "PermissionsManageInternalUsers": false,
            "PermissionsManagePasswordPolicies": false,
            "PermissionsManageLoginAccessPolicies": false,
            "PermissionsManageCustomPermissions": false,
            "PermissionsCanVerifyComment": false,
            "PermissionsManageUnlistedGroups": false,
            "PermissionsInsightsAppDashboardEditor": false,
            "PermissionsManageTwoFactor": false,
            "PermissionsInsightsAppUser": false,
            "PermissionsInsightsAppAdmin": false,
            "PermissionsInsightsAppEltEditor": false,
            "PermissionsInsightsAppUploadUser": false,
            "PermissionsInsightsCreateApplication": false,
            "PermissionsLightningExperienceUser": false,
            "PermissionsConfigCustomRecs": false,
            "PermissionsSubmitMacrosAllowed": false,
            "PermissionsBulkMacrosAllowed": false,
            "PermissionsManageSessionPermissionSets": false,
            "PermissionsManageTemplatedApp": false,
            "PermissionsUseTemplatedApp": false,
            "PermissionsSendAnnouncementEmails": false,
            "PermissionsChatterEditOwnPost": false,
            "PermissionsChatterEditOwnRecordPost": false,
            "PermissionsWaveTabularDownload": false,
            "PermissionsImportCustomObjects": false,
            "PermissionsDelegatedTwoFactor": false,
            "PermissionsChatterComposeUiCodesnippet": false,
            "PermissionsSelectFilesFromSalesforce": false,
            "PermissionsModerateNetworkUsers": false,
            "PermissionsMergeTopics": false,
            "PermissionsSubscribeToLightningReports": false,
            "PermissionsManagePvtRptsAndDashbds": false,
            "PermissionsAllowLightningLogin": false,
            "PermissionsCampaignInfluence2": false,
            "PermissionsViewDataAssessment": false,
            "PermissionsRemoveDirectMessageMembers": false,
            "PermissionsCanApproveFeedPost": false,
            "PermissionsAddDirectMessageMembers": false,
            "PermissionsAllowViewEditConvertedLeads": false,
            "PermissionsShowCompanyNameAsUserBadge": false,
            "PermissionsAccessCMC": false,
            "PermissionsViewHealthCheck": false,
            "PermissionsManageHealthCheck": false,
            "PermissionsPackaging2": false,
            "PermissionsManageCertificates": false,
            "PermissionsCreateReportInLightning": false,
            "PermissionsPreventClassicExperience": false,
            "PermissionsHideReadByList": false,
            "PermissionsListEmailSend": false,
            "PermissionsFeedPinning": false,
            "PermissionsChangeDashboardColors": false,
            "PermissionsManageRecommendationStrategies": false,
            "PermissionsManagePropositions": false,
            "PermissionsCloseConversations": false,
            "PermissionsSubscribeReportRolesGrps": false,
            "PermissionsSubscribeDashboardRolesGrps": false,
            "PermissionsUseWebLink": false,
            "PermissionsHasUnlimitedNBAExecutions": false,
            "PermissionsViewOnlyEmbeddedAppUser": false,
            "PermissionsViewAllActivities": false,
            "PermissionsSubscribeReportToOtherUsers": false,
            "PermissionsLightningConsoleAllowedForUser": false,
            "PermissionsSubscribeReportsRunAsUser": false,
            "PermissionsSubscribeToLightningDashboards": false,
            "PermissionsSubscribeDashboardToOtherUsers": false,
            "PermissionsCreateLtngTempInPub": false,
            "PermissionsTransactionalEmailSend": false,
            "PermissionsViewPrivateStaticResources": false,
            "PermissionsCreateLtngTempFolder": false,
            "PermissionsApexRestServices": false,
            "PermissionsEnableCommunityAppLauncher": false,
            "PermissionsGiveRecognitionBadge": false,
            "PermissionsLtngPromoReserved01UserPerm": false,
            "PermissionsManageSubscriptions": false,
            "PermissionsWaveManagePrivateAssetsUser": false,
            "PermissionsCanEditDataPrepRecipe": false,
            "PermissionsAddAnalyticsRemoteConnections": false,
            "PermissionsManageSurveys": false,
            "PermissionsRecordVisibilityAPI": false,
            "PermissionsViewRoles": false,
            "PermissionsCanManageMaps": false,
            "PermissionsLMOutboundMessagingUserPerm": false,
            "PermissionsModifyDataClassification": false,
            "PermissionsPrivacyDataAccess": false,
            "PermissionsQueryAllFiles": false,
            "PermissionsModifyMetadata": false,
            "PermissionsManageCMS": false,
            "PermissionsSandboxTestingInCommunityApp": false,
            "PermissionsViewFlowUsageAndFlowEventData": false,
            "PermissionsCanEditPrompts": false,
            "PermissionsViewUserPII": false,
            "PermissionsManageHubConnections": false,
            "PermissionsB2BMarketingAnalyticsUser": false,
            "PermissionsTraceXdsQueries": false,
            "PermissionsViewAllCustomSettings": false,
            "PermissionsViewAllForeignKeyNames": false,
            "PermissionsAddWaveNotificationRecipients": false,
            "PermissionsHeadlessCMSAccess": false,
            "PermissionsConsentApiUpdate": false,
            "CreatedDate": "2020-11-12T17:15:56.000+0000",
            "CreatedById": "0053h000002xQ5sAAE",
            "LastModifiedDate": "2020-11-12T17:15:56.000+0000",
            "LastModifiedById": "0053h000002xQ5sAAE",
            "SystemModstamp": "2020-11-12T17:15:56.000+0000",
            "Description": null
        }
    ]
}
```


<a name="Guest_Profile_permissions"></a>
# Guest Profile permissions

- Check Guest Profile permissions using CLI

```
sfdx mohanc:security:userLicenseProfile -u  mohan.chinnappan.n_ea2@gmail.com -l 'Guest'
```

```json
{
    "totalSize": 2,
    "done": true,
    "records": [
        {
            "attributes": {
                "type": "Profile",
                "url": "/services/data/v54.0/sobjects/Profile/00e3h000001AxZmAAK"
            },
            "Id": "00e3h000001AxZmAAK",
            "Name": "Standard Guest",
            "PermissionsEmailSingle": false,
            "PermissionsEmailMass": false,
            "PermissionsEditTask": false,
            "PermissionsEditEvent": false,
            "PermissionsExportReport": false,
            "PermissionsImportPersonal": false,
            "PermissionsDataExport": false,
            "PermissionsManageUsers": false,
            "PermissionsEditPublicFilters": false,
            "PermissionsEditPublicTemplates": false,
            "PermissionsModifyAllData": false,
            "PermissionsManageCases": false,
            "PermissionsMassInlineEdit": false,
            "PermissionsManageSolutions": false,
            "PermissionsCustomizeApplication": false,
            "PermissionsEditReadonlyFields": false,
            "PermissionsRunReports": false,
            ...
            "UserLicenseId": "1003h000000sGNCAA2",
            "UserType": "Guest",
            "CreatedDate": "2020-07-25T10:44:13.000+0000",
            "CreatedById": "0053h000002xQ5sAAE",
            "LastModifiedDate": "2021-10-09T11:19:17.000+0000",
            "LastModifiedById": "0053h000003de6eAAA",
            "SystemModstamp": "2021-10-09T11:19:17.000+0000",
            "Description": null,
            "LastViewedDate": null,
            "LastReferencedDate": null
        }
    ]
}
```

## Profile information for UserLicense **Salesforce**
```
sfdx mohanc:security:userLicenseProfile -u  mohan.chinnappan.n_ea2@gmail.com -l 'Salesforce'

```

<a name="Role_Hierarchy"></a>
# Role Hierarchy

- Using CLI to view Role Hierarchy

```
sfdx mohanc:security:rh  -u  mohan.chinnappan.n_ea2@gmail.com
```

```
Writing visualization in file __RH__.svg ...
Visualization done. "open  __RH__.svg" in Chrome Browser to view the Visualization.
```

![RH](img/rh2.svg)


<a name="owd"></a>
# Org wide settings
![Org](img/Organization-erd.svg)

```
SELECT Id ,Name ,PreferencesRequireOpportunityProducts,PreferencesTransactionSecurityPolicy,
PreferencesTerminateOldestSession,PreferencesConsentManagementEnabled,PreferencesAutoSelectIndividualOnMerge,PreferencesLightningLoginEnabled,PreferencesOnlyLLPermUserAllowed,DefaultAccountAccess,DefaultContactAccess,DefaultOpportunityAccess,DefaultLeadAccess,DefaultCaseAccess,DefaultCalendarAccess,DefaultPricebookAccess,DefaultCampaignAccess,OrganizationType,IsReadOnly FROM Organization
```

-![Org1](img/org-1.png)

## Entity Definition

![Entity Def ERD](img/EntityDefinition-erd.svg)

```sql
SELECT NamespacePrefix, DeveloperName, ExternalSharingModel, InternalSharingModel 
FROM EntityDefinition  LIMIT 2000
```

![Entity Def](img/entityDef-1.png)

- [Sample output in JSON for the above the query ](https://github.com/mohan-chinnappan-n5/mohan-chinnappan-n5.github.io/blob/master/sf-security/img/entity.soql.json)


<a name="ec"></a>
# Experience Cloud

- Network represents an Experience Cloud site. Salesforce Experience Cloud lets you create branded spaces for your employees, customers, and partners.
-  You can customize and create experiences, whether they’re 
    - communities
    - sites
    - portals
- to meet your business needs, then transition seamlessly between them. 

- Network ERD
![Network ERD](img/Network-erd.svg)

- NetworkMember ERD
![NetworkMember ERD](img/NetworkMember-erd.svg)

- Combined ERD
![Network and NetworkMember ERD](img/network-networkmember.svg)

- NetworkMemberGroup
-![NetworkGroupMember ERD](img/network-networkmember-group.dot.svg)

- [ERD fields info](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/sharing/network-networkmember-group.csv)

- Querying NetworkMember
```sql
SELECT 
Network.Name
,Network.Description
,Network.Status
,Network.UrlPathPrefix

,Member.Name 

,Network.SelfRegProfileId
,Network.MaxFileSizeKb	
,Network.AllowedExtensions

,DigestFrequency
,ReputationPoints


FROM NetworkMember

```

![Query NetworkMember](img/networkMember-query.png)

- Querying Site
```sql
SELECT
Id
,SystemModstamp
,CreatedDate
,CreatedById
,LastModifiedDate
,LastModifiedById
,Name
,Description
,Status
,OptionsInvitationsEnabled
,OptionsSendWelcomeEmail
,OptionsSelfRegistrationEnabled
,OptionsAllowMembersToFlag
,OptionsSiteAsContainerEnabled
,OptionsPrivateMessagesEnabled
,OptionsKnowledgeableEnabled
,OptionsReputationEnabled
,OptionsEinsteinAnswersSnippetEnabled
,OptionsGuestChatterEnabled
,OptionsNicknameDisplayEnabled
,OptionsShowAllNetworkSettings
,OptionsAllowInternalUserLogin
,OptionsDirectMessagesEnabled
,OptionsReputationRecordConversationsDisabled
,OptionsGuestFileAccessEnabled
,OptionsGatherCustomerSentimentData
,OptionsNetworkSentimentAnalysis
,OptionsEnableTopicAssignmentRules
,OptionsEinsteinAnswersEnabled
,OptionsCWBannerState
,OptionsTopicSuggestionsEnabled
,OptionsEnableTalkingAboutStats
,OptionsUpDownVoteEnabled
,OptionsDisableWorkspaceInfo
,OptionsEinsteinAnswersQAEnabled
,OptionsEinsteinAnswersKAEnabled
,OptionsRecognitionBadgingEnabled
,OptionsThreadedDiscussionsEnabled
,OptionsMemberVisibility
,OptionsMobileImageOptimizationEnabled
,OptionsGuestMemberVisibility
,OptionsActionOverrideEnabled
,OptionsProfileBasedLayoutsForKnowledgeSearchEnabled
,WelcomeEmailTemplateId
,ChangePasswordEmailTemplateId
,ForgotPasswordEmailTemplateId
,LockoutEmailTemplateId
,VerificationEmailTemplateId
,ChgEmailVerOldEmailTemplateId
,ChgEmailVerNewEmailTemplateId
,EmailSenderName
,EmailSenderAddress
,NewSenderAddress
,EmailFooterLogoId
,EmailFooterText
,UrlPathPrefix
,CaseCommentEmailTemplateId
,SelfRegProfileId
,FirstActivationDate
,MaxFileSizeKb
,AllowedExtensions
FROM Network
```

- Site represents a public website that is integrated with an org. This object is available in API version 16.0 and later.

- Site ERD
![Site ERD](img/Site-erd.svg)

```
SELECT Id ,Name ,Subdomain,UrlPathPrefix,GuestUserId 

,Status
,AdminId
,OptionsEnableFeeds
,OptionsRequireHttps
,OptionsAllowGuestPaymentsApi
,OptionsHasStoredPathPrefix
,OptionsAllowHomePage
,OptionsAllowStandardIdeasPages
,OptionsAllowStandardSearch
,OptionsAllowStandardLookups
,OptionsAllowStandardAnswersPages
,OptionsAllowGuestSupportApi
,OptionsAllowStandardPortalPages
,OptionsCspUpgradeInsecureRequests
,OptionsContentSniffingProtection
,OptionsBrowserXssProtection
,OptionsReferrerPolicyOriginWhenCrossOrigin
,Description
,MasterLabel
,AnalyticsTrackingCode
,SiteType
,ClickjackProtectionLevel
,DailyBandwidthLimit
,DailyBandwidthUsed
,DailyRequestTimeLimit
,DailyRequestTimeUsed
,MonthlyPageViewsEntitlement
,GuestRecordDefaultOwnerId


FROM Site
```
![EC-1](img/ec-1.png)

- [Community Cloud Tips](https://mohan-chinnappan-n2.github.io/2020/cc/cc.html#0)


## Sharing Set

![SharingSet ERD](img/sharingSet.dot.svg)
- [Refer metadata doc](https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_sharingset.htm)
- [Community Cloud Security](https://mohan-chinnappan-n2.github.io/2020/cc/security/security.html)

- A sharing set defines **an access mapping** that grants portal or community users access to **objects** that are associated with their **accounts or contacts**.

- Example: You can grant portal or community users access to **all cases** related to their **account record**. 
    - Similarly, you can grant portal or community users access to **all cases** related to a parent account that is identified on the user’s account record.
- [Video: How to Create a Sharing Set for Customer Community Users ](https://www.youtube.com/watch?v=rurWMbjJ26k)
    - Granting access to cases not available using sharing rules or manual sharing is not available
        - Since customer community users **do not have roles**
![Role not in Community users](https://mohan-chinnappan-n2.github.io/2020/cc/security/img/cc-role-3.png)

    - Sharing set setup
        - Case Object is set to **private** in OWD
            - This will make Case object will be available for sharing set 
            - Setup a **Profile** that wil be used in the sharing set setup, that has at least **read access to the Case object**
        - Review the Case record we like to grant access and verify  the user is not able view the Case record.
        - Go that Case Record
            - Click on **Contact** on the Case Record
                - Click on **Login in to Community as User** for this contact
                - In the Community, select *Cases* in the navigation menu
                    - You will not able to see that Case record
                    - Log out
                - Setup Sharing Set
                    - Setup > Communities Settings :: **Sharing Sets**
                    - **Sharing Set** :: New
                    - Provide Label and Name for the Sharing Set
                    - Select a **Profile** under **Select Profiles**
                        - select **Custom Customer Profile** and add
                    - Select Object under Select Objects
                        - select **Case** under Available Objects for this sharing set
                    - Configure Access
                        - Click **Setup** to get **Access Mapping for Cases** dialog
                            - **Where** - Grant Access :: User (userField) = Contact
                            - **Matches** - Target Case = Contact (Case's Contact is this Contact)
                            - **Access Level** = Read Only
- ![SharingSet setup](img/sharingSet-setup.png)
```
Object: Case
Access Determined By: User:Contact = Case:Contact	
Access Level: Read Only

```


<a name="sd"></a>
# Sharing Debugger
- [Documentation](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/sharing.md)

- Chrome Extension
![SD Chrome Extension](https://raw.githubusercontent.com/mohan-chinnappan-n/cli-dx/master/img/sd-2.gif)

- CLI version
  - Visualization
![Viz sharing debugger](img/userInfo.svg)

```
$ sfdx mohanc:sharing:debug -h
Run Sharing Debugger on the given org for the given user

USAGE
  $ sfdx mohanc:sharing:debug

Run Sharing Debugger on the given org for the given user

USAGE
  $ sfdx mohanc:sharing:debug

OPTIONS
  -n, --username=username                          User Name to Debug
  -u, --targetusername=targetusername              username or alias for the target org; overrides default target org
  -v, --targetdevhubusername=targetdevhubusername  username or alias for the dev hub org; overrides default dev hub org
  --apiversion=apiversion                          override the api version used for api requests made by this command
  --json                                           format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)   logging level for this command invocation

EXAMPLE

       ** Run Sharing Debugger on the given org for the given user **

       USAGE
       sfdx mohanc:sharing:debug -u <username>  -n <userNameToDebug>

       writes userInfo.json and userInfo.svg files in the current directory

       -----------
    

```


```
sfdx mohanc:sharing:debug -u mohan.chinnappan.n_ea2@gmail.com -n mohan.chinnappan.n_ea2@gmail.com
```
```
____________User Info____________
"Id","Name","UserRoleId"
"0053h000002xQ5sAAE","Mohan Chinnappan","00E3h000001JaqUEAS"
userRoleId : 00E3h000001JaqUEAS
____________Role____________
"Id","Name","ParentRoleId","RollupDescription","OpportunityAccessForAccountOwner","CaseAccessForAccountOwner","ForecastUserId","MayForecastManagerShare","DeveloperName","PortalAccountId","PortalType","PortalAccountOwnerId"
"00E3h000001JaqUEAS","CEO",,"CEO","Edit","Edit",,false,"CEO",,"None",
____________Profile____________
profileId : 00e3h000001kqJMAAY
____________Permissions____________
"Id","Name","PermissionsViewAllData","PermissionsModifyAllData","PermissionsManageDataIntegrations"
"00e3h000001kqJMAAY","System Administrator",true,true,true
____________PermSets____________
"Id","Label","PermissionsViewAllData","PermissionsModifyAllData","PermissionsManageDataIntegrations"
"0PS3h000002PwNZGA0","00ex00000018ozh_128_09_04_12_1",true,true,true
____________AccountShare____________
"Id","AccountId","UserOrGroupId","AccountAccessLevel","OpportunityAccessLevel","CaseAccessLevel","ContactAccessLevel","RowCause"
"00r3h000033f9xzAAA","0013h00000FfgCMAAZ","0053h000002xQ5sAAE","All","Edit","Edit","Edit","Owner"
"00r3h000033fA4bAAE","0013h00000FfgCNAAZ","0053h000002xQ5sAAE","All","Edit","Edit","Edit","Owner"
"00r3h000033fAe4AAE","0013h00000Ffg4aAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h00004R4gqfAAB","0013h000018ziseAAA","0053h000002xQ5sAAE","All","Edit","Edit","Edit","Owner"
"00r3h00004luUr9AAE","0013h00001C1KE0AAN","0053h000002xQ5sAAE","All","Edit","Edit","Edit","Owner"
"00r3h000033fAIGAA2","0013h00000FffwFAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAHvAAM","0013h00000FffyGAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAHZAA2","0013h00000FffzCAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAINAA2","0013h00000FffwLAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAJEAA2","0013h00000Ffg0jAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAOaAAM","0013h00000FffwXAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAOmAAM","0013h00000FffyeAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fADhAAM","0013h00000FffwqAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAhqAAE","0013h00000FffwrAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAhyAAE","0013h00000FffxbAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAUgAAM","0013h00000Fffx0AAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAUzAAM","0013h00000FffxAAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAUmAAM","0013h00000FffzYAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAUKAA2","0013h00000Ffg2DAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAJXAA2","0013h00000FffxGAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAJeAAM","0013h00000FffzPAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAK3AAM","0013h00000Ffg4KAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAeBAAU","0013h00000FffxuAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAdzAAE","0013h00000FffyrAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAdNAAU","0013h00000Fffz7AAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAe6AAE","0013h00000Ffg1EAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAd8AAE","0013h00000Ffg37AAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAe8AAE","0013h00000Ffg3wAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAbkAAE","0013h00000FffxzAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAbTAAU","0013h00000FffzOAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fALRAA2","0013h00000Fffy2AAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAeZAAU","0013h00000FffyCAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAgzAAE","0013h00000FffyLAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAgaAAE","0013h00000FffyZAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAh7AAE","0013h00000Ffg0HAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAZXAA2","0013h00000FffyQAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAa2AAE","0013h00000Ffg2gAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAZMAA2","0013h00000Ffg3RAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fASpAAM","0013h00000FffylAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fASNAA2","0013h00000Ffg1fAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fASxAAM","0013h00000Ffg1kAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAXnAAM","0013h00000FffzXAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAXmAAM","0013h00000Ffg1BAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAXwAAM","0013h00000Ffg3pAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAMgAAM","0013h00000FffzqAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAZ7AAM","0013h00000FffzuAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAC9AAM","0013h00000Ffg0JAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAC4AAM","0013h00000Ffg4WAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAL4AAM","0013h00000Ffg0aAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAKtAAM","0013h00000Ffg0hAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAKiAAM","0013h00000Ffg3eAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAKwAAM","0013h00000Ffg44AAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fACcAAM","0013h00000Ffg0cAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAFDAA2","0013h00000Ffg0oAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fABFAA2","0013h00000Ffg0wAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fATIAA2","0013h00000Ffg1AAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAbEAAU","0013h00000Ffg1CAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAanAAE","0013h00000Ffg2rAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAR7AAM","0013h00000Ffg2TAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fARJAA2","0013h00000Ffg46AAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAVMAA2","0013h00000Ffg2vAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAW0AAM","0013h00000Ffg35AAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAfmAAE","0013h00000Ffg4JAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAE2AAM","0013h00000Ffg4bAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAOJAA2","0013h00000Ffg54AAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fARAAA2","0013h00000Ffg5CAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fASFAA2","0013h00000Ffg5DAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fABKAA2","0013h00000Ffg5FAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAJwAAM","0013h00000Ffg5MAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAf3AAE","0013h00000Ffg5OAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAFGAA2","0013h00000Ffg5hAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAS7AAM","0013h00000Ffg5mAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fATDAA2","0013h00000Ffg5nAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fARBAA2","0013h00000Ffg6VAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAakAAE","0013h00000Ffg6aAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAXxAAM","0013h00000Ffg7dAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAbaAAE","0013h00000Ffg7eAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fALyAAM","0013h00000Ffg8AAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAIEAA2","0013h00000Ffg8PAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAeMAAU","0013h00000Ffg8aAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fARRAA2","0013h00000Ffg9BAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAYtAAM","0013h00000Ffg9WAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAIIAA2","0013h00000Ffg9ZAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAasAAE","0013h00000FfgA6AAJ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAdwAAE","0013h00000FfgAcAAJ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fASgAAM","0013h00000FfgAdAAJ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAaSAAU","0013h00000FfgAkAAJ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAdYAAU","0013h00000FfgApAAJ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAKpAAM","0013h00000FfgBGAAZ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAY1AAM","0013h00000FfgBLAAZ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAMGAA2","0013h00000FfgBhAAJ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAXYAA2","0013h00000FfgBmAAJ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAVpAAM","0013h00000FfgBuAAJ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAafAAE","0013h00000FfgC1AAJ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fALVAA2","0013h00000FfgC5AAJ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAG5AAM","0013h00000Ffg8mAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fANXAA2","0013h00000Ffg4dAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAcrAAE","0013h00000Ffg5aAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033wF3RAAU","0013h00000Ffg6kAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAQlAAM","0013h00000Ffg7TAAR","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAWIAA2","0013h00000Ffg8bAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAWOAA2","0013h00000Ffg9bAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAPIAA2","0013h00000Ffg8kAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAPJAA2","0013h00000Ffg9mAAB","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
"00r3h000033fAPVAA2","0013h00000FfgA0AAJ","0053h000002xQ5sAAE","Read","None","None","None","ImplicitParent"
____________OpportunityShare____________
"Id","OpportunityId","UserOrGroupId","RowCause"
"00t3h00001VnMzVAAV","0063h000008wq3kAAA","0053h000002xQ5sAAE","Team"
____________AccountTeams____________
=== None found ===
____________OpportunityTeams____________
"Id","Name","OpportunityAccessLevel","OpportunityId","TeamMemberRole","Title"
"00q3h000000FMRdAAO","Mohan Chinnappan","Read","0063h000008wq3kAAA","Account Manager",
Writing userInfo JSON  in file userInfo.json ...
open  userInfo.json
Writing visualization in file userInfo.svg ...
Visualization done. "open  userInfo.svg" in Chrome Browser to view the Visualization.

```


# Optimizer 
![Optimizer ](img/optimizer-report-1.png)

<a name="em"></a>
# Real-Time Event Monitoring
- Gives you access to detailed performance, security, and usage data on all your Salesforce apps. See who is accessing critical business data when, and from where. 

- [Viewing and Visualizing Event Log files using DX](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/monitoring/em.md)

<a name="fat"></a>
# Field Audit Trail
- Lets you know the state and value of your data for any date, at any time
- Built on a **big data backend** for massive scalability, Field Audit Trail helps companies create a forensic data-level audit trail with up to 10 years of history. 
- You can also set triggers for when data is deleted. 

<a name="orgmetric"></a>
# Org Metric

- Org Metric ERD
![Org metric ERD](img/orgmetric.svg)

<a name="Resources></a>
# Resources

## Platform
- [Salesforce Security Guide](https://resources.docs.salesforce.com/236/latest/en-us/sfdc/pdf/salesforce_security_impl_guide.pdf)

- [Trust | Security](https://security.salesforce.com/)
- [Security for Administrators](https://security.salesforce.com/security-for-administrators)
- [Security for Developers](https://security.salesforce.com/security-for-developers)

- [Sharing Model](https://mohan-chinnappan-n2.github.io/2020/sharing/sharing.html)
- [Sharing Debugger](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/sharing.md)
- [How to get Apex Classes and checking the sharing using DX ?](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/apex.md)
- [Sharing Data model interactive](https://mohan-chinnappan-n.github.io/sfdc/fs-cloud/model-sfdc.html)

- [Viewing and Visualizing Event Log files using DX](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/monitoring/em.md)

## Community Cloud
- [Community (Experience Cloud) Related Resources ](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/cc.md)
- [Community Cloud Security](https://mohan-chinnappan-n2.github.io/2020/cc/security/security.html)
- [Community Cloud Tips](https://mohan-chinnappan-n2.github.io/2020/cc/cc.html#0)

- [Enable Clickjack Protection in Experience Cloud Sites](https://help.salesforce.com/s/articleView?id=sf.networks_clickjack_protection.htm&type=5)

## Data Models
- ![Sales Cloud](https://architect.salesforce.com/1/asset/immutable/s/fda8cbf/assets/images/data-models/sales-cloud-overview-data-model.png)
- ![Service Cloud](https://architect.salesforce.com/1/asset/immutable/s/395d3ea/assets/images/data-models/service-cloud-support-overview-data-model.png)
- ![Task and Events](https://architect.salesforce.com/1/asset/immutable/s/cb88450/assets/images/data-models/platform-tasks-events-data-model.png)
- ![Product and Price Book](https://architect.salesforce.com/1/asset/immutable/s/694cdeb/assets/images/data-models/sales-cloud-product-price-book-data-model.png)
- [Reference Architecture Gallery](https://architect.salesforce.com/design/#architecture-gallery)

- [Model Notation](https://architect.salesforce.com/design/diagram-templates/data-model-notation/)

# Creation 
```
sfdx mohanc:slides:gen -i security.md -o security.md.html -t "Salesforce Security"
```

# Single page view
- [View it as a single page](https://github.com/mohan-chinnappan-n5/mohan-chinnappan-n5.github.io/blob/master/sf-security/security.md)
