.PHONY: build build-docker clean

build: src/libarchive.js

build-docker:
	docker build -t libarchive-wasm-build -f lib/Dockerfile .

clean:
	$(RM) src/libarchive.{js,wasm} lib/build/*

src/libarchive.js: lib/build/libarchive.js
	cp lib/build/libarchive.* src

lib/build/libarchive.js:
	docker run -it -v $(PWD)/lib:/workdir libarchive-wasm-build ./build.bash
