FROM trzeci/emscripten:1.39.4-ubuntu

WORKDIR /opt
ADD https://github.com/libarchive/libarchive/releases/download/v3.6.2/libarchive-3.6.2.zip /opt
ADD https://github.com/madler/zlib/archive/v1.2.13.zip /opt
ADD https://tukaani.org/xz/xz-5.4.3.tar.gz /opt
ADD https://sourceware.org/pub/bzip2/bzip2-1.0.8.tar.gz /opt
ADD https://www.openssl.org/source/openssl-1.0.2u.tar.gz /opt

RUN unzip /opt/libarchive-3.6.2.zip && rm /opt/libarchive-3.6.2.zip && \
    unzip /opt/v1.2.13.zip && rm /opt/v1.2.13.zip && \
    tar xf /opt/xz-5.4.3.tar.gz && rm /opt/xz-5.4.3.tar.gz && \
    tar xf /opt/bzip2-1.0.8.tar.gz && rm /opt/bzip2-1.0.8.tar.gz && \
    tar xf /opt/openssl-1.0.2u.tar.gz && rm /opt/openssl-1.0.2u.tar.gz

RUN apt-get update && \
    apt-get install -y locate file

ENV CPPFLAGS "-I/usr/local/include/ -I/opt/zlib-1.2.13 -I/opt/bzip2-1.0.8 -I/opt/openssl-1.0.2u/include -I/opt/openssl-1.0.2u/test"
ENV LDLIBS "-lz -lssl -lcrypto"
ENV LDFLAGS "-L/usr/local/lib"

# compile openSSL to LLVM
WORKDIR /opt/openssl-1.0.2u
RUN cd /opt/openssl-1.0.2u && emmake bash -c "./Configure -no-asm -no-apps no-ssl2 no-ssl3 no-hw no-deprecated shared no-dso linux-generic32" && \
    sed -i 's/CC= $(CROSS_COMPILE)\/emsdk_portable\/emscripten\/tag-1.39.4\/emcc/CC= $(CROSS_COMPILE)cc/' Makefile && \
    sed -i 's/-Bsymbolic/ /' Makefile.shared && \
    emmake make && \
    cd /usr/local/lib && \
    ln -s /opt/openssl-1.0.2u/libssl.a && \
    ln -s /opt/openssl-1.0.2u/libcrypto.a

# compile LZMA to LLVM
WORKDIR /opt/xz-5.4.3
RUN cd /opt/xz-5.4.3 && emconfigure ./configure --disable-assembler --enable-threads=no --enable-static=yes 2>&1 | tee conf.out && \
    emmake make 2>&1 | tee make.out && emmake make install

# compile libarchive to LLVM
WORKDIR /opt/libarchive-3.6.2
RUN cd /opt/libarchive-3.6.2 && emconfigure ./configure --enable-static --disable-shared --enable-bsdtar=static --enable-bsdcat=static \
    --enable-bsdcpio=static --enable-posix-regex-lib=libc \
    --disable-xattr --disable-acl --without-nettle --without-lzo2 \
    --without-cng  --without-lz4 \
    --without-xml2 --without-expat 2>&1 | tee conf.out && \
    emmake make 2>&1 | tee make.out && emmake make install

WORKDIR /workdir

CMD ["bash"]
