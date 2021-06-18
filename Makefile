.PHONY: build-docker

build-docker:
	docker build -t libarchive-wasm-build -f lib/Dockerfile .
