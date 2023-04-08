#sfdx mohanc:md:describe -s Contact,Account -e contact-account.dot > contact-account.csv

echo `sfdx mohanc:md:describe -s $1 -e outfile.dot > outfile.csv`
echo `dot -Tsvg outfile.dot > outfile.svg`
open outfile.svg

