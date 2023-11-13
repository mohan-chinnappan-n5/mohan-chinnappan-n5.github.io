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

# Initialize an array to store selected records
selected_records=()

# Prompt the user for selections
while true; do
    read -p "Enter the numbers of the records you want to select (comma-separated): " choice

    # Split the user input by commas and trim leading/trailing spaces
    IFS=',' read -ra choices <<< "$choice"

    # Loop through user choices
    for choice in "${choices[@]}"; do
        if [[ "$choice" =~ ^[1-9][0-9]*$ && $choice -ge 1 && $choice -le $record_number ]]; then
            selected_records+=("${options[choice - 1]}")
        else
            echo "Invalid selection: $choice. Please enter a valid number."
        fi
    done

    # Ask the user if they want to make more selections
    read -p "Do you want to make more selections (y/n)? " more
    if [ "$more" != "y" ]; then
        break
    fi
done

# Display the selected records
echo "You selected the following records:"
for record in "${selected_records[@]}"; do
    echo "$record"
done
