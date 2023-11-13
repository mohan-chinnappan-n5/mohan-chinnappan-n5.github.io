#!/bin/bash

# Function to select specific fields from a CSV file
select_fields() {
    local csv_file="$1"    # The CSV file to process
    local field_numbers="$2"  # Comma-separated list of field numbers to select

    if [ ! -f "$csv_file" ]; then
        echo "CSV file ($csv_file) not found."
        return 1
    fi

    # Use awk to select specific fields
    awk -F, -v fields="$field_numbers" 'BEGIN {split(fields, arr, ",")} {
        for (i = 1; i <= length(arr); i++) {
            if (i > 1) printf ","
            printf $arr[i]
        }
        printf "\n"
    }' "$csv_file"
}

# Example usage:
# Call the function with the CSV file and a list of field numbers (e.g., "1,3,5")
# The selected fields will be printed to the console
#select_fields your_data.csv" "1,3,5"
select_fields $1 $2 
