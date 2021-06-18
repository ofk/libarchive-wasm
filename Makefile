.PHONY: build build-docker clean create-archives

build: src/libarchive.js

build-docker:
	docker build -t libarchive-wasm-build -f lib/Dockerfile .

clean:
	$(RM) src/libarchive.{js,wasm} lib/build/*

create-archives: archives/example.zip archives/encrypted.zip

src/libarchive.js: lib/build/libarchive.js
	cp lib/build/libarchive.* src

lib/build/libarchive.js:
	docker run -it -v $(PWD)/lib:/workdir libarchive-wasm-build ./build.bash

archives/example.zip: archives/archive
	cd archives/ && zip -r example.zip archive && cd ..

archives/encrypted.zip: archives/archive
	cd archives/ && zip -e --password=Passw0rd! -r encrypted.zip archive && cd ..

archives/archive:
	rm -rf archives/archive
	mkdir -p archives/archive/dir
	touch archives/archive/README.md
	ln -s ../README.md archives/archive/dir/symlink
	curl -o archives/archive/dir/image.png https://avatars.githubusercontent.com/u/280562?v=4
	echo "# archive\n\n\`\`\`" >> archives/archive/README.md
	find archives/archive >> archives/archive/README.md
	echo "\`\`\`" >> archives/archive/README.md
