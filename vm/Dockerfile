# WebLinux Reproducible VM RootFS Builder
# Produces minimal, bootable x86 Linux image for WebAssembly v86 emulator

FROM alpine:3.20 AS builder

# Install build dependencies
RUN apk update && apk add --no-cache \
    syslinux \
    dosfstools \
    mtools \
    xorriso \
    squashfs-tools \
    tar \
    gzip \
    bash

WORKDIR /build

# Create rootfs layout
RUN mkdir -p /build/rootfs && \
    mkdir -p /build/rootfs/bin /build/rootfs/sbin /build/rootfs/etc \
             /build/rootfs/proc /build/rootfs/sys /build/rootfs/dev \
             /build/rootfs/mnt/host /build/rootfs/root /build/rootfs/home/developer \
             /build/rootfs/tmp /build/rootfs/var/log /build/rootfs/etc/init.d

# Copy inittab and init scripts
COPY inittab /build/rootfs/etc/inittab
COPY init.sh /build/rootfs/etc/init.d/rcS
RUN chmod +x /build/rootfs/etc/init.d/rcS

# Add basic /etc/issue and /etc/hosts
RUN echo "WebLinux (x86 WebAssembly) \n \l" > /build/rootfs/etc/issue && \
    echo "127.0.0.1 localhost weblinux" > /build/rootfs/etc/hosts && \
    echo "root:x:0:0:root:/root:/bin/sh" > /build/rootfs/etc/passwd && \
    echo "developer:x:1000:1000:Developer:/home/developer:/bin/sh" >> /build/rootfs/etc/passwd && \
    echo "root:*:19800:0:99999:7:::" > /build/rootfs/etc/shadow

# Build ISO packaging script
COPY build-rootfs.sh /build/build-rootfs.sh
RUN chmod +x /build/build-rootfs.sh

ENTRYPOINT ["/build/build-rootfs.sh"]
