# psv to json 
# mohan chinnappan
import csv
import sys 
import json 
csv.register_dialect('piper', delimiter='|')
file_name = sys.argv[1]
with open(file_name, "r") as csvfile:
    data = [] 
    for row in csv.DictReader(csvfile, dialect='piper'):
	    data.append(row)

with open(file_name + '.json', 'w', encoding='utf-8') as jsonf: 
        jsonString = json.dumps(data, indent=4)
        jsonf.write(jsonString)
