# Installed Packages

## How to Check Installed Packages in the org

### Using ONNU Chrome Extension

```sql
SELECT Id, SubscriberPackageId, SubscriberPackage.NamespacePrefix,
SubscriberPackage.Name, SubscriberPackageVersion.Id,
SubscriberPackageVersion.Name, SubscriberPackageVersion.MajorVersion,
SubscriberPackageVersion.MinorVersion,
SubscriberPackageVersion.PatchVersion,
SubscriberPackageVersion.BuildNumber
FROM InstalledSubscriberPackage
ORDER BY SubscriberPackageId

```

![Installed packages](img/installedPackages-1.png)



### Using CLI
```
sfdx force:package:installed:list -u mohan.chinnappan.n.sel2@gmail.com
```

```            
 ID                 Package ID         Package Name              Namespace   Package Version ID Version Name Version 
 ────────────────── ────────────────── ───────────────────────── ─────────── ────────────────── ──────────── ─────── 
 0A38W000000hMfWSAU 03330000000wDAbAAM Salesforce Connected Apps sf_com_apps 04t30000001DUvrAAG Winter '16   1.7.0.1

```
