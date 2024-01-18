# Flow

## How to delete Obsolete Flow versions?


### SOQL used
```sql

SELECT Id, Status, Definition.DeveloperName, VersionNumber
FROM Flow 
 WHERE Definition.NamespacePrefix = null 
       AND Status = 'Obsolete' 
ORDER BY Definition.DeveloperName, VersionNumber
```


### Download the script from [here](https://github.com/mohan-chinnappan-n/shell-scripts/blob/master/pkg/build_destructiveChanges_pkg_for_obsolete_flows.sh)

```
bash build_destructiveChanges_pkg_for_obsolete_flows.sh -u username@email.com

```

```
--- username: username@email.com ---
--- Getting the SOQL query  ---
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   195  100   195    0     0   2336      0 --:--:-- --:--:-- --:--:--  2532
--- Running the query to get the JSON file  ---
--- Forming destructiveChanges.xml ---
--- Completed writing destructiveChanges.xml --

```

## Deploy command

```
sfdx force:source:deploy -u username -x destructiveChanges/package.xml  --predestructivechanges destructiveChanges/destructiveChanges.xml  -c --verbose --loglevel TRACE 


```



