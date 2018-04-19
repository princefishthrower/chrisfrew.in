var shell = require('shelljs');

console.log("Copying 'public' and 'static' folders to ../chrisfrew.in-static/");

if (shell.exec('cp -r public/ ../chrisfrew.in-static/public/').code !== 0) {
  shell.echo('Error: file copy of public failed!');
  shell.exit(1);
} else {
  shell.echo('File copy of public successful!');
}// copy dist to dist repo

if (shell.exec('cp -r static/ ../chrisfrew.in-static/static/').code !== 0) {
  shell.echo('Error: file copy of static failed!');
  shell.exit(1);
} else {
  shell.echo('File copy of static successful!');
}// copy dist to dist repo
