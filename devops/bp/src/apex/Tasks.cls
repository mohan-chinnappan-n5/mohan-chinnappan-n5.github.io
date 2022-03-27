public with sharing class Tasks {


    @AuraEnabled(cacheable=true) 
    public static list <Task> getTasks() {
       return [SELECT Subject,ActivityDate,APM_StartDate__c, Status 
         FROM Task 
         WHERE APM_StartDate__c != null
         AND Subject !='Update Customer'
         ];
     }   

}
