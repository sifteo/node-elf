/**
 * Machine constants.
 *
 * Values 0 - 10 are defined by the System V Application Binary Interface,
 * section 4 (pg. 49)
 * http://www.sco.com/developers/devspecs/gabi41.pdf
 *
 * Other values are defined by processor supplements.
 *
 * See the following header files for machine constants used by Linux
 * distributions:
 *   - [Android](https://android.googlesource.com/platform/external/kernel-headers/+/1d8c41fec03332b2ca3d05d34115e5c00d8ae6cf/original/linux/elf-em.h)
 *   - [uClinux](http://www.uclinux.org/pub/uClinux/archive/att-7745/01-elf.h)
 */

module.exports = {
  NONE        :  0,
  M32         :  1, // AT&T WE 32100
                    // [AT&T Computer Systems](http://en.wikipedia.org/wiki/AT%26T_Computer_Systems)
  SPARC       :  2,
  I386        :  3,
  M68K        :  4,
  M88K        :  5,
  I860        :  7,
  MIPS        :  8,
  MIPS_RS4_BE : 10,
  ARM         : 40, // [ELF for the ARM Architecture](http://infocenter.arm.com/help/topic/com.arm.doc.ihi0044d/IHI0044D_aaelf.pdf)
  X86_64      : 62  // AMD64
                    // [AMD64 Architecture Processor Supplement](http://refspecs.linuxfoundation.org/elf/x86_64-abi-0.95.pdf)
}
