# git deleting branch



## List branches

```

git branch -a

```

```
  feature
  feature-0001
* main

```

## Delete the branch feature-0001 which is not fully merged
- If the branch has not been fully merged, git will display an error message and prevent the branch from being deleted.

```
git branch -d  feature-0001

```

```

error: The branch 'feature-0001' is not fully merged.
If you are sure you want to delete it, run 'git branch -D feature-0001'.

```

- Following  command forces git to delete the branch, regardless of whether it has been fully merged or not.
```
git branch -D feature-0001

```

```
Deleted branch feature-0001 (was d99c263).
```







## Delete the branch feature which is fully merged

```
git branch -d feature    
```
```  
Deleted branch feature (was a97f348).
```

### List the branches after the deletions

```
git branch -a       
```

```         
* main

```



