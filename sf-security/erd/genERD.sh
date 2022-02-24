#sfdx mohanc:md:describe -s Contact,Account -e contact-account.dot > contact-account.csv

outfile=`echo $1 | sed 's/,/_/g'`
echo `sfdx mohanc:md:describe -s $1 -e $outfile.dot > $outfile.csv`
echo `dot -Tsvg $outfile.dot > $outfile.svg`
open $outfile.svg

