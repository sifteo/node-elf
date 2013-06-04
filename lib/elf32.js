/**
 * Module dependencies.
 */
var fs = require('fs')
  , Buffer = require('endian-buffer').Buffer
  , Encoding = require('./constants/encoding')

/**
 * `Elf32` constructor.
 *
 * @api protected
 */
function Elf32(filename, enc) {
  this.filename = filename;
  this.enc = enc;
}

/**
 * Load a 32-bit ELF file.
 *
 * References:
 *  - [System V Application Binary Interface](http://www.sco.com/developers/devspecs/gabi41.pdf)
 *
 * @param {Number} fd
 * @param {Function} cb
 * @api protected
 */
Elf32.prototype.load = function(fd, cb) {
  var self = this;
  var endian = this.enc == Encoding.LSB ? 'le' : 'be';
  
  // Read the ELF header, minus the identification portion.
  //
  // The format of the header is specified by the System V Application Binary
  // Interface, section 4 (pg. 48).  For an online copy of this document,
  // visit: http://www.sco.com/developers/devspecs/gabi41.pdf
  var header = new Buffer(36, endian);
  fs.read(fd, header.buffer, 0, 36, null, function(err, bytesRead) {
    if (err) { return cb(err); }
    
    self.type = header.readUInt16(0);
    self.machine = header.readUInt16(2);
    self.version = header.readUInt32(4);
    self.entry = header.readUInt32(8);
    self.phoff = header.readUInt32(12);
    self.shoff = header.readUInt32(16);
    self.flags = header.readUInt32(20);
    self.ehsize = header.readUInt16(24);
    self.phentsize = header.readUInt16(26);
    self.phnum = header.readUInt16(28);
    self.shentsize = header.readUInt16(30);
    self.shnum = header.readUInt16(32);
    self.shstrndx = header.readUInt16(34);
    return cb();
  });
}

module.exports = Elf32;
