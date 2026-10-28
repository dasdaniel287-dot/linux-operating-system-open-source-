#!/bin/sh
# /etc/init.d/rcS - System startup script for WebLinux

echo "==> Booting WebLinux (v86 WebAssembly Engine)..."

# Mount virtual filesystems
mount -t proc none /proc
mount -t sysfs none /sys
mount -t devtmpfs none /dev 2>/dev/null || mount -t tmpfs none /dev

# Mount 9p VirtFS host shared directory if VirtIO bus available
if grep -q 9p /proc/filesystems; then
  mkdir -p /mnt/host
  mount -t 9p -o trans=virtio,version=9p2000.L host9p /mnt/host 2>/dev/null && \
    echo "==> Mounted /mnt/host via VirtIO 9p"
fi

# Configure network loopback
ifconfig lo 127.0.0.1 up 2>/dev/null

echo "==> WebLinux Kernel $(uname -r) Initialized Successfully!"
echo "==> Welcome to your browser-native Linux terminal. Type 'help' or commands to begin."
