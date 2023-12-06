#!/bin/bash

# Input CSV file (replace with your file)
csv_file=$1

# Check if the file exists
if [ ! -f "$csv_file" ]; then
    echo "File not found: $csv_file"
    exit 1
fi

# Print the top border
awk -F, 'BEGIN {
    printf "+---------------------";
    for (i=2; i<=NF; i++) {
        printf("+---------------------");
    }
    print "+";
    getline; # Skip the first line to avoid an extra blank row
}' "$csv_file"

# Print header and middle border
awk -F, '{
    printf("| %-20s", $1);
    for (i=2; i<=NF; i++) {
        printf("| %-20s", $i);
    }
    print "|";
    printf("+---------------------");
    for (i=2; i<=NF; i++) {
        printf("+---------------------");
    }
    print "+";
}' "$csv_file"

# Print data rows
awk -F, '{
    printf("| %-20s", $1);
    for (i=2; i<=NF; i++) {
        printf("| %-20s", $i);
    }
    print "|";
}' "$csv_file"

# Print the bottom border
awk -F, 'END {
    printf("+---------------------");
    for (i=2; i<=NF; i++) {
        printf("+---------------------");
    }
    print "+";
}' "$csv_file"
