# git internals
![Buildings](../img/cover/chromecast-builiding-2.jpg)


## Git is a content addressable system
- It is  a simple key-value data store
- You can insert any kind of **content** into a Git Repo.
    - Git will hand you back a unique key you can use later to retrieve that **content**
- ``` git hash-object ``` command 
    - takes in some data and stores in ``` .git/objects ``` folder -- this object database
    - gives back an unique key which references this object

### Let us play with git hash-object
```
~  >git init git-playground
hint: Using 'master' as the name for the initial branch. This default branch name
hint: is subject to change. To configure the initial branch name to use in all
hint: of your new repositories, which will suppress this warning, call:
hint: 
hint: 	git config --global init.defaultBranch <name>
hint: 
hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
hint: 'development'. The just-created branch can be renamed via this command:
hint: 
hint: 	git branch -m <name>
Initialized empty Git repository in /Users/mchinnappan/git-playground/.git/

~  >cd git-playground 

~/git-playground [master] >tree
.

0 directories, 0 files
~/git-playground [master] >tree .git 
.git
├── HEAD
├── config
├── description
├── hooks
│   ├── applypatch-msg.sample
│   ├── commit-msg.sample
│   ├── fsmonitor-watchman.sample
│   ├── post-update.sample
│   ├── pre-applypatch.sample
│   ├── pre-commit.sample
│   ├── pre-merge-commit.sample
│   ├── pre-push.sample
│   ├── pre-rebase.sample
│   ├── pre-receive.sample
│   ├── prepare-commit-msg.sample
│   ├── push-to-checkout.sample
│   └── update.sample
├── info
│   └── exclude
├── objects
│   ├── info
│   └── pack
└── refs
    ├── heads
    └── tags

8 directories, 17 files

```
### Let us add content to object database

```
~/git-playground [master] >echo 'test content' | git hash-object -w --stdin
d670460b4b4aece5915caf5c68d12f560a9fe3e4

```


```
~/git-playground [master] >tree
.

0 directories, 0 files
~/git-playground [master] >tree .git                                       
.git
├── HEAD
├── config
├── description
├── hooks
│   ├── applypatch-msg.sample
│   ├── commit-msg.sample
│   ├── fsmonitor-watchman.sample
│   ├── post-update.sample
│   ├── pre-applypatch.sample
│   ├── pre-commit.sample
│   ├── pre-merge-commit.sample
│   ├── pre-push.sample
│   ├── pre-rebase.sample
│   ├── pre-receive.sample
│   ├── prepare-commit-msg.sample
│   ├── push-to-checkout.sample
│   └── update.sample
├── info
│   └── exclude
├── objects
│   ├── d6 <----- first 2 characters of the SHA-1
│   │   └── 70460b4b4aece5915caf5c68d12f560a9fe3e4 <------- SHA-1 checksum of the content and its header.
│   ├── info
│   └── pack
└── refs
    ├── heads
    └── tags

9 directories, 18 files
~/git-playground [master] >
```

```
find .git/objects -type f
.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
```

### Let us examine the content of the content with git cat-file

```
git cat-file -p d670460b4b4aece5915caf5c68d12f560a9fe3e4 

test content


```

### Let us add a file to the object database

```
echo 'Version: 1' > test.txt 
git hash-object -w test.txt
f8acaeb421037571491c643e96acc09faea03b24

# Let us the object created by this:
find .git/objects -type f
.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
.git/objects/f8/acaeb421037571491c643e96acc09faea03b24 <------

```

### Let us add version 2 of the test.txt
```
echo 'Version: 2' > test.txt 
git hash-object -w test.txt
939ba388fd33e17497577f5cfacd6aa84ef219b9

# Let us the object created by this:
find .git/objects -type f

.git/objects/93/9ba388fd33e17497577f5cfacd6aa84ef219b9 <-----
.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
.git/objects/f8/acaeb421037571491c643e96acc09faea03b24

```

- Now you can delete your local copy of that test.txt file, then use Git to retrieve, from the object database, either the first version or second version you saved

```
rm test.txt

ls -l

git cat-file -p 939ba388fd33e17497577f5cfacd6aa84ef219b9
Version: 2

# Version 1:
git cat-file -p f8acaeb421037571491c643e96acc09faea03b24 


```

### Type of this SHA-1 is blob
```
git cat-file -t f8acaeb421037571491c643e96acc09faea03b24 
blob

```

-  All the content in git is stored as tree and blob objects
    -  with trees corresponding to UNIX directory entries 
    -  blobs corresponding more or less to i-nodes or file contents

### Tree Objects
- Tree object solves the problem of storing the filename and also allows you to store a group of files together

```
~/git-playground [master] >mkdir src
~/git-playground [master] >touch README.md
~/git-playground [master] >touch src/hello.js
``` 

```
tree
.
├── README.md --> blob
└── src --> tree
    └── hello.js --> blob

```

```
~/git-playground [master] >git add -A                 
~/git-playground [master] >git commit -m init
[master (root-commit) 27c4b42] init
 2 files changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 README.md
 create mode 100644 src/hello.js
~/git-playground [master] >tree .git         
.git
├── COMMIT_EDITMSG
├── HEAD
├── config
├── description
├── hooks
│   ├── applypatch-msg.sample
│   ├── commit-msg.sample
│   ├── fsmonitor-watchman.sample
│   ├── post-update.sample
│   ├── pre-applypatch.sample
│   ├── pre-commit.sample
│   ├── pre-merge-commit.sample
│   ├── pre-push.sample
│   ├── pre-rebase.sample
│   ├── pre-receive.sample
│   ├── prepare-commit-msg.sample
│   ├── push-to-checkout.sample
│   └── update.sample
├── index
├── info
│   └── exclude
├── logs
│   ├── HEAD
│   └── refs
│       └── heads
│           └── master
├── objects
│   ├── 27
│   │   └── c4b42327458637549fb9d00170bdc7b07ed77b
│   ├── 5a
│   │   └── 38b439d9a9e0a7d8d12f1e88cad5f881968a6b
│   ├── 93
│   │   └── 9ba388fd33e17497577f5cfacd6aa84ef219b9
│   ├── d6
│   │   └── 70460b4b4aece5915caf5c68d12f560a9fe3e4
│   ├── e1
│   │   └── 52c4c52532fda392dece4c503567d30a9ae059
│   ├── e6
│   │   └── 9de29bb2d1d6434b8b29ae775ad8c2e48c5391
│   ├── f8
│   │   └── acaeb421037571491c643e96acc09faea03b24
│   ├── info
│   └── pack
└── refs
    ├── heads
    │   └── master
    └── tags

18 directories, 29 files
```

- ```master^{tree}``` syntax specifies the tree object that is pointed to by the **last commit** on your master branch.
```
~/git-playground [master] >git cat-file -p master^{tree}
100644 blob e69de29bb2d1d6434b8b29ae775ad8c2e48c5391	README.md
040000 tree e152c4c52532fda392dece4c503567d30a9ae059	src

```

```
~/git-playground [master] >vi src/hello.js 
~/git-playground [master] >cat src/hello.js 
console.log('hello');

git add -A
~/git-playground [master] >git commit -m 'hello added'

```

```

>tree
.
├── README.md
└── src
    └── hello.js

```


## References
- [Git Internals - Plumbing and Porcelain](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)
## Videos
<iframe width="840" height="600" src="https://www.youtube.com/embed/4XpnKHJAok8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>








