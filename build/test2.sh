source ./opt-select-lib.sh
source ./format-csv.sh

#--------------------
# run it by:
# bash build.sh
#--------------------

#--- Parameters ---
#ORG="geolocationAppScratch1"
ORG="test-5qg1icc3l4vd@example.com"
PROJECT_NAME="mango"
REPO="https://program.github.com/mango"
JIRA="WI-1234"
CMT_MSG="doc update"
PARENT_BRANCH="develop"
#--------------------

#--- Form the SOQL for querying ---
QUERY_FILE=/tmp/sourcemember_query.soql
SELECT_OUT_FILE=/tmp/sm_select.csv

cat <<EOF > $QUERY_FILE
SELECT Id,
MemberType,MemberName,         
RevisionNum, RevisionCounter,  
LastModifiedById, IsNewMember,
ChangedBy                      
FROM SourceMember              
WHERE isNewMember = true AND
LastModifiedById IN (SELECT Id FROM User where userName='test-5qg1icc3l4vd@example.com' )
EOF

cat $QUERY_FILE

#mkdir BUILD; cd BUILD
#git clone https://program.github.com/mango 
#cd  mango

echo '==== Create a branch ==='

#git branch WI-1234
#git checkout WI-1234


# sfdx mohanc:tooling:query -q ./sourceMember_new2.soql > sourceMembers.csv
sf data query -f $QUERY_FILE  -o ${ORG} -t -r csv > sourceMembers2.csv 
cat sourceMembers2.csv  
select_records sourceMembers2.csv  ${SELECT_OUT_FILE}
echo "============================="
display_csv_tabular  ${SELECT_OUT_FILE} 