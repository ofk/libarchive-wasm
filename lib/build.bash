#!/bin/bash

emcc ./libarchive.c \
	-I /usr/local/include /usr/local/lib/libarchive.a \
	/usr/local/lib/libz.a /usr/local/lib/libbz2.a /usr/local/lib/liblzma.a /usr/local/lib/libssl.a /usr/local/lib/libcrypto.a \
	-o ./build/libarchive.js \
	-s MODULARIZE=1 -s EXPORT_NAME=libarchive -s WASM=1 -s WASM_BIGINT=0 -O3 -s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_RUNTIME_METHODS='["cwrap"]' -s EXPORTED_FUNCTIONS=@./exported_functions.json \
	-s ERROR_ON_UNDEFINED_SYMBOLS=0
