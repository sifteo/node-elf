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
  NONE : 0,
  // AT&T WE 32100
  // http://en.wikipedia.org/wiki/AT%26T_Computer_Systems
  M32 : 1,
  I386 : 3,
  // ARM
  // http://infocenter.arm.com/help/topic/com.arm.doc.ihi0044d/IHI0044D_aaelf.pdf
  // http://en.wikipedia.org/wiki/ARM_architecture
  ARM : 40
}
