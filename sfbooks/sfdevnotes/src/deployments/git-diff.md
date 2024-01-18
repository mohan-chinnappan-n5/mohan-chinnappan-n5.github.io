# git diff

- Takes two input data sets and outputs the changes between them. Runs a diff function on Git data sources. Displays the sections of the file that have changes


- Our example:

- HEAD^ (one before HEAD)
```
Hello World
Hello Earth
```

- HEAD :
```
Hello World
Hello Earth
Hello Mars
Hello Venus
```

|Git diff output line|Comments|
|---|---|
|git diff HEAD^..HEAD|Our command|
|diff --git a/greet.txt b/greet.txt| input sources of the diff|
|index cb896b5..712612f 100644|internal Git metadata|
|--- a/greet.txt|Markers for the changes|
|+++ b/greet.txt|Markers for the changes|
|@@ -1,2 +1,4 @@|Diff chunks: **2** lines have been extracted starting from line number **1**. Additionally, **4** lines have been added starting at line number **1**.
| Hello World|Each changed line is prepended with a + or - symbol indicating which version of the diff input the changes come from.|
| Hello Earth||
|+Hello Mars||
|+Hello Venus||

## Using diff to compare HEAD^ and file
```
git diff HEAD^ greet.txt
diff --git a/greet.txt b/greet.txt
index cb896b5..712612f 100644
--- a/greet.txt
+++ b/greet.txt
@@ -1,2 +1,4 @@
 Hello World
 Hello Earth
+Hello Mars
+Hello Venus

```

## Compare 2 branches
```
git diff main..featureBranch
```

## Compare a file in 2 branches
```
~/git-experiments [main] >git branch feature
~/git-experiments [main] >git checkout feature
Switched to branch 'feature'
~/git-experiments [feature] >vi greet.txt 
~/git-experiments [feature] >cat greet.txt 
Hello World
Hello Earth
Hello Mars
Hello Venus
Hello Farms
~/git-experiments [feature] >git add -A
~/git-experiments [feature] >git commit -m 'farms added'
[feature b3359ea] farms added
 1 file changed, 1 insertion(+)
~/git-experiments [feature] >git diff main feature greet.txt 
diff --git a/greet.txt b/greet.txt
index 712612f..3cacf68 100644
--- a/greet.txt
+++ b/greet.txt
@@ -2,3 +2,4 @@ Hello World
 Hello Earth
 Hello Mars
 Hello Venus
+Hello Farms
```

## How to compare a file in 2 branches
```
~/git-experiments [feature] > git diff main greet.txt
diff --git a/greet.txt b/greet.txt
index 712612f..3cacf68 100644
--- a/greet.txt
+++ b/greet.txt
@@ -2,3 +2,4 @@ Hello World
 Hello Earth
 Hello Mars
 Hello Venus
+Hello Farms

```



## How to find the files got changed between 2 git commits
```
~/git-experiments [feature] >git diff --name-only HEAD..HEAD^
greet.txt
```

## How find deleted files between 2 commits
```
git diff --diff-filter=D commit1..commit2


```

## More on --diff-filter
-  The --diff-filter option is used with the git diff command to filter the differences that are displayed based on the type of change that has occurred. Here are some examples of how to use the --diff-filter option:

- git diff --diff-filter=M: Shows only the files that have been modified between two commits.

- git diff --diff-filter=A: Shows only the files that have been added between two commits.

- git diff --diff-filter=D: Shows only the files that have been deleted between two commits.

- git diff --diff-filter=R: Shows only the files that have been renamed between two commits.

- git diff --diff-filter=C: Shows only the files that have been copied between two commits.

- git diff --diff-filter=T: Shows only the files that have had their type (mode) changed between two commits.

- git diff --diff-filter=B: Shows only the files that have had their binary content changed between two commits.

- You can also combine the --diff-filter option with other options, such as --name-only or --name-status, to further refine the output of the git diff command.

- For example, git diff --name-only --diff-filter=M would show only the names of the files that have been modified between two commits. Similarly, git diff --name-status --diff-filter=D would show the names of the files that have been deleted, along with a status indicator.

```

--diff-filter values, combination of these :
A Added

-- list filename(s) which got added between 2 commits
    ~/git-experiments [feature] >git diff --name-only --diff-filter=A  HEAD..HEAD^
    welcome.txt

C Copied
D Deleted
-- list files got deleted between 2 commits

M Modified
R Renamed
T have their type (mode) changed
U Unmerged
X Unknown
B have had their pairing Broken
* All-or-none
```


## Compare a file between develop and main branch

```bash

~/treeprj [patch1] >git commit
=== Running PMD scan on /Users/mchinnappan/treeprj/force-app/main/default/classes/ ===...
Going to run: pmd-run.sh pmd -R  /Users/mchinnappan/.pmd/apex_ruleset.xml -d /Users/mchinnappan/treeprj/force-app/main/default/classes/  -f csv > results.csv ...
Feb 26, 2023 1:17:01 PM net.sourceforge.pmd.PMD encourageToUseIncrementalAnalysis
WARNING: This analysis could be faster, please consider using Incremental Analysis: https://pmd.github.io/pmd-6.47.0/pmd_userdocs_incremental_analysis.html
SELECT COUNT(*) AS CNT   FROM CSV("results.csv", {headers:true}) WHERE Priority < 3
=== Checking for PMD  violations ... ===
nerrors: 0
=== No PMD violations! ===
=== Continue the deployment...===
sfdx force:source:deploy -p /Users/mchinnappan/treeprj/force-app/main/default/classes/ -u test-uzsmfdqkhtk7@example.com -c --verbose
INPUT .git/COMMIT_EDITMSG
=== commit msg: WI-123456 fixing the doc format
 
=== Valid commit message!===
[patch1 dd63730] WI-123456 fixing the doc format
 1 file changed, 1 insertion(+), 1 deletion(-)
```
```bash 
# list all the branches including remotes

~/treeprj [master] >git branch -a
* master
  patch1
  remotes/origin/master
```
```bash

# list the file content in both branches master and patch1
~/treeprj [master] >git checkout patch1
Switched to branch 'patch1'
~/treeprj [patch1] >cat docs/9.md 
# adding more docs
doc9  added

~/treeprj [master] >cat docs/9.md 
# adding more docs
doc9  added
add more line item here

```

```

# compare what is in patch1 (a) with what is in the master (b)
git diff patch1 docs/9.md 
diff --git a/docs/9.md b/docs/9.md
index 1f8cc7c..89dd9f3 100644
--- a/docs/9.md
+++ b/docs/9.md
@@ -1,3 +1,4 @@
 # adding more docs
 doc9  added
+add more line item here




```
##  python to do the diff stuff

```py
import subprocess

# Replace these with the commit hashes or branch names you want to compare
old_commit = "HEAD"
new_commit = "HEAD^"

# Get a list of all files that were changed between the two commits
changed_files = subprocess.check_output(
    ["git", "diff", "--name-only", old_commit, new_commit]
).decode("utf-8").splitlines()

# Get a list of all files that were deleted between the two commits
deleted_files = subprocess.check_output(
    ["git", "diff", "--diff-filter=D", "--name-only", old_commit, new_commit]
).decode("utf-8").splitlines()

# Print the results
print("Changed files:")
for filename in changed_files:
    print(filename)

print("\nDeleted files:")
for filename in deleted_files:
    print(filename)

```
