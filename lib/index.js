/**
 * Module dependencies.
 */
var fs = require('fs')
  , Elf32 = require('./elf32')
  , Elf64 = require('./elf64')
  , Capacity = require('./constants/capacity')

var MAGIC = 0x7f454c46; // 0x7f'E''L''F'


/**
 * Load an ELF file.
 *
 * Examples:
 *
 *     elf.load('/usr/local/bin/node', function(err) {
 *       if (err) throw err;
 *       console.log(file.machine)
 *     });
 *
 * @param {String} filename
 * @param {Function} cb
 * @api protected
 */
exports.load = function(filename, cb) {
  cb = cb || function() {};
  
  fs.open(filename, 'r', function(err, fd) {
    if (err) { return cb(err); }
    
    function done(err, elf) {
      fs.close(fd, function(cerr) {
        if (cerr) { return cb(cerr); }
        return cb(err, elf);
      });
    }
    
    // Read the identification portion of the ELF header.  This gives us the
    // information necessary to decode and interpret the remainder of the file's
    // contents, including the class, or capacity, of the file.
    //
    // The format of this portion is specified by the System V Application
    // Binary Interface, section 4 (pg. 51).  For an online copy of this document,
    // visit: http://www.sco.com/developers/devspecs/gabi41.pdf
    var ident = new Buffer(16);
    fs.read(fd, ident, 0, 16, null, function(err, bytesRead) {
      if (err) { return done(err); }
      
      var magic = ident.readUInt32BE(0)
        , cap = ident.readUInt8(4)
        , enc = ident.readUInt8(5)
        , ver = ident.readUInt8(6)
        , elf;
      
      if (MAGIC != magic) { return done(new Error('Incorrect magic number: ' + magic)); }
      
      // Instantiate an underlying ELF implementation based on the identified
      // capacity, factory-style.
      switch (cap) {
        case Capacity.A32BIT:
          elf = new Elf32(filename, enc);
          break;
        case Capacity.A64BIT:
          elf = new Elf64(filename, enc);
          break;
        default:
          return done(new Error('Unsupported ELF class: ' + cap));
      }
      
      elf.load(fd, function(err) {
        if (err) { return done(err); }
        return done(null, elf);
      });
    });
  });
}


exports.Capacity = Capacity;
exports.Encoding = require('./constants/encoding');
exports.Type = require('./constants/type');
exports.Machine = require('./constants/machine');
exports.Version = require('./constants/version');
