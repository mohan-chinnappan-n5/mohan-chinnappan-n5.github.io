// Types.js, part of bundler builder
// mohan chinnappan
// keep this upto-date for each Salesforce release
//---------------------------------------------
export class Types {
  // Mapping of type names to folder names and file extensions
  static typeInfoMap = {
    ApexClass: {
      folderName: "classes",
      getFileAttributes: (member) => {
        return {
          folderName: `classes`,
          fileNames: [`${member}.cls`, `${member}.cls-meta.xml`],
        };
      },
    },
    ApexTrigger: {
      folderName: "triggers",
      getFileAttributes: (member) => {
        return {
          folderName: `triggers`,
          fileNames: [`${member}.trigger`, `${member}.trigger-meta.xml`],
        };
      },
    },


    ApexPage: {
      folderName: "pages",
      getFileAttributes: (member) => {
        return {
          folderName: `pages`,
          fileNames: [`${member}.page`, `${member}.page-meta.xml`],
        };
      },
    },

    AssignmentRule: {
      once:true,
      folderName: "assignmentRules",
      getFileAttributes: (member) => {
        return {
          folderName: `assignmentRules`,
          fileNames: [ ``],
        };
      },
      copyAllFiles: true,
    },

    AssignmentRules: {
      once:true,
      folderName: "assignmentRules",
      getFileAttributes: (member) => {
        return {
          folderName: `assignmentRules`,
          fileNames: [ ``],
        };
      },
      copyAllFiles: true,
    },

  


    CustomNotificationType: {
      folderName: "notificationtypes",
      getFileAttributes: (member) => {
        return {
          folderName: `notificationtypes`,
          fileNames: [`${member}.notiftype-meta.xml`],
        };
      },
    },

  

    Audience: {
      folderName: "audience",
      getFileAttributes: (member) => {
        return {
          folderName: `audience`,
          fileNames: [`${member}.audience-meta.xml`],
        };
      },
    },

    BusinessProcess: {
      folderName: "objects",
      getFileAttributes: (member) => {
        const parts = member.split(".");
        if (parts.length === 2) {
          const [folder, filename] = parts;
          return {
            folderName: `objects/${folder}/businessProcesses`,
            fileNames: [`${filename}.businessProcess-meta.xml`],
          };
        }
        return {
          folderName: "objects",
          fileNames: [""],
        };
      },
    },
    

    ContentAsset: {
      folderName: "contentassets",
      getFileAttributes: (member) => {
        return {
          folderName: `contentassets`,
          fileNames: [`${member}.asset`, `${member}.asset-meta.xml`],
        };
      },
    },

    BrandingSet: {
      folderName: "brandingSets",
      getFileAttributes: (member) => {
        return {
          folderName: `brandingSets`,
          fileNames: [`${member}.brandingSet-meta.xml`],
        };
      },
    },

    Flow: {
      folderName: "flows",
      getFileAttributes: (member) => {
        return {
          folderName: `flows`,
          fileNames: [`${member}.flow-meta.xml`],
        };
      },
    },

    FlowDefinition: {
      folderName: "flowDefinitions",
      getFileAttributes: (member) => {
        return {
          folderName: `flowDefinitions`,
          fileNames: [`${member}.flowDefinition-meta.xml`],
        };
      },
    },

    DataCategoryGroup: {
      folderName: "datacategorygroups",
      getFileAttributes: (member) => {
        return {
          folderName: `datacategorygroups`,
          fileNames: [`${member}.datacategorygroup-meta.xml`],
        };
      },
    },

    DelegateGroup: {
      folderName: "delegateGroups",
      getFileAttributes: (member) => {
        return {
          folderName: `delegateGroups`,
          fileNames: [`${member}.delegateGroup-meta.xml`],
        };
      },
    },

    FlexiPage: {
      folderName: "flexipages",
      getFileAttributes: (member) => {
        return {
          folderName: `flexipages`,
          fileNames: [`${member}.flexipage-meta.xml`],
        };
      },
    },

    PermissionSetGroup: {
      folderName: "permissionsetgroups",
      getFileAttributes: (member) => {
        return {
          folderName: `permissionsetgroups`,
          fileNames: [`${member}.permissionsetgroup-meta.xml`],
        };
      },
    },

    PermissionSet: {
      folderName: "permissionsets",
      getFileAttributes: (member) => {
        return {
          folderName: `permissionsets`,
          fileNames: [`${member}.permissionset-meta.xml`],
        };
      },
    },

    MutingPermissionSet: {
      folderName: "mutingpermissionsets",
      getFileAttributes: (member) => {
        return {
          folderName: `mutingpermissionsets`,
          fileNames: [`${member}.mutingpermissionset-meta.xml`],
        };
      },
    },

    Profile: {
      folderName: "profiles",
      getFileAttributes: (member) => {
        return {
          folderName: `profiles`,
          fileNames: [`${member}.profile-meta.xml`],
        };
      },
    },

    PermissionSetGroup: {
      folderName: "permissionsetgroups",
      getFileAttributes: (member) => {
        return {
          folderName: `permissionsetgroups`,
          fileNames: [`${member}.permissionsetgroup-meta.xml`],
        };
      },
    },

    ReportType: {
      folderName: "reportTypes",
      getFileAttributes: (member) => {
        return {
          folderName: `reportTypes`,
          fileNames: [`${member}.reportType-meta.xml`],
        };
      },
    },

    QuickAction: {
      folderName: "quickActions",
      getFileAttributes: (member) => {
        return {
          folderName: `quickActions`,
          fileNames: [`${member}.quickAction-meta.xml`],
        };
      },
    },

    CustomApplication: {
      folderName: "applications",
      getFileAttributes: (member) => {
        return {
          folderName: `applications`,
          fileNames: [`${member}.app-meta.xml`],
        };
      },
    },

    LeadConvertSettings: {
      folderName: "LeadConvertSettings",
      getFileAttributes: (member) => {
        return {
          folderName: `LeadConvertSettings`,
          fileNames: [`${member}.LeadConvertSetting-meta.xml`],
        };
      },
    },

    DuplicateRule: {
      folderName: "duplicateRules",
      getFileAttributes: (member) => {
        return {
          folderName: `duplicateRules`,
          fileNames: [`${member}.duplicateRule-meta.xml`],
        };
      },
    },

    ApprovalProcess: {
      folderName: "approvalProcesses",
      getFileAttributes: (member) => {
        return {
          folderName: `approvalProcesses`,
          fileNames: [`${member}.approvalProcess-meta.xml`],
        };
      },
    },

 

    Layout: {
      folderName: "layouts",
      getFileAttributes: (member) => {
        return {
          folderName: `layouts`,
          fileNames: [`${member}.layout-meta.xml`],
        };
      },
    },

    CustomPermission: {
      folderName: "customPermissions",
      getFileAttributes: (member) => {
        return {
          folderName: `customPermissions`,
          fileNames: [`${member}.customPermission-meta.xml`],
        };
      },
    },

    Document: {
      once:true,
      folderName: "documents",
      getFileAttributes: (member) => {
        return {
          folderName: `documents`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },

    Report: {
      once: true,
      folderName: "reports",
      getFileAttributes: (member) => {
        return {
          folderName: `reports`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },


    ReportOld: {
      folderName: "reports",
      getFileAttributes: (member) => {
        const parts = member.split("/");
        if (parts.length === 2) {
          const [folder, filename] = parts;
          return {
            folderName: `reports/${folder}`,
            fileNames: [`${filename}.report-meta.xml` ],
          };
        }
        return {
          folderName: "reports",
          fileNames: [""],
        };
      },
    },

    LightningComponentBundle: {
      folderName: "lwc",
      getFileAttributes: (member) => {
        return {
          folderName: `lwc`,
          fileNames: [`${member}`],
        };
      },
      copyAllFiles: true,
    },


     Territory2: {
      once: true,
      folderName: "territory2Models",
      getFileAttributes: (member) => {
        return {
          folderName: `territory2Models`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },

    

 
    Territory2Rule: {
      once: true,
      folderName: "territory2Models",
      getFileAttributes: (member) => {
        return {
          folderName: `territory2Models`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },
    

    Territory2Type: {
      once: true,
      folderName: "territory2Types",
      getFileAttributes: (member) => {
        return {
          folderName: `territory2Types`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    }, 

    Workflow: {
      once:true,
      folderName: "workflows",
      getFileAttributes: (member) => {
        return {
          folderName: `workflows`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },

    WorkflowAlert: {
      once:true,
      folderName: "workflows",
      getFileAttributes: (member) => {
        return {
          folderName: `workflows`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },

    WorkflowFieldUpdate: {
      once: true,
      folderName: "workflows",
      getFileAttributes: (member) => {
        return {
          folderName: `workflows`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },


    WorkflowKnowledgePublish: {
      once:true,
      folderName: "workflows",
      getFileAttributes: (member) => {
        return {
          folderName: `workflows`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },

    



   PlatformEventChannel: {
      folderName: "platformEventChannels",
      getFileAttributes: (member) => {
        return {
          folderName: `platformEventChannels`,
          fileNames: [`${member}.platformEventChannel-meta.xml`],
        };
      },
    }, 

    PlatformEventChannelMember: {
      folderName: "platformEventChannelMembers",
      getFileAttributes: (member) => {
        return {
          folderName: `platformEventChannelMembers`,
          fileNames: [`${member}.platformEventChannelMember-meta.xml`],
        };
      },
      copyAllFiles: true,
    },


    Queue: {
      folderName: "queues",
      getFileAttributes: (member) => {
        return {
          folderName: `queues`,
          fileNames: [`${member}.queue-meta.xml`],
        };
      },
    },
    
    
    Role: {
      folderName: "roles",
      getFileAttributes: (member) => {
        return {
          folderName: `roles`,
          fileNames: [`${member}.role-meta.xml`],
        };
      },
    }, 

    Settings: {
      folderName: "settings",
      getFileAttributes: (member) => {
        return {
          folderName: `settings`,
          fileNames: [`${member}.settings-meta.xml`],
        };
      },
    }, 

    SharingRules: {
      folderName: "sharingRules",
      getFileAttributes: (member) => {
        return {
          folderName: `sharingRules`,
          fileNames: [`${member}.sharingRules-meta.xml`],
        };
      },
    },

    SharingCriteriaRule: {
      once:true,
      folderName: "sharingRules",
      getFileAttributes: (member) => {
        return {
          folderName: `sharingRules`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },

    

    CustomObjectTranslation: {
      folderName: "objectTranslations",
      getFileAttributes: (member) => {
        return {
          folderName: `objectTranslations`,
          fileNames: [`${member}`],
        };
      },
      copyAllFiles: true,
    },

   

    ExperienceBundle: {
      folderName: "experiences",
      getFileAttributes: (member) => {
        return {
          folderName: `experiences`,
          fileNames: [`${member}`, `${member}.site-meta.xml`],
        };
      },
      copyAllFiles: true,
    },

    AuraDefinitionBundle: {
      folderName: "aura",
      getFileAttributes: (member) => {
        return {
          folderName: `aura`,
          fileNames: [`${member}`],
        };
      },
      copyAllFiles: true,
    },



    WaveApplication: {
      folderName: "wave",
      getFileAttributes: (member) => {
        return {
          folderName: `wave`,
          fileNames: [`${member}.wapp-meta.xml`],
        };
      },
    },


    WaveComponent: {
      folderName: "wave",
      getFileAttributes: (member) => {
        return {
          folderName: `wave`,
          fileNames: [`${member}.wcomp`, `${member}.wcomp-meta.xml`],
        };
      },
    },

    WaveDataset: {
      folderName: "wave",
      getFileAttributes: (member) => {
        return {
          folderName: `wave`,
          fileNames: [`${member}.wds-meta.xml`],
        };
      },
    },

 

    WaveDashboard: {
      folderName: "wave",
      getFileAttributes: (member) => {
        return {
          folderName: `wave`,
          fileNames: [`${member}.wdash`, `${member}.wdash-meta.xml`],
        };
      },
    },

    WaveDataflow: {
      folderName: "wave",
      getFileAttributes: (member) => {
        return {
          folderName: `wave`,
          fileNames: [`${member}.wdf`, `${member}.wdf-meta.xml`],
        };
      },
    },

    WaveLens: {
      folderName: "wave",
      getFileAttributes: (member) => {
        return {
          folderName: `wave`,
          fileNames: [`${member}.wlens`, `${member}.wlens-meta.xml`],
        };
      },
    },

    WaveRecipe: {
      folderName: "wave",
      getFileAttributes: (member) => {
        return {
          folderName: `wave`,
          fileNames: [`${member}.wdpr`, `${member}.wdpr-meta.xml`],
        };
      },
    },

    WaveXmd: {
      folderName: "wave",
      getFileAttributes: (member) => {
        return {
          folderName: `wave`,
          fileNames: [`${member}.xmd-meta.xml`],
        };
      },
    },

    CustomMetadata: {
      folderName: "customMetadata",
      getFileAttributes: (member) => {
        return {
          folderName: `customMetadata`,
          fileNames: [`${member}.md-meta.xml`],
        };
      },
    },

    CustomLabel: {
      once: true,
      folderName: "labels",
      getFileAttributes: (member) => {
        return {
          folderName: `labels`,
          fileNames: [`CustomLabels.labels-meta.xml`],
        };
      },
      copyAllFiles: true,
    },

    CustomLabels: {
      once: true,
      folderName: "labels",
      getFileAttributes: (member) => {
        return {
          folderName: `labels`,
          fileNames: [`CustomLabels.labels-meta.xml`],
        };
      },
      copyAllFiles: true,
    },



    StaticResource: {
      once: true,
      folderName: "staticresources",
      getFileAttributes: (member) => {
        return {
          folderName: `staticresources`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },

    EmailTemplate: {
      once:true,
      folderName: "email",
      getFileAttributes: (member) => {
        return {
          folderName: `email`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },

    Dashboard: {
      once:true,
      folderName: "dashboards",
      getFileAttributes: (member) => {
        return {
          folderName: `dashboards`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },

    PathAssistant: {
      folderName: "pathAssistants",
      getFileAttributes: (member) => {
        return {
          folderName: `pathAssistants`,
          fileNames: [`${member}.pathAssistant-meta.xml`],
        };
      },
    },

    GlobalValueSet: {
      folderName: "globalValueSets",
      getFileAttributes: (member) => {
        return {
          folderName: `globalValueSets`,
          fileNames: [`${member}.globalValueSet-meta.xml`],
        };
      },
    },

    CustomTab: {
      folderName: "tabs",
      getFileAttributes: (member) => {
        return {
          folderName: `tabs`,
          fileNames: [`${member}.tab-meta.xml`],
        };
      },
    },

    CustomObject: {
      folderName: "objects",
      getFileAttributes: (member) => {
        return {
          folderName: `objects/${member}`,
          fileNames: [`${member}.object-meta.xml`],
        };
      },
    },

    CustomField: {
      folderName: "objects",
      getFileAttributes: (member) => {
        const parts = member.split(".");
        if (parts.length === 2) {
          const [folder, filename] = parts;
          return {
            folderName: `objects/${folder}/fields`,
            fileNames: [`${filename}.field-meta.xml`],
          };
        }
        return {
          folderName: "objects",
          fileNames: [""],
        };
      },
    },

    MatchingRule: {
      folderName: "matchingRules",
      getFileAttributes: (member) => {
        return {
          folderName: `matchingRules`,
          fileNames: [`${member}.matchingRule-meta.xml`],
        };
      },
    },

    MatchingRules   : {
      once:true,
      folderName: "matchingRules",
      getFileAttributes: (member) => {
        return {
          folderName: `matchingRules`,
          fileNames: [``],
        };
      },
      copyAllFiles: true,
    },

 


    NavigationMenu: {
      folderName: "navigationMenus",
      getFileAttributes: (member) => {
        return {
          folderName: `navigationMenus`,
          fileNames: [`${member}.navigationMenu-meta.xml`],
        };
      },
    },

    SharingSet: {
      folderName: "sharingSets",
      getFileAttributes: (member) => {
        return {
          folderName: `sharingSets`,
          fileNames: [`${member}.sharingSet-meta.xml`],
        };
      },
    },


    StandardValueSet: {
      folderName: "standardValueSets",
      getFileAttributes: (member) => {
        return {
          folderName: `standardValueSets`,
          fileNames: [`${member}.standardValueSet-meta.xml`],
        };
      },
    },




   



    FieldSet: {
      folderName: "objects",
      getFileAttributes: (member) => {
        const parts = member.split(".");
        if (parts.length === 2) {
          const [folder, filename] = parts;
          return {
            folderName: `objects/${folder}/fieldSets`,
            fileNames: [`${filename}.fieldSet-meta.xml`],
          };
        }
        return {
          folderName: "objects",
          fileNames: [""],
        };
      },
    },

    WebLink: {
      folderName: "objects",
      getFileAttributes: (member) => {
        const parts = member.split(".");
        if (parts.length === 2) {
          const [folder, filename] = parts;
          return {
            folderName: `objects/${folder}/webLinks`,
            fileNames: [`${filename}.webLink-meta.xml`],
          };
        }
        return {
          folderName: "objects",
          fileNames: [""],
        };
      },
    },


 
    


    CompactLayout: {
      folderName: "objects",
      getFileAttributes: (member) => {
        const parts = member.split(".");
        if (parts.length === 2) {
          const [folder, filename] = parts;
          return {
            folderName: `objects/${folder}/compactLayouts`,
            fileNames: [`${filename}.compactLayout-meta.xml`],
          };
        }
        return {
          folderName: "objects",
          fileNames: [""],
        };
      },
    },
    ListView: {
      folderName: "objects",
      getFileAttributes: (member) => {
        const parts = member.split(".");
        if (parts.length === 2) {
          const [folder, filename] = parts;
          return {
            folderName: `objects/${folder}/listViews`,
            fileNames: [`${filename}.listView-meta.xml`],
          };
        }
        return {
          folderName: "objects",
          fileNames: [""],
        };
      },
    },

    RecordType: {
      folderName: "objects",
      getFileAttributes: (member) => {
        const parts = member.split(".");
        if (parts.length === 2) {
          const [folder, filename] = parts;
          return {
            folderName: `objects/${folder}/recordTypes`,
            fileNames: [`${filename}.recordType-meta.xml`],
          };
        }
        return {
          folderName: "objects",
          fileNames: [""],
        };
      },
    },

    ValidationRule: {
      folderName: "objects",
      getFileAttributes: (member) => {
        const parts = member.split(".");
        if (parts.length === 2) {
          const [folder, filename] = parts;
          return {
            folderName: `objects/${folder}/validationRules`,
            fileNames: [`${filename}.validationRule-meta.xml`],
          };
        }
        return {
          folderName: "objects",
          fileNames: [""],
        };
      },
    },

    Group: {
      folderName: "groups",
      getFileAttributes: (member) => {
        return {
          folderName: `groups`,
          fileNames: [`${member}.group-meta.xml`],
        };
      },
    },

    LightningMessageChannel: {
      folderName: "messageChannels",
      getFileAttributes: (member) => {
        return {
          folderName: `messageChannels`,
          fileNames: [`${member}.messageChannel-meta.xml`],
        };
      },
    },
    RestrictionRule: {
      folderName: "restrictionRules",
      getFileAttributes: (member) => {
        return {
          folderName: `restrictionRules`,
          fileNames: [`${member}.rule-meta.xml`],
        };
      },
    },

    // Add more mappings for other types if needed
  };
}
