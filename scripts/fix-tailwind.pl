#!/usr/bin/env perl
use strict;
use warnings;
use File::Find;

my @files;
find(sub { push @files, $File::Find::name if /\.tsx$/ }, 'src');

for my $file (@files) {
    open my $fh, '<', $file or die "Cannot read $file: $!";
    my $content = do { local $/; <$fh> };
    close $fh;

    my $original = $content;

    # Gradient directions (TW4 canonical) - order matters: br before b
    $content =~ s/bg-gradient-to-br/bg-linear-to-br/g;
    $content =~ s/bg-gradient-to-b\b/bg-linear-to-b/g;
    $content =~ s/bg-gradient-to-r/bg-linear-to-r/g;

    # CSS var bracket → parenthesis syntax
    $content =~ s/\[var\(--container-max\)\]/(--container-max)/g;
    $content =~ s/\[var\(--transition-fast\)\]/(--transition-fast)/g;
    $content =~ s/\[var\(--transition-base\)\]/(--transition-base)/g;
    $content =~ s/\[var\(--glass-border\)\]/(--glass-border)/g;
    $content =~ s/\[var\(--glass-background\)\]/(--glass-background)/g;
    $content =~ s/\[var\(--glass-shadow\)\]/(--glass-shadow)/g;
    $content =~ s/bg-\[var\(--background\)\]/bg-background/g;
    $content =~ s/bg-\[var\(--accent-primary\)\]/bg-accent-primary/g;

    # Arbitrary pixel values → canonical spacing
    $content =~ s/z-\[9999\]/z-9999/g;
    $content =~ s/top-\[18px\]/top-4.5/g;
    $content =~ s/p-\[2px\]/p-0.5/g;
    $content =~ s/h-\[88px\]/h-22/g;
    $content =~ s/w-\[88px\]/w-22/g;
    $content =~ s/h-\[600px\]/h-150/g;
    $content =~ s/w-\[600px\]/w-150/g;
    $content =~ s/h-\[500px\]/h-125/g;
    $content =~ s/w-\[500px\]/w-125/g;
    $content =~ s/max-h-\[500px\]/max-h-125/g;

    # Opacity bracket → bare fraction
    $content =~ s/border-white\/\[0\.06\]/border-white\/6/g;
    $content =~ s/bg-white\/\[0\.015\]/bg-white\/1.5/g;
    $content =~ s/bg-white\/\[0\.03\]/bg-white\/3/g;
    $content =~ s/bg-white\/\[0\.04\]/bg-white\/4/g;
    $content =~ s/bg-white\/\[0\.02\]/bg-white\/2/g;
    $content =~ s/bg-white\/\[0\.08\]/bg-white\/8/g;
    $content =~ s/to-white\/\[0\.02\]/to-white\/2/g;

    # -z-0 → z-0
    $content =~ s/ -z-0 / z-0 /g;

    # Shadow conflict: remove duplicate shadow-lg when shadow-(--glass-shadow) is present
    $content =~ s/shadow-\(--glass-shadow\) shadow-lg/shadow-(--glass-shadow)/g;

    if ($content ne $original) {
        open my $out, '>', $file or die "Cannot write $file: $!";
        print $out $content;
        close $out;
        print "Fixed: $file\n";
    }
}

print "Done!\n";
