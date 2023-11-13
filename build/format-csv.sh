# Function to display a tabular view of a CSV file
display_csv_tabular() {
    local csv_file="$1"

    if [ ! -f "$csv_file" ]; then
        echo "CSV file ($csv_file) not found."
        return 1
    fi

    # Use column to format and display the CSV file as a table
    column -s, -t < "$csv_file"
}

# Example usage:
# Call the function with the CSV file you want to display
display_csv_tabular "input.csv"
