#!/bin/bash

# Function to query a CSV file using SQLite and return the result as CSV
csv_query_to_csv() {
    local csv_file="$1"    # The CSV file to query
    local query="$2"       # The SQL-like query
    echo "--- $query ---"
    local output_csv="$3"  # The output CSV file

    if [ ! -f "$csv_file" ]; then
        echo "CSV file ($csv_file) not found."
        return 1
    fi

    if [ -z "$query" ]; then
        echo "Query not specified."
        return 1
    fi

    if [ -z "$output_csv" ]; then
        echo "Output CSV file not specified."
        return 1
    fi

    # Create a temporary SQLite database and import the CSV file
    sqlite3 -separator ',' -cmd ".mode csv" .temp.db ".import $csv_file temp_table"
    echo "Database created"

    # Execute the query and export the result to a CSV file
    echo $query
    sqlite3 -header -csv .temp.db "$query" > "$output_csv"

    # Clean up the temporary database
    rm -f .temp.db
}

# Example usage:
# Call the function with the CSV file, query, and output CSV file
# The result of the query will be saved in the output CSV file
# csv_query_to_csv "input.csv" "SELECT * FROM temp_table WHERE column_name = 'value'" "output.csv"
csv_query_to_csv $1 "$2" $3
cat $3

