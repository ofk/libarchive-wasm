#!/bin/bash

emcc ./libarchive.c -I /usr/local/include/ -o /tmp/libarchive.o
emcc /tmp/libarchive.o /usr/local/lib/libarchive.a /usr/local/lib/liblzma.a /usr/local/lib/libssl.a /usr/local/lib/libcrypto.a \
	-o ./build/libarchive.js \
	-s USE_ZLIB=1 -s USE_BZIP2=1 -s MODULARIZE=1 -s EXPORT_NAME=libarchive -s WASM=1 -O3 -s ALLOW_MEMORY_GROWTH=1 \
	-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s EXPORTED_FUNCTIONS=@./exported_functions.json \
	-s ERROR_ON_UNDEFINED_SYMBOLS=0
