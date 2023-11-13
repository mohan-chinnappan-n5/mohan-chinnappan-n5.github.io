#!/bin/bash

# Define the function
select_records() {
    local csv_file="$1"
    local output_file="$2"

    if [ ! -f "$csv_file" ]; then
        echo "CSV file ($csv_file) not found."
        return 1
    fi

    IFS=$'\n'       # Set the Input Field Separator to newline
    record_number=0 # Counter for the records
    options=()      # Array to store records

    while read -r line; do
        ((record_number++))
        options+=("$line")
        echo "$record_number) $line"
    done < "$csv_file"

    local selected_records=()
    while true; do
        read -p "Enter the numbers of the records you want to select (comma-separated): " choice

        IFS=',' read -ra choices <<< "$choice"

        for choice in "${choices[@]}"; do
            if [[ "$choice" =~ ^[1-9][0-9]*$ && $choice -ge 1 && $choice -le $record_number ]]; then
                selected_records+=("${options[choice - 1]}")
            else
                echo "Invalid selection: $choice. Please enter a valid number."
            fi
        done

        read -p "Do you want to make more selections (y/n)? " more
        if [ "$more" != "y" ]; then
            break
        fi
    done
    
    echo  "Id,MemberType,MemberName,RevisionNum,RevisionCounter,LastModifiedById,IsNewMember,ChangedBy" >  ${output_file}
    echo "Selected records:"
    for record in "${selected_records[@]}"; do
        echo  "$record" 2>&1  | tee -a  ${output_file}
    done
}

# Call the function with the CSV file as an argument
select_records $1 $2




