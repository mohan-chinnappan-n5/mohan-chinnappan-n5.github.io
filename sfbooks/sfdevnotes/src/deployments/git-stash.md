# git stash

- In git, a "stash" is a feature that allows you to **temporarily save changes** that are not yet ready to be committed to the repository.

- Stashing is useful when you need to switch branches or work on a different feature, but you don't want to commit your changes yet.

- When you stash changes in git, you create a "stash" object that contains all the changes you've made since your last commit.

-  You can then switch to a different branch or work on a different feature, and when you're ready to resume work on the original changes, you can apply the stash and restore your changes.

Here's how to stash changes in git:

Make sure your working directory is clean (i.e., no changes are staged or committed).



```
git pull
```
```
remote: Enumerating objects: 20, done.
remote: Counting objects: 100% (20/20), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 20 (delta 16), reused 20 (delta 16), pack-reused 0
Unpacking objects: 100% (20/20), 2.94 KiB | 100.00 KiB/s, done.
From :xxxxx

error: Your local changes to the following files would be overwritten by merge:
....
Please commit your changes or stash them before you merge.
Aborting


```

Run the following command:

```
git stash save "message"
```

```
Saved working directory and index state On develop: stashed

```

This will create a new stash object with a message describing the changes you've stashed.

You can now switch to a different branch or work on a different feature.

When you're ready to restore your stashed changes, run the following command:

```
git stash apply

```
```


error: Your local changes to the following files would be overwritten by merge:

...
Please commit your changes or stash them before you merge.


```





