.PHONY: build build-docker clean create-archives

build: src/libarchive.js

build-docker:
	docker build -t libarchive-wasm-build -f lib/Dockerfile .

clean:
	$(RM) src/libarchive.{js,wasm} lib/build/*

create-archives: archives/deflate.zip archives/deflate-encrypted.zip

clean-archives:
	$(RM) -r archives/*

src/libarchive.js: lib/build/libarchive.js
	cp lib/build/libarchive.* src

lib/build/libarchive.js:
	docker run -it -v $(PWD)/lib:/workdir libarchive-wasm-build ./build.bash

archives/deflate.zip: archives/example
	cd archives/ && zip -r -Z deflate deflate.zip example && cd ..

archives/deflate-encrypted.zip: archives/example
	cd archives/ && zip -e -Z deflate --password=Passw0rd! -r deflate-encrypted.zip example && cd ..

archives/example:
	rm -rf archives/example
	mkdir -p archives/example/dir
	touch archives/example/README.md
	ln -s ../README.md archives/example/dir/symlink
	curl -o archives/example/dir/image.png https://avatars.githubusercontent.com/u/280562?v=4
	echo "# example\n\n\`\`\`" >> archives/example/README.md
	find archives/example >> archives/example/README.md
	echo "\`\`\`" >> archives/example/README.md
