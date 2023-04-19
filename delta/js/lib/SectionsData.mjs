/*

  Section Object data


*/


export const sectionsObj = {

    "Profile":
    {
       "applicationVisibilities": "application",
       "classAccesses": "apexClass",
       "customPermissions": "name",
       "customMetadataTypeAccesses": "name",
       "fieldPermissions": "field",
       "layoutAssignments": "layout",
       "objectPermissions": "object",
       "recordTypeVisibilities": "recordType",
       "tabVisibilities": "tab",
       "userPermissions": "name",
       "customSettingAccesses": "name",
       "pageAccesses": "apexPage"
   },

   "PermissionSet":
    {
       "applicationVisibilities": "application",
       "classAccesses": "apexClass",
       "customPermissions": "name",
       "customMetadataTypeAccesses": "name",
       "fieldPermissions": "field",
       "layoutAssignments": "layout",
       "objectPermissions": "object",
       "recordTypeVisibilities": "recordType",
       "tabVisibilities": "tab",
       "userPermissions": "name",
       "customSettingAccesses": "name",
       "pageAccesses": "apexPage"
   },
   "CustomLabels": {
       "labels": "fullName"

   }

}

export const selectionMap = {
    'profile3': 'Admin.profile-meta',
    'permissionset3': 'Experience_Profile_Manager.permissionset-meta',
    'package': 'package',
    'customlabel2': 'CustomLabels.labels-meta',
    'customlabel3': 'CustomLabels.labels-meta',
    'flexipage': 'flexipage',
    'samlrequest': 'samlrequest',
    'samlresponse': 'samlresponse',
    'pmd-report-v2': "pmd-report",
    'pmd-ruleset': "apex_ruleset"
}

export const xmlxsltMap = {
    'Profile': 'profile3',
    "PermissionSet": "permissionset3",
    "CustomLabels": "customlabel2"
}