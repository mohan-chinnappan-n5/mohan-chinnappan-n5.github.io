public  with sharing class UpdateCustomPartnerRelatedList implements IRecordsUpdateProcessor {
    

     /*************************************************************************************************************************
* @description  This method is used to delete deprecated accounts from custom partner Reated list
* @example    
* ReassignContactHandler.processRecords
* @param deprecatedAccountId
* @param survivalAccount
* @param recordUpdateMetadata
***************************************************************************************************************************/
    public void processRecords(Id deprecatedAccountId, Account survivalAccount,RecordUpdate__mdt recordUpdateMetadata){
        String objectquery = recordUpdateMetadata.objectQuery__c+'deprecatedAccountId';
        List<OpportunityPartner> partnerList= Database.query(objectquery);
        if(partnerList != Null){
            if (Schema.sObjectType.OpportunityPartner.isDeletable()) {
                delete partnerList;
        }
        Id survivorAccountId =SurvivalAccount.Id;
         String survivorobjectquery = recordUpdateMetadata.objectQuery__c+'survivorAccountId';
        List<OpportunityPartner> SurvivorpartnerList= Database.query(survivorobjectquery);
        if(SurvivorpartnerList.size() > 1){
            if (Schema.sObjectType.OpportunityPartner.isDeletable())
            delete SurvivorpartnerList[0];
        }
        
        
    }

}