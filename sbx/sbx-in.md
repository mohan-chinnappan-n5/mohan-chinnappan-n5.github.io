# Create a Pre-refresh Checklist

#  Minimize Downtime 
- Right refresh window (taking care of developers developing new features, UAT and Training users
- Makes sure that refresh window aligns with Salesforce release window
  
- For each sandbox
    - Salesforce **sandbox refreshes take time** - It is a function of amount of configuration and metadata it contains
    - Determine a window for running sandbox refresh - this could take around 2 days 
    - During this window the **sandbox won’t be available**
    - Type of sandbox determines **how often** it can be refreshed:
        - Developer, Developer Pro - 1 day
        - Partial Copy  - 5 days
        - Full Copy - 29 days

    -  **Refreshing the sandbox will delete all that metadata (that is not yet committed in to Production)**


#  Sandbox Refresh Communication
- Communicate early and often about the Sandbox Refresh
- Use custom metadata types (mdt) in production, so they’re easily modified 
- Use custom settings and/or custom metadata types to specify email addresses, integration endpoints, etc. 
    - modify these values post-refresh
   -  Have 2 records per metadata type—one for production and one for sandboxes
   -  Apex classes can then use the ```IsSandbox``` property to dynamically choose which metadata type to use at runtime. 
   ```sql
            SELECT IsSandbox FROM Organization LIMIT 1
   ```
   ![isSandbox](https://mohan-chinnappan-n5.github.io/sfbooks/sfdevnotes/deployments/img/isSandbox.png)

#  Create a Post-refresh Checklist
- After refreshing a sandbox take care of removing production endpoints
- [SandboxPostCopy](https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_interface_System_SandboxPostCopy.htm)  to extend this interface and add methods to perform post-copy tasks, then specify the class during sandbox creation.



```java
    global class PrepareMySandbox implements SandboxPostCopy {
 
    global PrepareMySandbox() {
        //Implementations of SandboxPostCopy must have a no-arg constructor.
        //This constructor is used during the sandbox copy process.
        //You can also implement constructors with arguments, but be aware that
        //they won’t be used by the sandbox copy process (unless as part of the
        //no-arg constructor).
        this(some_args);
    }
 
    global PrepareMySandbox(String some_args) {
        //Logic for constructor.
    }
    
    global void runApexClass(SandboxContext context) {
        System.debug('Org ID: ' + context.organizationId());
        System.debug('Sandbox ID: ' + context.sandboxId());
        System.debug('Sandbox Name: ' + context.sandboxName());
 
        // Insert logic here to prepare the sandbox for use.
    }
}
```

#  Take care of configuration data 
- This is not metadata
- Import it using the Data Loader or Import Wizard.
- Some AppExchange apps use custom object for the configuration. When we create a new sandbox that does not include data, these apps will not work after the sandbox refresh. 
- For master-detail relationships - insert the parent records before any child records

# Sandbox types and use cases

![Sbx type](https://mohan-chinnappan-n5.github.io/sfbooks/sfdevnotes/img/devops/sbx-1.png)

![SBx use cases](https://mohan-chinnappan-n5.github.io/sfbooks/sfdevnotes/img/devops/sbx-2.png)
