# Custom Metadata Types


- Records in a Custom Metadata Type are Metadata not data
- You can package Custom Metadata Type Records

- Data Objects
    - Used By users
    - For the business
    - **Standard**
        - Account, Contact, Opportunity
    - **Custom**
        - Warranty, Invoice, Project, CaronCredit...

- Metadata Types
    - Used by Admins
    - For the App
    - **Standard**
        - Validation Rules
        - Account settings
        - Custom Object Translation
   - **Custom**
        - Stock point Rule
        - Warranty Settings

- Custom Settings 
    - Data in Custom Setting is unpackageable


## CLI

```
# Creates a new custom metadata type in the current project.
force:cmdt:create
sfdx force:cmdt:create --typename MyCustomType
sfdx force:cmdt:create --typename MyCustomType --label "Custom Type" --plurallabel "Custom Types" --visibility Protected


# Generate a custom metadata field based on the field type provided.
force:cmdt:field:create
sfdx force:cmdt:field:create --fieldname MyField --fieldtype Checkbox
sfdx force:cmdt:field:create --fieldname MyField --fieldtype Picklist --picklistvalues "A,B,C"
sfdx force:cmdt:field:create --fieldname MyField --fieldtype Number --decimalplaces 2





# Generates a custom metadata type and all its records for the provided sObject.
force:cmdt:generate
sfdx force:cmdt:generate --devname MyCMDT --sobjectname MySourceObject__c
sfdx force:cmdt:generate --devname MyCMDT --sobjectname MySourceObject__c  --ignoreunsupported --targetusername 'alias or user email of the org containing the source type'




# Create a new record for a given custom metadata type in the current project.
force:cmdt:record:create
sfdx force:cmdt:record:create --typename MyCMT__mdt --recordname MyRecord My_Custom_Field_1=Foo My_Custom_Field_2=Bar



# Create new custom metadata type records from a CSV file.
force:cmdt:record:insert
sfdx force:cmdt:record:insert --filepath path/to/my.csv --typename My_CMDT_Name





```

<iframe width="920" height="520" src="https://www.youtube.com/embed/RA8v6KKvXqI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>