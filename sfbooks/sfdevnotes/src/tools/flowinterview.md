# FlowInterview Query and Deletion using CLI (BulkAPI2.0)


## Query

- Note:
    - Username used in the examples is ```mohan.chinnappan.n.sel@gmail.com ``` 
    - You need to replace it with your username after authenticationg with
    ```
    # For PROD and DE
    sfdx force:auth:web:login -r https://login.salesforce.com

    # For  Sandboxes
    sfdx force:auth:web:login -r https://test.salesforce.com
 

### Query for the FlowInterview records with **Error** InterviewStatus 
```sql

SELECT Id, CurrentElement, FlowVersionViewId,Guid,InterviewLabel,
      InterviewStatus,Name,OwnerId,PauseLabel,
      WasPausedFromScreen
      FROM FlowInterview
      WHERE InterviewStatus ='Error'

```

- Store above SOQL in a file say ```flowInterview.soql```

- Execute the query

```
sfdx mohanc:data:bulkapi:query  -u mohan.chinnappan.n.sel@gmail.com -q flowInterview.soql

```
- This will create a csv output in ```flowInterview.soql.csv```. Check the records for deletion.
- If you have decided to delete the these records, you can run the following query 

```sql

SELECT Id
      FROM FlowInterview
      WHERE InterviewStatus ='Error'

```
-  Store above SOQL in a file say ```flowInterviewIds.soql```

- Execute the query

```
sfdx mohanc:data:bulkapi:query  -u mohan.chinnappan.n.sel@gmail.com -q flowInterviewIds.soql

```

## Deletion

```
sfdx mohanc:data:bulkapi:delete -u mohan.chinnappan.n.sel@gmail.com -f flowInterviewIds.soql.csv -e LF -o FlowInterview


```
- This will delete all the FlowInterview records with Ids in  ```flowInterviewIds.soql.csv ```


## References
- [Mass delete 'Paused and Waiting Interviews' records](https://help.salesforce.com/s/articleView?id=000388016&type=1)



