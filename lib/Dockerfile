# The toolchain image and every source archive are pinned by SHA-256.
# The archive hashes were checked against the upstream release signatures
# (or the published .sha256 for OpenSSL).
FROM emscripten/emsdk:4.0.5@sha256:5aea37132ad0827908065a5d7432d2f4048011dce7169aa1ab3441b0720312e2

WORKDIR /opt
ADD --checksum=sha256:a2157c2830efdec3788939b00c9b0638306d3f0bbb76dc4832ee503bb397df98 \
    https://github.com/openssl/openssl/releases/download/openssl-3.6.5/openssl-3.6.5.tar.gz /opt/
RUN tar xf /opt/openssl-3.6.5.tar.gz && rm /opt/openssl-3.6.5.tar.gz && cd /opt/openssl-3.6.5 && \
    emmake bash -c "./Configure no-asm no-deprecated no-dso no-ssl3 no-tests -static linux-generic32" && \
    sed -i 's/CROSS_COMPILE=\/emsdk\/upstream\/emscripten\/em/CROSS_COMPILE=/' Makefile && \
    emmake make && emmake make install_sw

WORKDIR /opt
ADD --checksum=sha256:bb329a0a2cd0274d05519d61c667c062e06990d72e125ee2dfa8de64f0119d16 \
    https://github.com/madler/zlib/releases/download/v1.3.2/zlib-1.3.2.tar.gz /opt/
RUN tar xf /opt/zlib-1.3.2.tar.gz && rm /opt/zlib-1.3.2.tar.gz && cd /opt/zlib-1.3.2 && \
    emconfigure ./configure --static && \
    emmake make && emmake make install

WORKDIR /opt
ADD --checksum=sha256:ab5a03176ee106d3f0fa90e381da478ddae405918153cca248e682cd0c4a2269 \
    https://sourceware.org/pub/bzip2/bzip2-1.0.8.tar.gz /opt/
RUN tar xf /opt/bzip2-1.0.8.tar.gz && rm /opt/bzip2-1.0.8.tar.gz && cd /opt/bzip2-1.0.8 && \
    make CC="emcc" bzip2 && emmake make install

WORKDIR /opt
ADD --checksum=sha256:0014c7886930454fe8bd4228665b51af55eeae560ea135c9c4cd33f55b2591d9 \
    https://github.com/tukaani-project/xz/releases/download/v5.8.4/xz-5.8.4.tar.gz /opt/
RUN tar xf /opt/xz-5.8.4.tar.gz && rm /opt/xz-5.8.4.tar.gz && cd /opt/xz-5.8.4 && \
    emconfigure ./configure --disable-assembler --enable-threads=no --enable-static=yes --enable-symbol-versions=no && \
    emmake make && emmake make install

WORKDIR /opt
ADD --checksum=sha256:900fe9fc7237c2b04f090f3c3648de8fe597525771f5035016537ce2d667d12b \
    https://github.com/libarchive/libarchive/releases/download/v3.8.11/libarchive-3.8.11.tar.gz /opt/
ENV CPPFLAGS="-I/usr/local/include"
ENV LDLIBS="-lz -lbz2 -lssl -lcrypto"
ENV LDFLAGS="-L/usr/local/lib"
RUN tar xf /opt/libarchive-3.8.11.tar.gz && rm /opt/libarchive-3.8.11.tar.gz && cd /opt/libarchive-3.8.11 && \
    emconfigure ./configure --disable-shared --enable-static \
    --disable-bsdtar --disable-bsdcat --disable-bsdcpio --disable-bsdunzip \
    --enable-posix-regex-lib=libc --disable-xattr --disable-acl \
    --without-lz4 --without-lzo2 --without-cng --without-nettle --without-xml2 --without-expat && \
    emmake make && emmake make install

WORKDIR /workdir

CMD ["bash"]
