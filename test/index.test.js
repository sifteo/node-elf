var elf = require('index');


describe('elf', function() {
    
  it('should export load', function() {
    expect(elf.load).to.be.a('function');
  });
  
  describe('loading a Sifteo SVM ELF file', function() {
    
    it('should parse correctly', function(done) {
      elf.load('test/data/sifteo-cubes/membrane.elf', function(err, file) {
        expect(err).to.be.null;
        expect(file.enc).to.equal(elf.Encoding.LSB);
        expect(file.type).to.equal(elf.Type.EXECUTABLE);
        expect(file.machine).to.equal(elf.Machine.ARM);
        expect(file.version).to.equal(elf.Version.CURRENT);
        expect(file.entry).to.equal(2130706433); // ???
        expect(file.phoff).to.equal(52);
        expect(file.shoff).to.equal(491832);
        expect(file.flags).to.equal(0);
        expect(file.ehsize).to.equal(52);
        expect(file.phentsize).to.equal(32);
        expect(file.phnum).to.equal(4);
        expect(file.shentsize).to.equal(40);
        expect(file.shnum).to.equal(24);
        expect(file.shstrndx).to.equal(21);
        done();
      });
    });
  });
  
  it('should export capacity constants', function() {
    expect(elf.Capacity.NONE).to.equal(0);
    expect(elf.Capacity.A32BIT).to.equal(1);
    expect(elf.Capacity.A64BIT).to.equal(2);
  });
  
  it('should export encoding constants', function() {
    expect(elf.Encoding.NONE).to.equal(0);
    expect(elf.Encoding.LSB).to.equal(1);
    expect(elf.Encoding.LE).to.equal(1);
    expect(elf.Encoding.MSB).to.equal(2);
    expect(elf.Encoding.BE).to.equal(2);
  });
  
  it('should export type constants', function() {
    expect(elf.Type.NONE).to.equal(0);
    expect(elf.Type.RELOCATABLE).to.equal(1);
    expect(elf.Type.EXECUTABLE).to.equal(2);
    expect(elf.Type.DYNAMIC).to.equal(3);
    expect(elf.Type.CORE).to.equal(4);
  });
  
  it('should export machine constants', function() {
    expect(elf.Machine.NONE).to.equal(0);
    expect(elf.Machine.M32).to.equal(1);
  });
  
  it('should export version constants', function() {
    expect(elf.Version.NONE).to.equal(0);
    expect(elf.Version.CURRENT).to.equal(1);
  });
  
});
