# DevOps Center

![Arch](../img/cover/chromecast-arch-2.jpg)

![DOC-1](https://d259t2jj6zp7qm.cloudfront.net/images/20221208173010/Untitled-design-3-2000x777.png)


##  DevOps Center Features

-  DevOps Center brings best practices to the entire development community around
    - source management
    - change management
    - release management 

through a click-based interface.

|Feature|Comments|
|----|----|
|Changes are tracked automatically||
|The source control repository is your source of truth for project changes, so you always know that everyone is working with a consistent set of metadata||
|Source control branches are **created and managed** for you. You can move the changes through the release pipeline by clicks||
|Provides visibility into each other’s changes regardless of how they’re doing their work||
|Uses DX under the hood, but you do not have to know them|DX Project, Metadata API, version control|


## How to release changes more efficiently using DevOps center?

|Persona|Currently Using|Skill set|
|----|----|----|
|Salesforce admin and **declarative developer**|Change Sets|Not familiar with version control|
|Programmatic developer|DX tooling, likes to  more visibility into the admin’s changes|Familiar with using CLI|
|Release manager|Responsible for deploying changes for both teammates through the release pipeline|Familiar with version control, CLI and Change sets|

## Work Item (WI) based
![DOC-WI](https://d259t2jj6zp7qm.cloudfront.net/images/20221208173141/Untitled-design-2-1.png)


## Flow for Salesforce admin and declarative developer 

- Performs following with clicks in DevOps Center

 ```mermaid
    graph TD;
        A[Declarative developer creates a Work Item \n in DevOps Center]-->B[Performs her work in a Developer Sandbox];
        B-->C[Pull her changes from the Developer Sandbox and\n commits them into version control\n and create review];
        C-->D[Promote her changes];
     
```

## Flow for Programmatic developer


- Performs following with clicks in DevOps Center

 ```mermaid
    graph TD;
        A[Programmatic developer creates a Work Item \n in DevOps Center]-->B[Performs his work in the 'work item feature branch'\n using IDE];
    
        B-->C[Commits and merges those changes directly\n in the version control];
```

![DOC2](https://d259t2jj6zp7qm.cloudfront.net/images/20221208173102/Untitled-design-1-1-2000x777.png)


## Flow for Release Manager

- Performs following with clicks in DevOps Center

 ```mermaid
    graph TD;
        A[View the changes]-->B[Promote changes either from within DevOps Center or \nusing Salesforce CLI];
    
 ```




 


## Key features
- **Work item**
    -  Defines the requirement for **the change to be made** 
     - Tracks the associated metadata source files through the release lifecycle. 
     - Increases visibility regarding where changes reside in each pipeline stage.

- **Conflict management**
    -  Identifies work items that **have conflicts** with other work items in the pipeline
    -  Provides information to help you resolve the conflict.

- **Dev environment synchronization** 
    - Detects when a development environment is out-of-date so you can ensure that you’re working against the latest source of truth. 
    - Tells you what’s different, and enables you to synchronize it to avoid future conflicts.

- **Activity history** 
    - Provides increased visibility, auditability, and error tracking in both work item and pipeline views. 
    - Tells you what’s different, and enables you to synchronize it to avoid future conflicts.

- **Ability to delete metadata:** 
    - Removes the component from the target stages, leveraging the Metadata API destructive changes functionality.
- **Validation-only deployments**
    - Enables you to run a validation-only deployment, and, at a later time, perform a quick deployment

## Installing DevOps Center
![DOC-install](https://d259t2jj6zp7qm.cloudfront.net/images/20221208173232/image-16.png)
## References
- [Say Hello to DevOps Center](https://trailhead.salesforce.com/content/learn/modules/devops-center-quick-look/say-hello-to-devops-center)
- [Get Up and Running with DevOps Center Today](https://developer.salesforce.com/blogs/2022/06/get-up-and-running-with-devops-center-today)


## Videos
- [Salesforce DevOps Center - Complete Setup and Demo](https://youtu.be/otvLf2eYlrk)