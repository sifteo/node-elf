# node-elf

This module provides a parser for [ELF](http://en.wikipedia.org/wiki/Executable_and_Linkable_Format)
files.

## Install

    $ npm install sysvelf

## Usage

Load an ELF file:

```javascript
elf.load('/usr/local/bin/node', function(err, file) {
  if (err) throw err;
  console.log('version: ' + file.version);
  console.log('machine: ' + file.machine);
});
```

Read a segment:

```javascript
file.readSegment(0x01, function(err, buf) {
});
```

Read a section:

```javascript
file.readSection('.text', function(err, buf) {
});
```

## Examples

For an example that parses an ELF header, refer to the [parse.js](https://github.com/sifteo/node-elf/blob/master/examples/parse.js)
example.

## Tests

    $ npm install
    $ make test

[![Build Status](https://secure.travis-ci.org/sifteo/node-elf.png)](http://travis-ci.org/sifteo/node-elf)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2013 Sifteo Inc. <[http://www.sifteo.com/](http://www.sifteo.com/)>
