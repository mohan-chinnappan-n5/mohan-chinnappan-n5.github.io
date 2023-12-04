input=~/Downloads/fp-1.json
numberRegions=`cat  $input| jq '.FlexiPage.flexiPageRegions' | jq 'length'`
echo "=== number of Regions = $numberRegions ==="
cat  $input |   jq -c  '.FlexiPage.masterLabel' 
cat  $input |   jq -c  '.FlexiPage.sobjectType' 
echo "======================================="
for ((i = 0; i < $numberRegions; i++)); do
    cat  $input |   jq -c --argjson i "$i"    '.FlexiPage.flexiPageRegions[$i].type' 
    cat  $input |   jq -c --argjson i "$i"    '.FlexiPage.flexiPageRegions[$i].name' 
    cat  $input |   jq -c --argjson i "$i"    '.FlexiPage.flexiPageRegions[$i].itemInstances.componentInstance.componentName'
    echo "${i}----------------"
done
