#!/bin/bash

# Check if the CSV file exists
if [ ! -f your_data.csv ]; then
    echo "CSV file (your_data.csv) not found."
    exit 1
fi

# Read the CSV file and create an array of options
IFS=$'\n'       # Set the Input Field Separator to newline
record_number=0 # Counter for the records
options=()      # Array to store records

while read -r line; do
    ((record_number++))
    options+=("$line")
    echo "$record_number) $line"
done < your_data.csv

# Get user selection
read -p "Enter the number of the record you want to select: " choice

# Check if the choice is within the valid range
if ! [[ "$choice" =~ ^[1-9][0-9]*$ ]] || ((choice < 1)) || ((choice > record_number)); then
    echo "Invalid selection. Please enter a valid number."
    exit 1
fi

# Get the selected record
selected_record="${options[choice - 1]}"
echo "You selected: $selected_record"
