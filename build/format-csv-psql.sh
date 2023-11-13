# Function to display a tabular view of a CSV file with box characters
display_csv_tabular() {
    local csv_file="$1"

    if [ ! -f "$csv_file" ]; then
        echo "CSV file ($csv_file) not found."
        return 1
    fi

    # Define box characters
    horizontal_line="─"
    vertical_line="│"
    top_left_corner="┌"
    top_right_corner="┐"
    bottom_left_corner="└"
    bottom_right_corner="┘"

    # Use column to format and display the CSV file as a table
    column -s, -t < "$csv_file" | awk -v h="$horizontal_line" -v v="$vertical_line" -v tl="$top_left_corner" -v tr="$top_right_corner" -v bl="$bottom_left_corner" -v br="$bottom_right_corner" '{
        if (NR == 1) {
            print tl h h h h h h h h h tr
            print v $0 v
        } else {
            print v $0 v
        }
        if (NR == 1) {
            print bl h h h h h h h h h br
        }
    }'
}

# Example usage:
# Call the function with the CSV file you want to display
display_csv_tabular "input.csv"
