# Convert JSON to CSV using jq
csv_data=$(echo "$json_data" | jq -r '.result[] | [.fullName, .type, .state, .ignored, .origin, .actualState] | @csv')

# Add header row
header="fullName,type,state,ignored,origin,actualState"
csv_data_with_header="${header}\n${csv_data}"

# Write CSV data to a file
echo -e "$csv_data_with_header" > output.csv