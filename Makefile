.PHONY: build build-docker clean create-archives

build: src/libarchive.js

build-docker:
	docker build -t libarchive-wasm-build -f lib/Dockerfile .

clean:
	$(RM) src/libarchive.{js,wasm} lib/build/*

create-archives: archives/deflate.zip archives/deflate-encrypted.zip archives/store.zip archives/a.tar archives/a.tar.bz2 archives/a.tar.gz archives/a.tar.xz archives/bzip2.7z archives/lzma.7z archives/lzma2.7z archives/v4.rar archives/v4-encrypted.rar archives/v5.rar

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

archives/store.zip: archives/example
	cd archives/ && zip -r -Z store store.zip example && cd ..

archives/a.tar: archives/example
	cd archives/ && tar cf a.tar example && cd ..

archives/a.tar.bz2: archives/example
	cd archives/ && tar cjf a.tar.bz2 example && cd ..

archives/a.tar.gz: archives/example
	cd archives/ && tar czf a.tar.gz example && cd ..

archives/a.tar.xz: archives/example
	cd archives/ && tar cJf a.tar.xz example && cd ..

archives/bzip2.7z: archives/example
	cd archives/ && 7z a -m0=BZip2 bzip2.7z example && cd ..

archives/lzma.7z: archives/example
	cd archives/ && 7z a -m0=LZMA lzma.7z example && cd ..

archives/lzma2.7z: archives/example
	cd archives/ && 7z a -m0=LZMA2 lzma2.7z example && cd ..

archives/v4.rar: archives/example
	cd archives/ && rar a -ma4 v4.rar example && cd ..

archives/v4-encrypted.rar: archives/example
	cd archives/ && rar a -ma4 -hp=Passw0rd! v4-encrypted.rar example && cd ..

archives/v5.rar: archives/example
	cd archives/ && rar a -ma5 v5.rar example && cd ..

archives/example:
	rm -rf archives/example
	mkdir -p archives/example/dir
	touch archives/example/README.md
	ln -s ../README.md archives/example/dir/symlink
	curl -o archives/example/dir/image.png https://avatars.githubusercontent.com/u/280562?v=4
	echo "# example\n\n\`\`\`" >> archives/example/README.md
	find archives/example >> archives/example/README.md
	echo "\`\`\`" >> archives/example/README.md
