source ./query-lib.sh
csv_query_to_csv /tmp/_status.csv "SELECT fullName, type FROM temp_table WHERE ignored='false' " /tmp/output.csv
cat /tmp/output.csv

