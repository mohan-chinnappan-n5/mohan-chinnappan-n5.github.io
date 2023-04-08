# Script to render html for the default PMD rules for apex
# mchinnappan
for ITEM in bestpractices codestyle design documentation errorprone multithreading performance security
do
  echo sfdx mohanc:xml:transform -i https://raw.githubusercontent.com/pmd/pmd/master/pmd-apex/src/main/resources/category/apex/$ITEM.xml -m pmd-ruleset; 
  sfdx mohanc:xml:transform -i https://raw.githubusercontent.com/pmd/pmd/master/pmd-apex/src/main/resources/category/apex/$ITEM.xml -m pmd-ruleset; 
  mv output.html def-${ITEM}.html
done
