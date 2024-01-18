# Editor tips

## vi or nvim

## From a python dictionary from the given list of words in the file
- Select the lines and run:
```
'<,'>s/^\(\w\+\)/"\1":"\1",/g
```

These lines in the file :
```
objects
pages
```
will converted into:

```
 "objects":"objects",
 "pages":"pages
```

## Multiline comments in vim

- Press ```Ctrl-v``` to enter visual block mode.
- Use the arrow keys to select the three lines you want to comment out.
- Press ```Shift-I``` to enter insert mode at the beginning of the selected lines.
- Type ```# ``` (or your comment identifier) and then press Esc.



## Multiline comments in VSCode
```
# select multi-lines to be commented out
    
shift + option + A
```

## Delete empty lines

```
:g/^$/d
```
- The ```:g``` command allows you to perform an action on all lines that match a pattern.
- ```/^$/``` is a regular expression that matches empty lines. The ```^``` and ```$``` characters anchor the expression to the beginning and end of the line, respectively.
- The ```d``` command deletes the selected lines.

## Selecting non-empty lines and deleting others
```
%v/\S/d
```

- The ```%``` character represents the entire file.
- The ``v`` command selects all lines that **do not match a pattern**.
- ```/\S/``` is a regular expression that matches all lines that contain at least one non-whitespace character. In other words, it selects all non-empty lines.
- The ```d``` command deletes the selected lines.


## Converting a js JSON into compliant json

```
:%s/\(\S*\):/"\1":/g

```

- From 
```json
{
        type: "ObjectManager > Account > Fields&Relationships",
        field: "AnnualRevenue",
        attribute: "Help Text",
        newValue: "New Value here"
}

```
- to JSON

```json

{
        "type": "ObjectManager > Account > Fields&Relationships",
        "field": "AnnualRevenue",
        "attribute": "Help Text",
        "newValue": "New Value here"
    }

```



