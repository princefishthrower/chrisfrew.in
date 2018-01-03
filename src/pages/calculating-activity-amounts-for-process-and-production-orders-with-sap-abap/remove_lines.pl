use File::Slurp;

my $file_content = read_file('index.md');
$file_content =~ s/```abap.*?```//gs;
print $file_content;
