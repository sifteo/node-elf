/**
 * Module dependencies.
 */
var fs = require('fs')
  , Buffer = require('endian-buffer').Buffer
  , Encoding = require('./constants/encoding')
  , bignum = require('bignum');

/**
 * `Elf64` constructor.
 *
 * @api protected
 */
function Elf64(filename, enc) {
  this.filename = filename;
  this.enc = enc;
}

/**
 * Load a 64-bit ELF file.
 *
 * References:
 *  - [ELF-64 Object File Format](http://downloads.openwatcom.org/ftp/devel/docs/elf-64-gen.pdf)
 *
 * @param {Number} fd
 * @param {Function} cb
 * @api protected
 */
Elf64.prototype.load = function(fd, cb) {
  var self = this;
  var endian = this.enc == Encoding.LSB ? 'little' : 'big';
  
  // Read the ELF header, minus the identification portion.
  //
  // The format of the header is specified by the ELF-64 Object File Format,
  // section 3 (pg. 3).  For an online copy of this document, visit:
  //  http://downloads.openwatcom.org/ftp/devel/docs/elf-64-gen.pdf
  var header = new Buffer(48, endian)
    , slice
    , n64;
  fs.read(fd, header.buffer, 0, 48, null, function(err, bytesRead) {
    if (err) { return cb(err); }
    
    self.type = header.readUInt16(0); // ok
    self.machine = header.readUInt16(2); // ok
    self.version = header.readUInt32(4); // ok
    // entry
    slice = header.buffer.slice(8, 16);
    n64 = bignum.fromBuffer(slice, { endian: endian, size: 8 });
    self.entry = n64.toNumber();
    // phoff
    slice = header.buffer.slice(16, 24);
    n64 = bignum.fromBuffer(slice, { endian: endian, size: 8 });
    self.phoff = n64.toNumber();
    // shoff
    slice = header.buffer.slice(24, 32);
    n64 = bignum.fromBuffer(slice, { endian: endian, size: 8 });
    self.shoff = n64.toNumber();
    self.flags = header.readUInt32(32);
    self.ehsize = header.readUInt16(36);
    self.phentsize = header.readUInt16(38);
    self.phnum = header.readUInt16(40);
    self.shentsize = header.readUInt16(42);
    self.shnum = header.readUInt16(44);
    self.shstrndx = header.readUInt16(46);
    return cb();
  });
}

module.exports = Elf64;
