# Deployments

![swiss-train](../img/cover/swiss_Lauterbrunnental_train.jpg)

## Tools to get the log of the deployment of in an org

```sql

    SELECT
        Id
        ,SystemModstamp
        ,NumberComponentsDeployed
        ,NumberComponentErrors
        ,numberTestErrors
        ,numberTestsCompleted
        ,numberTestsTotal
        ,runTestsEnabled
        ,rollbackOnError
        
        
        ,CheckOnly
        ,completedDate
        ,createdDate
        
        
        ,ErrorStatusCode
        ,Status
        ,ErrorMessage
        
        ,ignoreWarnings
        
        ,startDate
        ,stateDetail
        
        FROM DeployRequest
        ORDER BY CompletedDate DESC
        LIMIT 10

```

```
 sfdx mohanc:query:tooling -q ~/.soql/deploymentStatus.soql -u mohan.chinnappan.n.sel@gmail.com

```

```
sfdx mohanc:query:tooling -q ~/.soql/deploymentStatus.soql -u mohan.chinnappan.n.sel@gmail.com | bat
───────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ STDIN
───────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ "attributes","Id","SystemModstamp","NumberComponentsDeployed","NumberComponentErrors","NumberTestErrors","NumberTestsCompleted","NumberTestsTo
       │ tal","RunTestsEnabled","RollbackOnError","CheckOnly","CompletedDate","CreatedDate","ErrorStatusCode","Status","ErrorMessage","IgnoreWarnings",
       │ "StartDate","StateDetail"
   2   │ "{""type"":""DeployRequest"",""url"":""/services/data/v56.0/tooling/sobjects/DeployRequest/0Af4x00000Y402zCAB""}","0Af4x00000Y402zCAB","2023-0
       │ 1-21T10:54:40.000+0000",1,0,0,0,0,false,true,false,"2023-01-21T10:54:40.000+0000","2023-01-21T10:51:06.000+0000",,"Succeeded",,false,"2023-01-
       │ 21T10:51:06.000+0000",
   3   │ "{""type"":""DeployRequest"",""url"":""/services/data/v56.0/tooling/sobjects/DeployRequest/0Af4x00000Y33AkCAJ""}","0Af4x00000Y33AkCAJ","2023-0
       │ 1-18T17:39:36.000+0000",1,0,0,0,0,false,true,true,"2023-01-18T17:39:36.000+0000","2023-01-18T17:39:35.000+0000",,"Succeeded",,false,"2023-01-1
       │ 8T17:39:35.000+0000",
   4   │ "{""type"":""DeployRequest"",""url"":""/services/data/v56.0/tooling/sobjects/DeployRequest/0Af4x00000Y31jECAR""}","0Af4x00000Y31jECAR","2023-0
       │ 1-18T17:31:31.000+0000",1,0,0,0,0,false,true,true,"2023-01-18T17:31:31.000+0000","2023-01-18T17:31:30.000+0000",,"Succeeded",,false,"2023-01-1
       │ 8T17:31:30.000+0000",
   5   │ "{""type"":""DeployRequest"",""url"":""/services/data/v56.0/tooling/sobjects/DeployRequest/0Af4x00000Y2wuRCAR""}","0Af4x00000Y2wuRCAR","2023-0
       │ 1-18T14:45:47.000+0000",1,0,0,0,0,false,true,true,"2023-01-18T14:45:47.000+0000","2023-01-18T14:45:42.000+0000",,"Succeeded",,false,"2023-01-1
       │ 8T14:45:42.000+0000",
   6   │ "{""type"":""DeployRequest"",""url"":""/services/data/v56.0/tooling/sobjects/DeployRequest/0Af4x00000Y2wu7CAB""}","0Af4x00000Y2wu7CAB","2023-0
       │ 1-18T14:31:43.000+0000",1,0,0,0,0,false,true,true,"2023-01-18T14:31:43.000+0000","2023-01-18T14:31:35.000+0000",,"Succeeded",,false,"2023-01-1
       │ 8T14:31:37.000+0000",
   7   │ "{""type"":""DeployRequest"",""url"":""/services/data/v56.0/tooling/sobjects/DeployRequest/0Af4x00000Y2wrhCAB""}","0Af4x00000Y2wrhCAB","2023-0
       │ 1-18T14:30:13.000+0000",1,120,0,0,0,false,true,true,"2023-01-18T14:30:13.000+0000","2023-01-18T14:30:07.000+0000",,"Failed",,false,"2023-01-18
       │ T14:30:07.000+0000",
   8   │ "{""type"":""DeployRequest"",""url"":""/services/data/v56.0/tooling/sobjects/DeployRequest/0Af4x00000Y2wpRCAR""}","0Af4x00000Y2wpRCAR","2023-0
       │ 1-18T14:27:40.000+0000",1,120,0,0,0,false,true,false,"2023-01-18T14:27:40.000+0000","2023-01-18T14:27:29.000+0000",,"Failed",,false,"2023-01-1
       │ 8T14:27:35.000+0000",
   9   │ "{""type"":""DeployRequest"",""url"":""/services/data/v56.0/tooling/sobjects/DeployRequest/0Af4x00000Y2wp7CAB""}","0Af4x00000Y2wp7CAB","2023-0
       │ 1-18T14:24:49.000+0000",1,0,0,0,0,false,true,false,"2023-01-18T14:24:49.000+0000","2023-01-18T14:24:43.000+0000",,"Succeeded",,false,"2023-01-
       │ 18T14:24:44.000+0000",
  10   │ "{""type"":""DeployRequest"",""url"":""/services/data/v56.0/tooling/sobjects/DeployRequest/0Af4x00000Y2wmwCAB""}","0Af4x00000Y2wmwCAB","2023-0
       │ 1-18T14:22:54.000+0000",1,120,0,0,0,false,true,false,"2023-01-18T14:22:54.000+0000","2023-01-18T14:22:44.000+0000",,"Failed",,false,"2023-01-1
       │ 8T14:22:44.000+0000",
:

```

### Using SF-LAND Data Viz to view the deployment log
  <iframe id="inlineFrameExample"
    title="Inline Frame Example"
    width="1100"
    height="800"
    src="https://mohan-chinnappan-n5.github.io/dfv/dfv.html?d=data/deploy1.csv&x=14">
</iframe>