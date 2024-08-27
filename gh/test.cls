/*******************************************************************************************
* @name         ACM_ReassignChildOwnerServiceHandler
* @author       Shaikh Usama
* @date         16/08/2022
* @group        Account Contact Management
* @description  Utility class for Reassignment of child owner functionality
*******************************************************************************************/

public without sharing class ACM_ReassignChildOwnerServiceHandler {
    /**************************************************************************************
    * @description  This method is taking parent Id and updating list of child owner
    * @param	    parentIDs
   
    **************************************************************************************/ 
    public static Map<Id, Id> objIdTerLogId = new Map<Id, Id>();
    public static void fetachAndUpdateOwner(set<Id> parentIDs) {
        try {
            List<Account> accList = [
                SELECT id, name
                FROM Account
                WHERE Id IN :parentIDs
                WITH SECURITY_ENFORCED
            ];

            Map<id, HierarchyNode> getHierachyMap = ACM_FetchChildAccountHierarchyUitlity.getHierarchies( accList );

            Map<Id, List<Account>> accMap = ACM_FetchChildAccountHierarchyUitlity.fetchAllAccountHierarchy( accList, getHierachyMap );

            Map<id, Account> parentList = new Map<Id, Account>( [SELECT id, OwnerId FROM Account WHERE Id IN :accMap.keyset()] );

            List<Account> updateParentList = new List<Account>();
            for (Account acc : parentList.values()) {
                List<account> accChild = accMap.get(acc.Id);

                for (account ac : accChild) {
                ac.OwnerId = acc.OwnerId;
                }
                updateParentList.addAll(accChild);
            }

            if ( updateParentList.size() > 0 && Account.SObjectType.getDescribe().isUpdateable() ) {
                 Database.SaveResult[] resultList = Database.update(updateParentList,false);
            	 ACM_ErrorNotificationHandler.errorCallOnInsertUpdate(resultList);  
            }
        } catch (exception ex) {
            Logger.Error(ex.getMessage());
        } finally {
            Logger.saveLog();
        }
    }
    /**************************************************************************************
    * @description  This method is taking inputMap and performing changes on Owner change
    * @param	    inputMap
    * @param        parentTAAList
    *@return        Map<Id, Set<Id>> - logIdSetObjId
    **************************************************************************************/ 
    @TestVisible

    public static Map<Id, Set<Id>> processOnOwnerChange( Map<String, Object> inputMap,List<TerritoryAccountAssociation__c> parentTAAList ) {
        Map<String, Object> outputMap;
        Set<Id> accIds = new Set<Id>();
        Map<Id, Set<Id>> logIdSetObjId = new Map<Id, Set<Id>>();
        Map<Id, Id> logIdUserIdtemp = new Map<Id, Id>();
        List<TerritoryAccountAssociation__c> newList = (List<TerritoryAccountAssociation__c>) inputMap.get( TM_TAA_AppLiterals.TAA_LIST );
        logIdSetObjId = getT2logObjectIdMap(newList, logIdSetObjId);
        Set<Id> terrLogIdSet = logIdSetObjId.keyset();
       
        Map<Id,String> tlogMap = TM_TAA_ServiceLayerHandler.getTerritoryLabel(terrLogIdSet); 
        Map<Id,String> t2idLabelMap = TM_TAA_ServiceLayerHandler.getTerritory2Type(tlogMap);
        
        
        string query = 'Select Id, UserId__c, PrimaryTerritoryOwner__c, TerritoryLogId__c FROM TerritoryUserAssociation__c WHERE TerritoryLogId__c IN :terrLogIdSet AND PrimaryTerritoryOwner__c = TRUE AND TerritoryLogId__c != null AND Active__c= true ORDER BY LastModifieddate DESC';
        List<TerritoryUserAssociation__c> tuaUserAss = Database.query(query);

        logIdUserIdtemp=TM_TAA_ServiceLayerHandler.territoryLogUserIdMap(tuaUserAss);
        for (id ob : logIdSetObjId.KeySet()) {
            if(t2idLabelMap.get(tlogMap.get(ob))!=System.Label.NonSalesTerritoryTypeMasterLabel){
            accIds.addAll(logIdSetObjId.get(ob));
        }
        }
        Map<Id,Account> mapofIdAcc = new Map<Id,Account>( [SELECT id, OwnerId, SalesTerritoryLog__c,ParentId FROM account
                                                            WHERE id IN :accIdSet AND ParentId = NULL AND ManagedCovered__c = TRUE WITH SECURITY_ENFORCED]);
        for (id territoryLogId : logIdSetObjId.keySet()) {
            for (id acc : mapofIdAcc.keySet()) {
                Set<id> k = logIdSetObjId.get(territoryLogId);
                if (k.contains(acc) && mapofIdAcc.containsKey(acc)) {
                    updateOwner(mapofIdAcc.get(acc),logIdUserIdtemp,territoryLogId);
                    updateTerritoryLog(getTerritoryType(t2idLabelMap,tlogMap,territoryLogId),mapofIdAcc.get(acc),territoryLogId);
                    if (!updateAccount.contains(mapofIdAcc.get(acc))) {
                        updateAccount.add(mapofIdAcc.get(acc));
                    }
                }
            }
        }

        performUpdateAccount(updateAccount,parentTAAList,mapofIdAcc);
        return logIdSetObjId;
    }

    /**************************************************************************************
     * @description  Helper method to get territory type
     * @param	    t2idLabelMap
     * @param	    tlogMap
     * @param	    territoryLogId
     * @return      territoryType
     **************************************************************************************/
    private static String getTerritoryType(Map<Id,String> t2idLabelMap,Map<Id,String> tlogMap,Id territoryLogId){
        String territoryType = '';
        if (tlogMap.containsKey(territoryLogId) && tlogMap.get(territoryLogId) != null && t2idLabelMap.containsKey(tlogMap.get(territoryLogId))) {
           territoryType = t2idLabelMap.get(tlogMap.get(territoryLogId));
        }
       return territoryType;
    }
    /**************************************************************************************
     * @description  Helper method to update account owner
     * @param	    acc
     * @param	    logIdUserIdtemp
     * @param	    territoryLogId
     **************************************************************************************/
   private static void updateOwner(Account acc, Map<Id, Id> logIdUserIdtemp, Id territoryLogId) {
        if (logIdUserIdtemp.containsKey(territoryLogId) && logIdUserIdtemp.get(territoryLogId) != null) {
            acc.OwnerId = logIdUserIdtemp.get(territoryLogId);
        }
    }

    /**************************************************************************************
     * @description  Helper method to update territory log on Sales and POS Account based on Territory Type
     * @param	    territoryType
     * @param	    acc
     * @param	    territoryLogId
     **************************************************************************************/
    private static void updateTerritoryLog(String territoryType,Account acc, Id territoryLogId) {
        if (String.isBlank(territoryType)) {return;}

        if (territoryType != TMPOSAppLiterals.TERRITORY_TYPE_STAFFING) {
            acc.SalesTerritoryLog__c = territoryLogId;
        } else {
            acc.POSTerritory__c = territoryLogId;
        }
    }

    /*************************************************************************************************************************
    * @description  This method is used to update the account owner when  account is added to a territory with a primary owner
    * @param	    updateAccount
    * @param        parentTAAList
    * @param	    mapofIdAcc
    **************************************************************************************************************************/ 
    @TestVisible
    private static void performUpdateAccount( List<Account> updateAccount,List<TerritoryAccountAssociation__c> parentTAAList,Map<id, Account> mapofIdAcc) {
        Boolean error = false;
        if ( Account.SObjectType.getDescribe().isUpdateable() || !updateAccount.isEmpty() || !Test.isRunningTest() ) {
            try {
                logger.info('update Account List' + updateAccount);
                boolean isError =false;
                TM_TAA_Wrapper wrapper = new TM_TAA_Wrapper();
                wrapper = getParentTerritoryChangeDataForOwnerUpdate(parentTAAList);
                Database.SaveResult[] resultList = Database.update(updateAccount,false);
                for (Database.SaveResult sr : resultList) {
                    if (!sr.isSuccess()){
                        isError =true;
                        break;
                    }
                }
                if(isError){
                    ACM_ErrorNotificationHandler.errorCallUpdateOwnerFailure(resultList,updateAccount,wrapper);
                }
            	ACM_ErrorNotificationHandler.errorCallOnInsertUpdate(resultList);  
            } catch (exception ex) {
                error = true;
                logger.error(ex.getMessage());
            } finally {
                Logger.saveLog();
            }
            if(!error) {
                insertParentTerritoryChangeData(parentTAAList,TM_TAA_AppLiterals.TAAINSERTEVENT);
            }
        }
    }

    /*************************************************************************************************************************
    * @description  This method is used to create a getT2logObjectIdMap
    * @param	    newList
    * @param	    logIdSetObjId
    * @return       logIdSetObjId
    **************************************************************************************************************************/ 
    private static Map<Id, Set<Id>> getT2logObjectIdMap( List<TerritoryAccountAssociation__c> newList, Map<Id, Set<Id>> logIdSetObjId ) {
        
        for (TerritoryAccountAssociation__c obj : newList) {
            if(obj.TerritoryLogId__c != null){
                if (logIdSetObjId.get(obj.TerritoryLogId__c) == null  ) {
                    Set<id> tempacc = new Set<id>();
                    tempacc.add(obj.ObjectId__c);
                    logIdSetObjId.put(obj.TerritoryLogId__c, tempacc);
                } else {
                    logIdSetObjId.get(obj.TerritoryLogId__c).add(obj.Objectid__c);
                }
            }
        }
        return logIdSetObjId;
    }

    /******************************************************************************************
     * @Author:- Purva Khadke(pkhadke@apple.com),Vivek Wagh(vivek_wagh@apple.com9@apple.com)
     * @ Story No:- 9591,9592
     * @description:- to update  the account owner
     ********************************************************************************************/
     /**************************************************************************************
    * @description  This method is taking inputMap and updates the account owner
    * @param	    inputMap
    *@return        Map<String, Object> - outputMap
    **************************************************************************************/ 
    public static Map<String, Object> processOwnerChangeForTUA( Map<String, Object> inputMap ) {
        Map<String, Object> outputMap;
        Set<Id> terrLogIds = new Set<Id>();
        Map<Id, Id> t2logIduId = new Map<Id, Id>();
        Map<Id, TerritoryUserAssociation__c> tuaIdVsRecordOldMap= new Map<Id, TerritoryUserAssociation__c>();
        boolean isPrimaryOwnerChanged=false;
        List<TerritoryUserAssociation__c> tuaList = (List<TerritoryUserAssociation__c>) inputMap.get( TM_TUA_AppLiterals.TUA_LIST );
        if(inputMap.ContainsKey(TM_TUA_AppLiterals.TUA_OLDMAP)){
          tuaIdVsRecordOldMap = (Map<Id, TerritoryUserAssociation__c>) inputMap.get( TM_TUA_AppLiterals.TUA_OLDMAP);
        }
        else{
            isPrimaryOwnerChanged=true;
        }
        for (TerritoryUserAssociation__c obj : tuaList) {
            if(tuaIdVsRecordOldMap.ContainsKey(obj.Id) && (tuaIdVsRecordOldMap.get(obj.Id)).PrimaryTerritoryOwner__c==false){
                isPrimaryOwnerChanged=true;
            }
            Boolean chkPrimeUser = (obj.PrimaryTerritoryOwner__c == true &&
            obj.Active__c == true && obj.TerritoryLogId__c !=null && isPrimaryOwnerChanged==true);
            if (chkPrimeUser) {
                terrLogIds.add(obj.TerritoryLogId__c);
                //Linking  territorylog id and userid
                t2logIduId.put(obj.TerritoryLogId__c, obj.UserId__c);
            }
        }
        if(terrLogIds.size()>0){
            Integer batchSize = Integer.valueOf(System.Label.TMAccountOwnerBatchSize);
        	Id batchInstanceId = Database.executeBatch(new TMAccOwnerChangeOnPrimaryUserAddition(terrLogIds,t2logIduId), batchSize);
        	logger.info('TMAccOwnerChangeOnPrimaryUserAddition batchInstanceId:::::->' + batchInstanceId);
        }
        return outputMap;
    }
    /************************************************************************************** 
	  * @description       Method to prepare list of ParentTerritoryChangeData__c records based on the TAA which are inserted successfully.
	  * @param             taaList
      * @param             eventType
	  **************************************************************************************/
      public static void insertParentTerritoryChangeData(List<TerritoryAccountAssociation__c> taaList,string eventType) {
        List<ParentTerritoryChangeData__c> parentTerritoryChangeDataList = new List<ParentTerritoryChangeData__c>();
        for( TerritoryAccountAssociation__c taa : taaList){
            if(parentACCIdVsAggResultMap.ContainsKey(taa.ObjectId__c) && (Integer)(parentACCIdVsAggResultMap.get(taa.ObjectId__c).get('childCount')) > 0){
                ParentTerritoryChangeData__c parentTerritoryRecord = new ParentTerritoryChangeData__c();
                parentTerritoryRecord.Status__c =TM_TAA_AppLiterals.STATUS_NOTPROCESSED;
                parentTerritoryRecord.TerritoryAccountAssociation__c = taa.id;
                parentTerritoryRecord.ObjectId__c= taa.ObjectId__c;
                parentTerritoryRecord.RecordTypeId= TM_TAA_AppLiterals.PTCD_CHILD;
                parentTerritoryRecord.EventType__c=eventType;
                parentTerritoryChangeDataList.add(parentTerritoryRecord);
        }
        createParentTerriotryChangeDataRecords(parentTerritoryChangeDataList);            
    }
}

    /******************************************************************************************
    * @description - Method to insert ParentTerritoryChangeData__c records when TAA are inserted successfully. 
    * @param parentTerritoryChangeDataList
    ********************************************************************************************/
    public static void createParentTerriotryChangeDataRecords(List<ParentTerritoryChangeData__c> parentTerritoryChangeDataList) {
       try{
            if(!parentTerritoryChangeDataList.isEmpty() && ParentTerritoryChangeData__c.SObjectType.getDescribe().isCreateable() ){
               Database.SaveResult[] resultList=Database.insert(parentTerritoryChangeDataList,false);
               ACM_ErrorNotificationHandler.errorCallOnInsertUpdate(resultList);
               logger.info('Parent Territory Change Data records:->' + parentTerritoryChangeDataList);
            }
        }catch (exception ex){
           logger.error(ex.getMessage());
        }finally {
            Logger.saveLog();
        }
    }
    /***********************************************************************************************
    * @description - Method to map a accountid with respective parent Territory change data record 
    * @param parentTaaList
    * @return wrapper
    ***********************************************************************************************/
    public static TM_TAA_Wrapper getParentTerritoryChangeDataForOwnerUpdate(List<TerritoryAccountAssociation__c> parentTaaList){
        TM_TAA_Wrapper wrapper = new TM_TAA_Wrapper();
        Map<Id,ParentTerritoryChangeData__c> accIdVsParentTerrChangeData = new Map<Id,ParentTerritoryChangeData__c>();
        List<ParentTerritoryChangeData__c> parentTerrChangeDataList = [SELECT id, Name,Status__c,ObjectId__c,TerritoryAccountAssociation__c,TerritoryAccountAssociation__r.TerritoryLogId__c,TerritoryAccountAssociation__r.ObjectId__c,
                                    TerritoryAccountAssociation__r.ObjectId__r.OwnerId,TerritoryAccountAssociation__r.ObjectId__r.ParentId,TerritoryAccountAssociation__r.EffectiveStartDate__c,TerritoryAccountAssociation__r.EffectiveEndDate__c,
                                    EventType__c,RecordTypeId  FROM ParentTerritoryChangeData__c 
                                    WHERE Status__c = :TM_TAA_AppLiterals.STATUS_NOTPROCESSED AND 
                                    TerritoryAccountAssociation__c IN :parentTaaList AND RecordTypeId = :TM_TAA_AppLiterals.PTCD_PARENT WITH SECURITY_ENFORCED];
        for(ParentTerritoryChangeData__c parentTerrChangeDataRecord : parentTerrChangeDataList){
            accIdVsParentTerrChangeData.put(parentTerrChangeDataRecord.ObjectId__c,parentTerrChangeDataRecord);
        }
        wrapper.terrAccountAssociationVsParentTerrChangeData = accIdVsParentTerrChangeData;
        return wrapper;
    }
}