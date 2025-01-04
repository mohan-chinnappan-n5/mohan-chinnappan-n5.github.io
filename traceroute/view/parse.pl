#!/usr/bin/perl

use strict;
use warnings;
use autodie;

my $logfile    = 'trace.log';
my $parsedfile = 'trace.csv';

open my $infh,  '<', $logfile;
open my $outfh, '>', $parsedfile;

while (<$infh>) {
    if (/^[a-z]{3}\s+[a-z]{3}/i) {
        print $outfh $_;
        print $outfh qq{"Hop","IP","T1","T2","T3"\n};
    }
    elsif (/^\s*\d/) {
        chomp;
        s/^\s+//;
        print $outfh join(',', split /\s+(?!ms)/), "\n";
    }
}