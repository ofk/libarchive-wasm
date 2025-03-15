FROM emscripten/emsdk:4.0.5

RUN apt-get update && \
    apt-get install -y locate file

WORKDIR /opt
ADD https://www.openssl.org/source/openssl-3.4.1.tar.gz /opt
RUN tar xf /opt/openssl-3.4.1.tar.gz && rm /opt/openssl-3.4.1.tar.gz && cd /opt/openssl-3.4.1 && \
    emmake bash -c "./Configure no-asm no-deprecated no-dso no-ssl3 no-tests -static linux-generic32" && \
    sed -i 's/CROSS_COMPILE=\/emsdk\/upstream\/emscripten\/em/CROSS_COMPILE=/' Makefile && \
    emmake make && emmake make install_sw

WORKDIR /opt
ADD https://github.com/madler/zlib/archive/v1.3.1.zip /opt
RUN unzip /opt/v1.3.1.zip && rm /opt/v1.3.1.zip && cd /opt/zlib-1.3.1 && \
    emconfigure ./configure --static && \
    emmake make && emmake make install

WORKDIR /opt
ADD https://sourceware.org/pub/bzip2/bzip2-1.0.8.tar.gz /opt
RUN tar xf /opt/bzip2-1.0.8.tar.gz && rm /opt/bzip2-1.0.8.tar.gz && cd /opt/bzip2-1.0.8 && \
    make CC="emcc" bzip2 && emmake make install

WORKDIR /opt
ADD https://github.com/tukaani-project/xz/releases/download/v5.6.4/xz-5.6.4.tar.gz /opt
RUN tar xf /opt/xz-5.6.4.tar.gz && rm /opt/xz-5.6.4.tar.gz && cd /opt/xz-5.6.4 && \
    sed -i 's/defined(__wasm__)/0/' src/common/mythread.h && \
    emconfigure ./configure --disable-assembler --enable-threads=no --enable-static=yes --enable-symbol-versions=no && \
    emmake make && emmake make install

WORKDIR /opt
ADD https://github.com/libarchive/libarchive/releases/download/v3.7.7/libarchive-3.7.7.zip /opt
ENV CPPFLAGS "-I/usr/local/include"
ENV LDLIBS "-lz -lbz2 -lssl -lcrypto"
ENV LDFLAGS "-L/usr/local/lib"
RUN unzip /opt/libarchive-3.7.7.zip && rm /opt/libarchive-3.7.7.zip && cd /opt/libarchive-3.7.7 && \
    emconfigure ./configure --disable-shared --enable-static \
    --enable-bsdtar=static --enable-bsdcat=static --enable-bsdcpio=static \
    --enable-posix-regex-lib=libc --disable-xattr --disable-acl \
    --without-lz4 --without-lzo2 --without-cng --without-nettle --without-xml2 --without-expat && \
    emmake make && emmake make install

WORKDIR /workdir

CMD ["bash"]
