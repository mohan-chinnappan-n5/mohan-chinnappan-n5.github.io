# git merge

- The command used to integrate changes from one branch into another. Merging combines changes made in separate branches and creates a new commit that includes the changes from both branches.
- Merging is a powerful feature of git that allows multiple developers to work on the same codebase simultaneously and combine their changes in a controlled and efficient way.



## Git Branch Merge Demo

### Create Git Repo

- [script](https://raw.githubusercontent.com/mohan-chinnappan-n/shell-scripts/master/git/git-branch-merge.sh)
```bash
merge_branches() {
  local branch1="$1"
  local branch2="$2"
  
  # Validate branch names
  if ! git rev-parse --quiet --verify "$branch1" >/dev/null; then
    echo "Error: Branch '$branch1' does not exist."
    return 1
  fi
  
  if ! git rev-parse --quiet --verify "$branch2" >/dev/null; then
    echo "Error: Branch '$branch2' does not exist."
    return 1
  fi
  
  # Checkout branch2
  git checkout "$branch2"
  
  # Merge branch1 into branch2
  git merge "$branch1"
  
  # Check if merge was successful
  if [ $? -eq 0 ]; then
    echo "Merge completed successfully."
  else
    echo "Error: Merge failed."
    return 1
  fi
}

merge_branches $1 $2

```

```
~/proj1  >git init
Initialized empty Git repository in /Users/mchinnappan/proj1/.git/
~/proj1  (git)-[main]- >vi notes.md
~/proj1  (git)-[main]- >git add -A
~/proj1  (git)-[main]- >git commit -m init
[main (root-commit) d2fdd7b] init
 1 file changed, 2 insertions(+)
 create mode 100644 notes.md
~/proj1  (git)-[main]- >git log
commit d2fdd7b25355531e93dca4fcc6c5457d6596f7f8 (HEAD -> main)
Author: mohan chinnappan <mohan.chinnappan.n@gmail.com>
Date:   Tue May 16 09:29:44 2023 -0400

    init
```


### Create branch dev

```
~/proj1  (git)-[main]- >git branch dev

```

### List the branches

```
~/proj1  (git)-[main]- >git branch -a
  dev
* main
```

### Edit notes.md  in main branch

```
~/proj1  (git)-[main]- >vi notes.md
~/proj1  (git)-[main]- >git add -A
~/proj1  (git)-[main]- > cat notes.md
one
two

~/proj1  (git)-[main]- >git commit -m update_on_notes
[main 61fb145] update_on_notes
 1 file changed, 1 insertion(+)
```

### Checkout dev

```
 ~/proj1  (git)-[main]- >git checkout dev
Switched to branch 'dev'
~/proj1  (git)-[dev]- >cat notes.md
one

```


###  merge from main to dev

```
~/proj1  (git)-[dev]- >bash git-branch-merge.sh main dev
Already on 'dev'
Updating d2fdd7b..61fb145
Fast-forward
 notes.md | 1 +
 1 file changed, 1 insertion(+)
Merge completed successfully.
```

### Check merge

```
~/proj1  (git)-[dev]- >cat notes.md
one
two
```


----


## How to list the merges done on the branch by an author


```
git log --merges --author="Ken"

```

### Example - list the merges done by the author: mohan
```
git log --merges --author="mohan"

commit e307a67fec2e3af51d9361ef17f5c2153cbaf83a
Merge: c5c7a82 e6881af
Author: mohan chinnappan <mohan.chinnappan.n@gmail.com>
Date:   Fri May 5 18:10:43 2023 -0400

    Merge branch 'feature-0002'

commit c5c7a82be50820c548353f731881ef562c2c3aa5
Merge: b7353b8 a78f1a5
Author: mohan chinnappan <mohan.chinnappan.n@gmail.com>
Date:   Fri May 5 18:06:14 2023 -0400

    Merge branch 'feature-0002'

commit 50fa27fed0f56d1de8588aadd42db00cf522b24c
Merge: 972c964 6aff16d
Author: mohan-chinnappan-n <mohan.chinnappan.n@gmail.com>
Date:   Fri Feb 3 08:09:16 2023 -0500

    merged with feature-0001
3

```





## Steps in performing merge

1. git checkout <current-branch>

```
~/git-demo  (git)-[feature-0002]- >git checkout main
Switched to branch 'main'
```

2. git merge <source-branch-for-merge>

```

git merge feature-0002
```

```
Auto-merging iris.csv
Merge made by the 'ort' strategy.
 iris.csv | 1 +
 1 file changed, 1 insertion(+)

```

```
head iris.csv 
sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,Iris-setosa
5.1,3.5,1.4,0.2,Iris-setosa
5.1,3.5,1.4,0.2,Iris-setosa
4.9,3,1.4,0.2,Iris-setosa
4.9,3,1.4,0.2,Iris-setosa
4.7,3.2,1.3,0.2,Iris-setosa
4.6,3.1,1.5,0.2,Iris-setosa
5,3.6,1.4,0.2,Iris-setosa
5.4,3.9,1.7,0.4,Iris-setosa
```

- This command merges the changes from **<source-branch-for-merge>** (```feature-0002```) into the **current branch** (```main```).
- Before performing the merge, git checks whether there are any conflicts between the two branches. If there are conflicts, git will prompt you to resolve them manually.



