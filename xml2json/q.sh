numberRegions=`cat  ~/Downloads/fp-1.json | jq '.FlexiPage.flexiPageRegions' | jq 'length'`
echo "=== number of Regions = $numberRegions ==="
for ((i = 0; i < $numberRegions; i++)); do
# jq -c --arg i "$i" '.[$i|tonumber]')
    cat  ~/Downloads/fp-1.json |   jq -c --argjson i "$i"    '.FlexiPage.flexiPageRegions[$i].itemInstances.componentInstance.componentName'
done

