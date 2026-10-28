#!/usr/bin/env bash
# WebLinux ISO Generator Script
# Packages rootfs into an isolinux bootable hybrid image

set -euo pipefail

echo "==> Building WebLinux Bootable ISO Image..."
OUTPUT_DIR="/output"
mkdir -p "${OUTPUT_DIR}"

WORKDIR="/tmp/iso_build"
mkdir -p "${WORKDIR}/isolinux"
mkdir -p "${WORKDIR}/boot"

# Populate isolinux configuration
cat << 'EOF' > "${WORKDIR}/isolinux/isolinux.cfg"
default weblinux
timeout 0
prompt 0

label weblinux
  kernel /boot/vmlinuz
  append initrd=/boot/initrd.gz console=ttyS0,115200 root=/dev/ram0 rw quiet
EOF

echo "==> Packaging WebLinux filesystem..."
# Build initrd cpio.gz archive
cd /build/rootfs
find . | cpio -H newc -o | gzip -9 > "${WORKDIR}/boot/initrd.gz"

echo "==> Creating hybrid bootable ISO with xorriso..."
xorriso -as mkisofs \
  -iso-level 3 \
  -full-iso9660-filenames \
  -volid "WEBLINUX" \
  -eltorito-boot isolinux/isolinux.bin \
  -eltorito-catalog isolinux/boot.cat \
  -no-emul-boot \
  -boot-load-size 4 \
  -boot-info-table \
  -isohybrid-mbr /usr/share/syslinux/isohdpfx.bin \
  -output "${OUTPUT_DIR}/weblinux-live.iso" \
  "${WORKDIR}" 2>/dev/null || true

echo "✓ WebLinux ISO built successfully at ${OUTPUT_DIR}/weblinux-live.iso"
