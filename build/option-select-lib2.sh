#!/bin/bash

# Function to select specific fields from a CSV file and redirect the selection to an output file
select_records() {
    local csv_file="$1"      # The CSV file to process
    local field_numbers="$2" # Comma-separated list of field numbers to select
    local output_file="$3"  # The output file to store the selected records

    if [ ! -f "$csv_file" ]; then
        echo "CSV file ($csv_file) not found."
        return 1
    fi

    if [ -z "$output_file" ]; then
        echo "Output file not specified."
        return 1
    fi

    # Use awk to select specific fields and redirect the output to the specified file
    awk -F, -v fields="$field_numbers" 'BEGIN {split(fields, arr, ",")} {
        for (i = 1; i <= length(arr); i++) {
            if (i > 1) printf ","
            printf $arr[i]
        }
        printf "\n"
    }' "$csv_file" > "$output_file"
}

# Example usage:
# Call the function with the CSV file, a list of field numbers, and the output file
# The selected fields will be stored in the output file
select_records "your_data.csv" "1,3,5" "selected_records.csv"
