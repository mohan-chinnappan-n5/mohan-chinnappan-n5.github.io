# Before Deployment


Action|Description|Completed DateTime|
---|---|---|
**Agree on time of deployment**|Set a time in advance and let everyone using the org know:  Out of hours is usually best if possible to avoid user impact and give you time to fix any issues, which means evenings/weekends for most businesses|
**Create deployment Support Case**|Create a support ticket with Salesforce support team on the support for the deployment|
**Check the audit trail**|Check the audit trail in production to ensure no changes have been made that will be overwritten by your deployment|
**Do a Full Export and take backup**|Take a full export/backup of production data prior to deployment. If anything goes wrong, you want to make sure that your data remains intact, so a backup is necessary before any big changes|
**Prepare test scripts**|Prepare the test script you need to run after deployment to ensure everything is working correctly|
**Disable Email Deliverability**|Mass changes can trigger lots of system emails and notifications, so disable email deliverability while you deploy to ensure your users aren’t bombarded with an avalanche of mail. Make sure to note down what you’ve deactivated so you can **reactivate** it after the deployment| 
**Deactivate Rules/ workflow rules /validation rules/flows /process builders**|To prevent them from deploying correctly. Make sure that you run tests after we’ve re-activated these, to ensure we have a fully functioning environment|
**Training and Documentation**|Organize documentation and training sessions prepare for all users.Ensure users should know how to contact you or raise an internal Support ticket with any issues or questions|





 
## Checklist Form

- [Form to fill up](https://mohan-chinnappan-n.github.io/sfdc/deploy-checklist.html#/1)

# Post Deployment
Action|Description|Completed DateTime|
---|---|---|
**Manual changes and data updates**|Make sure workflow rules, process builders and validation rules remain deactivated for this|
**Reactivate Anything Paused**|if you paused your workflows and validation rules during deployment, now is the time to reactivate them|
**Activate Workflows**|Activate your new validation rules/ Process Builders/ workflows– anything that might not be active on deployment|
**Test your changes**|Are you able to complete all processes as desired? Are our workflows and validation rule functioning correctly? Use the ‘login as user’ feature to log in as different users and check their profile access and preferences – are you seeing what you had expected to? if possible, ask your users to help you test too|
**Switch Email Deliverability Back On**|After the testing is complete and we are satisfied everything is working, you can enable email deliverability so your users can receive emails again|
**Reactive and Inform Users**|After testing that everything is working successfully, we have completed a successful deployment. The final step now is to allow our users to login again if you disabled it, and to let them know the changes have taken place|
**Access to all the training support and resources**|Provide access to the training and documentation and monitor the users for any help they may need|







# Creation

```
sfdx mohanc:slides:gen -i dcl.md -o dcl.md.html -t 'Salesforce Deployment Checklist'

```