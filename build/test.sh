source ./opt-select-lib.sh
sf data query -f ~/.soql/sourceMember_new2.soql -t -r csv > sourceMembers2.csv -o geolocationAppScratch1
select_records sourceMembers2.csv  