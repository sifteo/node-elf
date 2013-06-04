var elf = require('../lib')

elf.load('/usr/local/bin/node', function(err, file) {
  if (err) throw err;
  console.log('version: ' + file.version);
  console.log('machine: ' + file.machine);
});
