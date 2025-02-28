# Apex Test Class Finder

## Overview

This Python script scans a folder containing Salesforce Apex classes (.cls files) and identifies corresponding test classes. It assumes that test classes either end with Test or start with Test.

- [ApexTestClassFinder](./ApexTestClassFinder.py)

## Features

- ✅ Detects Apex test classes based on naming conventions

- ✅ Displays results in a colorful table using the rich library

- ✅ Identifies missing test classes with a ❌ indicator

- ✅ Works across different OS platforms (Windows, macOS, Linux)

- ✅ Command-line support for easy execution


## Usage


-- Run the script with the --cls-folder argument, specifying the path to the folder containing Apex class files.


```bash
python ApexTestClassFinder.py --cls-folder /path/to/apex/classes
```
### Sample Usage
```
python ApexTestClassFinder.py --cls-folder ~/dreamhouse-lwc/force-app/main/default/classes 
    Apex Classes and Corresponding Test Classes    
┏━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Apex Class           ┃ Test Classes             ┃
┡━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ PagedResult          │ ❌ No test class found   │
│ SampleDataController │ TestSampleDataController │
│ GeocodingService     │ GeocodingServiceTest     │
│ PropertyController   │ TestPropertyController   │
│ FileUtilities        │ FileUtilitiesTest        │
└──────────────────────┴──────────────────────────┘
```

## Java version
[ApexTestClassFinder](./ApexTestClassFinder.java)

- Compile
```bash
javac ApexTestClassFinder.java

```

## Sample Usage
```bash
java ApexTestClassFinder --cls-folder ~/dreamhouse-lwc/force-app/main/default/classes

Apex Classes and their corresponding Test Classes:
FileUtilities -> FileUtilitiesTest
SampleDataController -> TestSampleDataController
PropertyController -> TestPropertyController
PagedResult -> No test class found
GeocodingService -> GeocodingServiceTest

```

