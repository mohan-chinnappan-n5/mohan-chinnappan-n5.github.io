# Shield

## Topics
- [Best Practices](#bp)
- [Key Management](#km)
- [Shield Setup](#setup)
- [FAQ](#faq)

----
<a name='bp'></a>
## Best Practices 
- Take the time to identify the most likely threats to your org
    - Distinguish data that needs encryption from data that doesn’t, so that you can **encrypt only what you need 
    to**. Not all data is sensitive.
    - Focus on information that requires encryption to meet your regulatory, security, compliance, and privacy requirements. Unnecessarily encrypting data impacts functionality and performance.
    - Balance **business-critical functionality** against **security and risk measures** and challenge your assumptions periodically.

    - Your tenant secret and keys are backed up, and be careful **who you allow to manage your secrets and keys**.
        - If your tenant secrets are destroyed, reimport them to access your data. You are **solely responsible for making sure that your data and tenant secrets are backed up and stored in a safe place**. Salesforce cannot help you with deleted, destroyed, or misplaced tenant secrets.

    - To identify the **threats that are most likely to affect your organization**,
        - Walk through a formal threat modeling exercise. 
        - Use your findings to create a data classification scheme, which can help you decide what data to encrypt.

    - Test Shield Platform Encryption in a **sandbox environment before deploying to a production environment**. Encryption policy settings can be deployed using change sets.

    - Before enabling encryption, fix any violations that you uncover.
        - For example, if you **reference encrypted fields** in a SOQL ORDER BY clause, **a violation occurs**. Fix the violation by removing references to the encrypted fields.

    - If you use **an app from the AppExchange**, test how it interacts with encrypted data in your organization and evaluate whether its functionality is affected.
        - If you suspect Shield Platform Encryption could affect the **functionality of an app**, ask the provider for help with evaluation.
    - Grant the **Manage Encryption Keys** user permission to authorized users only.
        - Users with the Manage Encryption Keys permission can generate, export, import, and destroy organization-specific keys. Monitor the key management activities of these users regularly with the **setup audit trail**.

    - Synchronize your existing data with your active key material.
        - **Existing field and file data is not automatically encrypted** when you turn on Shield Platform Encryption. 
        - To **encrypt existing field data**, update the records associated with the field data. 
            - This action triggers encryption for these records so that your existing data is encrypted at rest. 
            - **To encrypt existing files or get help updating other encrypted data, contact Salesforce**.
            -  We can encrypt existing file data in the background to ensure data alignment with the latest encryption policy and key material
                - When you contact Salesforce support to request the background encryption service, **allow at least a week** before you need the background encryption completed. 
                -  The time to complete the process varies based on the volume of data involved. **It could take several days**.
    - **Currency and Number fields can’t be encrypted** because they could have broad functional consequences across the platform, such as disruptions to roll-up summary reports, report timeframes, and calculations.
    - You can often keep private, sensitive, or regulated data of this variety safe in other encryption-supported field types.

    - Before you enable Shield Platform Encryption in a production environment, **communicate to the users** about how it affects your business solution.

    - When you **generate a new tenant secret**, any new data is encrypted using this key.
        -  However, existing sensitive data **remains encrypted using previous keys**. 
        - In this situation, Salesforce strongly **recommends re-encrypting these fields using the latest key**. Contact Salesforce for help with re-encrypting your data.
    
    - Use discretion when granting **login as access to users** or Salesforce Customer Support.
        - If you grant *login access to a user*, and they have **field level security access to an encrypted field**, that user is **able to view encrypted data in that field in plaintext**.


<a name='km'></a>
## Key Management and Rotation

- Shield Platform Encryption lets you control and rotate the key material used to encrypt your data
- You can use Salesforce to **generate a tenant secret for you**
    -  This is then combined with a **per-release master secret** to derive a **data encryption key**.
    ```
      tenant_secret + per_release_master_secret => data_encryption_key 
    ```
    - This **derived data encryption key** is used in encrypt and decrypt functions
- You can also use the **Bring Your Own Key (BYOK) service** to upload your own key material
- Or store key material outside of Salesforce and have the Cache-Only Key Service fetch **your key material on demand**.

----

<a name='setup'></a>

## Shield Setup
![Shield Setup](img/Shield_setup-2.gif)
    
----

<a name='faq'></a>
## FAQ 


 1.How do I know a Field in an Object is encrypted at rest?
 --------------------------------------------------------

Metadata API - ***describe*** - provides **encrypted** flag value for the encrypted fields as **true** as shown below:

#### Account object encrypted fields:

![Account object encrypted fields:](https://github.com/mohan-chinnappan-n/Shield-setup/raw/master/FAQ/img/account-encrypted-fields.png)

#### Describe on Account Object showing **encrypted flag** for the  encrypted fields:

![describe showing the encrypted flag](https://github.com/mohan-chinnappan-n/Shield-setup/raw/master/FAQ/img/describe-showing-encrypted-flag.png)


#### Describe on Account Object:

![describe showing the Account Object](https://github.com/mohan-chinnappan-n/Shield-setup/raw/master/FAQ/img/account-describe-metadata.png)





### Options for Verifying Encryption:

1. At the request of an organizations admin,  ***Tier 3 security agents*** can run a backend process to provide confirmation details of encrypted fields based on server logs which can be provided to users. Please allow two business days for these requests to process due to complexity of the request.

2. Organization admins can follow the steps below to use **tenant key masking** to verify field encryption at a record level:


      a.     Export **current tenant secret** used to encrypt current data in report and store it in a safe place.

      b.     Generate a **new tenant secret**.

      c.     Destroy the initial key used to encrypt data.

      d.     With the new key active navigate to any record where fields are encrypted and the data will show ????? meaning the data is encrypted.


Note: Once the admin or customer has reviewed the data masked with ????, the old secret used to encrypt the data can be imported back into the org and the new key destroyed as it was not used to encrypt any data.


#### How about Attachments encryption?

In the event that an admin would like to verify encryption on files and attachments the query below can be ran in Developer Console:

 ```sql
     SELECT ContentType, Id, IsEncrypted FROM Attachments WHERE IsEncrypted = false/true
```

The query above will run against attachments and show all content where IsEncrypted = true or false. The attachments option can be replaced with files and content type removed to determine if files are encrypted or decrypted based on the IsEncrypted flag.

For additional information related to platform encryption masking please review our Salesforce article entitled:

 What Does My Encrypted Data Look Like?:
  https://help.salesforce.com/articleView?id=security_pe_masking.htm&type=0



<hr/>

Knowledge Article: 000247422 says: View Encrypted Data Permission Not Needed with Shield Platform Encryption Beginning Spring ‘17
---------------------------------------------------------------------------------------------------------------------------------
Can you explain this with an example?
-------------------------------------

![KB-FLS]https://github.com/mohan-chinnappan-n/Shield-setup/raw/master/FAQ/img/account-describe-metadata.png)
[Reference to this Knowledge Article](https://help.salesforce.com/articleView?id=000247422&type=1)


![Winter17 release-notes](https://github.com/mohan-chinnappan-n/Shield-setup/raw/master/FAQ/img/win17-rel-notes-viewEncryptedData-perm-NN.png)


[Reference: View Encrypted Data” Permission Not Needed with Shield Platform Encryption Beginning Spring ‘17](https://releasenotes.docs.salesforce.com/en-us/winter17/release-notes/rn_security_pe_ved_decouple_announcement.htm)



Let us take an example: In our org, we have an user: **joe simple**

![user joe simple](https://github.com/mohan-chinnappan-n/Shield-setup/raw/master/FAQ/img/user-joe-simple.png)


Joe can see the **encrypted** field: **Account.Fax** but Joe **can't** see the **encrypted** field **Account.Phone** as per FLS for his profile:

#### Account.Fax:
![joe account.fax](https://github.com/mohan-chinnappan-n/Shield-setup/raw/master/FAQ/img/user-joesimple-can-seee-account_fax.png)


#### Account.Phone:
![joe account.phone](https://github.com/mohan-chinnappan-n/Shield-setup/raw/master/FAQ/img/user-joesimple-cannot-see-account_phone.png)



If Joe uses REST API for example, to access Account Object, Joe will be denied access to the field: **Account.Phone** as shown below, while Joe can access **Account.Fax**

![joe cannot access account.phone](https://github.com/mohan-chinnappan-n/Shield-setup/raw/master/FAQ/img/rest-api-user-cannot-access_account_phone.png)

But other user, whose FLS allows **read** on these fields: **Account.Fax** and **Account.Phone** can access these two fields:


![describe showing the encrypted flag](https://github.com/mohan-chinnappan-n/Shield-setup/raw/master/FAQ/img/describe-showing-encrypted-flag.png)


<hr/>



- **Do I have to backup tenant secrets?**

YES!!!

Tenant secrets are not like passwords.

Unlike passwords, you can’t reset a tenant secret. Salesforce can’t help with deleted, destroyed, or misplaced tenant secrets. Always back up tenant secrets!

<hr/>

- **Is the encrypted fields data encrypted at rest?**

YES!

You should use field-level access controls to limit who can access this sensitive data as shown above in question number: 2


About guideline for selecting fields for encrypting?

Unnecessarily encrypting data can slow down performance and affect users day-to-day activities.  Based on your regulatory requirements define the kinds of customer data that require extra security and apply Shield Platform Encryption only to those areas.


- **About automatic encryption?**

Field values are automatically encrypted only in records **created or updated after you’ve enabled encryption**. Salesforce recommends **updating existing records** to ensure that their field values are encrypted. For example, if you encrypt the Description field on the Case object, use the Data Loader to update all case records. Contact Salesforce if you need help with this.


Can you provide technical details about Platform Encryption?

- ![Platform Encryption Flow](https://github.com/mohan-chinnappan-n/Shield-setup/raw/master/FAQ/img/platform-en.png)

 Here is the video answering this question.
  <iframe width="920" height="640" src="https://www.youtube.com/embed/RMUl0fF7x1E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


- **About Sandbox Refresh: How Does Shield Platform Encryption Work In a Sandbox?**

Refreshing a sandbox from a production organization creates an exact copy of the production organization. If Shield Platform Encryption is enabled on the production organization, all encryption settings are copied, including tenant secrets created in production.

Once a sandbox is refreshed, tenant secret changes are confined to your current organization. This means that when you rotate or destroy a tenant secret on sandbox, it doesn’t affect the production organization.

As a best practice, rotate tenant secrets on sandboxes after a refresh. Rotation ensures that production and sandbox use different tenant secrets. Destroying tenant secrets on a sandbox renders encrypted data unusable in cases of partial or full copies.


[How Does Shield Platform Encryption Work in a Sandbox?](https://help.salesforce.com/articleView?id=security_pe_sandboxes.htm&type=5)





### Resources for curious minds:

[Rotate Your Encryption Tenant Secrets - based on your organization’s security policies](https://help.salesforce.com/articleView?id=security_pe_rotate_keys.htm&type=5)



[What’s the Difference Between Classic Encryption and Shield Platform Encryption?](https://help.salesforce.com/articleView?err=1&id=security_pe_comparison_table.htm&siteLang=en_US&type=0)

[How Shield Platform Encryption Works](https://help.salesforce.com/articleView?id=security_pe_concepts.htm&type=0&language=en_US)

[Tradeoffs and Limitations of Shield Platform Encryption](https://help.salesforce.com/articleView?err=1&id=security_pe_considerations.htm&siteLang=en_US&type=0)

[Encrypt Fields](https://help.salesforce.com/articleView?err=1&id=security_pe_enable_standard_fields.htm&siteLang=en_US&type=0&language=en_US)


 

- [View Encrypted Data Permission Not Needed with Shield Platform Encryption Beginning Spring ‘17](https://help.salesforce.com/articleView?id=000247422&type=1)


- [View Encrypted Data” Permission Not Needed with Shield Platform Encryption Beginning Spring ‘17](https://releasenotes.docs.salesforce.com/en-us/winter17/release-notes/rn_security_pe_ved_decouple_announcement.htm)


- [Platform Encryption Best Practices](https://developer.salesforce.com/docs/atlas.en-us.securityImplGuide.meta/securityImplGuide/security_pe_best_practices.htm)

- [SALESFORCE PLATFORM ENCRYPTION](https://resources.docs.salesforce.com/206/latest/en-us/sfdc/pdf/salesforce_platform_encryption_tipsheet.pdf)

- [Tighten Your Security with Salesforce Shield Platform Encryption](https://www.youtube.com/watch?v=sZ9SvYIij4w)

- [Probabilistic encryption](https://en.wikipedia.org/wiki/Probabilistic_encryption)
- [Deterministic encryption](https://en.wikipedia.org/wiki/Deterministic_encryption)



## References
- [Shield Platform Encryption Best Practices](https://help.salesforce.com/s/articleView?id=sf.security_pe_best_practices.htm&type=5)
- [Shield Setup](https://github.com/mohan-chinnappan-n/Shield-setup)
- [Key Management and Rotation](https://help.salesforce.com/s/articleView?id=sf.security_pe_setup.htm&type=5)


<iframe width="600" height="400" src="https://www.youtube.com/embed/KfdfnGSJVYM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>