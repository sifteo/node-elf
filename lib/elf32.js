/**
 * Module dependencies.
 */
var fs = require('fs')
  , EndianBuffer = require('endian-buffer').Buffer
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
 * Read the segment identified by `type` from the ELF.
 *
 * @param {Number} type
 * @param {Function} cb
 * @api public
 */
Elf32.prototype.readSegment = function(type, cb) {
  var self = this;
  fs.open(this.filename, 'r', function(err, fd) {
    if (err) { return cb(err); }
    
    // wrap `cb` to close the file descriptor
    function done(err, buf) {
      fs.close(fd, function(cerr) {
        if (cerr) { return cb(cerr); }
        return cb(err, buf);
      });
    }
    
    // find program header with specified `type`
    var ph;
    for (var i = 0, len = self.pheaders.length; i < len; ++i) {
      if (self.pheaders[i].type === type) {
        ph = self.pheaders[i];
        break;
      }
    }
    
    if (!ph) { return done(new Error('No program header with type: ' + type)); }
    
    var buf = new Buffer(ph.filesz);
    fs.read(fd, buf, 0, ph.filesz, ph.offset, function(err, bytesRead) {
      if (err) { return done(err); }
      return done(null, buf);
    });
  });
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
  var header = new EndianBuffer(36, endian);
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
    self.pheaders = [];
    self.sheaders = [];
    
    // Parse the ELF's section header table.
    //
    // The section header table consists of an array of section header
    // structures.  The format of these structures is specified by the System V
    // Application Binary Interface, section 4 (pg. 54).
    function parseSHT(cb) {
      if (self.shoff === 0) { return cb(); } // no section header table
      
      (function iter(i, err) {
        if (err) { return cb(err); }
        if (i >= self.shnum) { return cb(); } // done
        
        var pos = self.shoff + (self.shentsize * i);
        var entry = new EndianBuffer(self.shentsize, endian);
        fs.read(fd, entry.buffer, 0, self.shentsize, pos, function(err, bytesRead) {
          if (err) { return iter(i + 1, err); }
          
          var sh = {};
          sh.namendx = entry.readUInt32(0);
          sh.type = entry.readUInt32(4);
          sh.flags = entry.readUInt32(8);
          sh.addr = entry.readUInt32(12);
          sh.offset = entry.readUInt32(16);
          sh.size = entry.readUInt32(20);
          sh.link = entry.readUInt32(24);
          sh.info = entry.readUInt32(28);
          sh.addralign = entry.readUInt32(32);
          sh.entsize = entry.readUInt32(36);
          self.sheaders.push(sh);
          return iter(i + 1);
        });
      })(0);
    }
    
    // Parse the ELF's section header string table, associating sections headers
    // with their corresponding names.
    //
    // The format of the string table is specified by the System V Application
    // Binary Interface, section 4 (pg. 65).
    function parseSHStrTab(cb) {
      if (self.shoff === 0) { return cb(); } // no section header table
      
      var strsh = self.sheaders[self.shstrndx];
      var strsec = new Buffer(strsh.size);
      
      fs.read(fd, strsec, 0, strsh.size, strsh.offset, function(err, bytesRead) {
        if (err) { return cb(err); }
        
        for (var i = 0, len = self.sheaders.length; i < len; ++i) {
          var sh = self.sheaders[i]
            , start = sh.namendx
            , end = sh.namendx;
            
          if (sh.namendx === 0) { continue; }
          while (strsec[end] !== 0) { ++end; }
          sh.name = strsec.slice(start, end).toString();
        }
        return cb();
      });
    }
    
    // Parse the ELF's program header table.
    //
    // The program header table consists of an array of program header
    // structures.  The format of these structures is specified by the System V
    // Application Binary Interface, section 5 (pg. 75).
    function parsePHT(cb) {
      if (self.phoff === 0) { return cb(); } // no program header table
      
      (function iter(i, err) {
        if (err) { return cb(err); }
        if (i >= self.phnum) { return cb(); } // done
        
        var pos = self.phoff + (self.phentsize * i);
        var entry = new EndianBuffer(self.phentsize, endian);
        fs.read(fd, entry.buffer, 0, self.phentsize, pos, function(err, bytesRead) {
          if (err) { return iter(i + 1, err); }
          
          var ph = {};
          self.pheaders.push(ph);
          ph.type = entry.readUInt32(0);
          ph.offset = entry.readUInt32(4);
          ph.vaddr = entry.readUInt32(8);
          ph.paddr = entry.readUInt32(12);
          ph.filesz = entry.readUInt32(16);
          ph.memsz = entry.readUInt32(20);
          ph.flags = entry.readUInt32(24);
          ph.align = entry.readUInt32(28);
          return iter(i + 1);
        });
      })(0);
    }
    
    
    parseSHT(function(err) {
      if (err) { return cb(err); }
      parseSHStrTab(function(err) {
        if (err) { return cb(err); }
        parsePHT(function(err) {
          if (err) { return cb(err); }
          return cb();
        });
      });
    });
  });
}

module.exports = Elf32;
