#!/bin/bash

# Read the CSV data into an associative array
declare -A csv_data
while IFS=, read -r key value; do
  csv_data["$key"]=$value
done < input.csv

# Function to create a box around text
create_box() {
  local text="$1"
  local text_length=${#text}
  local box_length=$((text_length + 4))
  local box="┌"
  local i

  for ((i = 0; i < box_length; i++)); do
    box+="─"
  done

  box+="┐\n│ $text │\n└"
  for ((i = 0; i < box_length; i++)); do
    box+="─"
  done

  box+="┘"

  echo -e "$box"
}

# Print the CSV data in a formatted table
for key in "${!csv_data[@]}"; do
  value=${csv_data[$key]}
  create_box "$key"
  create_box "$value"
  echo
done
