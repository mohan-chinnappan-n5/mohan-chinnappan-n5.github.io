#!/bin/bash

# Input CSV file (replace with your file)
csv_file=$1

# Check if the file exists
if [ ! -f "$csv_file" ]; then
    echo "File not found: $csv_file"
    exit 1
fi

# Function to print a horizontal line
print_horizontal_line() {
    printf "+---------------------"
    for ((i=1; i<=$1; i++)); do
        printf "+---------------------"
    done
    echo "+"
}

# Print the top border
print_horizontal_line $(head -n 1 "$csv_file" | awk -F, '{print NF}')

# Print header and middle border
awk -F, '{
    printf "| %-20s", $1
    for (i=2; i<=NF; i++) {
        printf "| %-20s", $i
    }
    print "|"
}' "$csv_file"

# Print the bottom border
print_horizontal_line $(head -n 1 "$csv_file" | awk -F, '{print NF}')
