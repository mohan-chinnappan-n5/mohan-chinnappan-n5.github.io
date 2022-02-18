# Goals
- The Salesforce security features enable you to empower your users to do their jobs safely and efficiently

- Implement security controls that you think are appropriate for the sensitivity of your data. 

- Protect your data from unauthorized access from outside your company and from inappropriate usage by your users.


# Security Health Check
|Item|Section|Standard Value|
|---|---|---|
|Enable clickjack protection for customer Visualforce pages with standard headers|Session settings|Enabled|

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
- 1. Allow framing by any page (**no protection**)
- 2. Allows framing of your Visualforce site pages by pages on your external domains that are added to the *Trusted Domains for Inline Frames list*. 
- **3.** Allow framing by the **same origin** only (**recommended**): The default level for Experience Cloud sites. 
- 4. Don’t allow framing by any page (**most protection**): The most secure level
    - But for Salesforce Tabs + Visualforce sites, it can cause certain pages to appear **as blank pages**. 
    - To avoid this issue, **use the default setting instead**.


# Phishing
- Technique that attempts to acquire sensitive information, such as usernames, passwords, and credit card details, by masquerading (pretend to be someone one is not) as a trustworthy person or entity. 
- Can occur via:
    - email, text messaging, voice calls, and other avenues.
- With a goal to:
    - direct targets (users) to click a link and enter valuable information or to open an attachment with the goal of downloading malware onto the target’s device.
## Malware 
- is a software designed to infiltrate or damage a computer system **without the owner's informed consent**.


# Health Check

- [Use Health Check to Scan Your Security Configurations](https://trailhead.salesforce.com/en/content/learn/modules/security_basics/security_basics_healthcheck)
- [Video: Learn About Security Health Check (Lightning Experience) | Salesforce](https://www.youtube.com/watch?v=jC0ciHZrkh0)

# User Audit
- [Admin Best Practices: Remove Security Risks From Your Org With a User Audit](https://trailhead.salesforce.com/live/videos/a2r3k000001n2jh/admin-best-practices-remove-security-risks-from-your-org-with-a-user-audit/)


|Step|Details|
|---|---|
|Maintain|Maintain an accurate user roster and ensure the **principle of least privileges** applied to user permissions|
|Review|Correctly Configure user access within the org  using **permission sets, permission set groups, FLS**|
|Align|Protect access to a Salesforce org by implementing security controls such as **MFA, SSO and Login IP Ranges**|
|Analyze|Gain visibility into the security of an org using tools like: **Health Check, Optimizer, Security Center**|


|Bad Practice|Best Pratice|
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

|User Audit Action Items|
|---|
|Custom profiles that have system admin privileges|
|Active users who haven't logged in within 60 days|
|Unused roles, profiles, permission sets|
|Setup Audit Trail|
|A large number (5+) of system admin users or users utilizing admin permissions|
|Re-run Salesforce Optimizer for a fresh report to track progress|


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

# Optimizer 
![Optimizer ](img/optimizer-report-1.png)

# Resources

## Platform
- [Salesforce Security Guide](https://resources.docs.salesforce.com/236/latest/en-us/sfdc/pdf/salesforce_security_impl_guide.pdf)

- [Trust | Security](https://security.salesforce.com/)
- [Security for Administrators]()
----

- [Sharing Model](https://mohan-chinnappan-n2.github.io/2020/sharing/sharing.html)
- [Sharing Debugger](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/sharing.md)
- [How to get Apex Classes and checking the sharing using DX ?](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/apex.md)
- [Sharing Data model interactive](https://mohan-chinnappan-n.github.io/sfdc/fs-cloud/model-sfdc.html)

## Community Cloud
- [Community (Experience Cloud) Related Resources ](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/cc.md)
- [Community Cloud Security](https://mohan-chinnappan-n2.github.io/2020/cc/security/security.html)
- [Community Cloud Tips](https://mohan-chinnappan-n2.github.io/2020/cc/cc.html#0)

---
- [Enable Clickjack Protection in Experience Cloud Sites](https://help.salesforce.com/s/articleView?id=sf.networks_clickjack_protection.htm&type=5)

# Creation 
```sfdx mohanc:slides:gen -i security.md -o security.md.html -t "Salesforce Security"sfdx mohanc:slides:gen -i security.md -o security.md.html -t "Salesforce Security" ```