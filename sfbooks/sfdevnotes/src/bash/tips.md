# Bash tips

## Delete all other files except given file pattern

```bash
find . ! -name '*.py'  -type f -exec rm -f {} +

```


## list files of pattern  '* 2.*' and '* copy.*' and delete them

```bash
## go to top folder and run the following command

find . -name '* 2.*'  2>&1 | tee /tmp/2_dup_files.txt

find . -name '* copy.*'  2>&1 | tee /tmp/copy_dup_files.txt


# to delete these files, uncomment the next lines

# cat /tmp/2_dup_files.txt    | sed 's/\(.*\)/"\1"/g' | xargs rm -f 
# cat /tmp/copy_dup_files.txt | sed 's/\(.*\)/"\1"/g' | xargs rm -f 

```



