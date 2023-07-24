FROM emscripten/emsdk:3.1.43

WORKDIR /opt
ADD https://github.com/libarchive/libarchive/releases/download/v3.6.2/libarchive-3.6.2.zip /opt
ADD https://github.com/madler/zlib/archive/v1.2.13.zip /opt
ADD https://sourceware.org/pub/bzip2/bzip2-1.0.8.tar.gz /opt
ADD https://github.com/tukaani-project/xz/releases/download/v5.4.3/xz-5.4.3.tar.gz /opt
ADD https://www.openssl.org/source/openssl-3.1.1.tar.gz /opt

RUN unzip /opt/libarchive-3.6.2.zip && rm /opt/libarchive-3.6.2.zip && \
    unzip /opt/v1.2.13.zip && rm /opt/v1.2.13.zip && \
    tar xf /opt/bzip2-1.0.8.tar.gz && rm /opt/bzip2-1.0.8.tar.gz && \
    tar xf /opt/xz-5.4.3.tar.gz && rm /opt/xz-5.4.3.tar.gz && \
    tar xf /opt/openssl-3.1.1.tar.gz && rm /opt/openssl-3.1.1.tar.gz

RUN apt-get update && \
    apt-get install -y locate file

WORKDIR /opt/openssl-3.1.1
RUN cd /opt/openssl-3.1.1 && \
    emmake bash -c "./Configure no-asm no-deprecated no-dso no-ssl3 no-tests -static linux-generic32" && \
    sed -i 's/CROSS_COMPILE=\/emsdk\/upstream\/emscripten\/em/CROSS_COMPILE=/' Makefile && \
    emmake make && emmake make install_sw

WORKDIR /opt/zlib-1.2.13
RUN cd /opt/zlib-1.2.13 && \
    emconfigure ./configure --static && \
    emmake make && emmake make install

WORKDIR /opt/bzip2-1.0.8
RUN cd /opt/bzip2-1.0.8 && \
    make CC="emcc" bzip2 && emmake make install

WORKDIR /opt/xz-5.4.3
RUN cd /opt/xz-5.4.3 && \
    emconfigure ./configure --disable-assembler --enable-threads=no --enable-static=yes --enable-symbol-versions=no && \
    emmake make && emmake make install

WORKDIR /opt/libarchive-3.6.2
ENV CPPFLAGS "-I/usr/local/include"
ENV LDLIBS "-lz -lbz2 -lssl -lcrypto"
ENV LDFLAGS "-L/usr/local/lib"
RUN cd /opt/libarchive-3.6.2 && \
    emconfigure ./configure --disable-shared --enable-static \
    --enable-bsdtar=static --enable-bsdcat=static --enable-bsdcpio=static \
    --enable-posix-regex-lib=libc --disable-xattr --disable-acl \
    --without-lz4 --without-lzo2 --without-cng --without-nettle --without-xml2 --without-expat && \
    emmake make && emmake make install

WORKDIR /workdir

CMD ["bash"]
