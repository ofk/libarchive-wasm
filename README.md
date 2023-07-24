# libarchive-wasm

[![Build Status](https://github.com/ofk/libarchive-wasm/actions/workflows/ci.yml/badge.svg)](https://github.com/ofk/libarchive-wasm/actions)
[![npm version](https://badge.fury.io/js/libarchive-wasm.svg)](http://badge.fury.io/js/libarchive-wasm)
[![npm downloads](https://img.shields.io/npm/dm/libarchive-wasm.svg?style=flat-square)](https://www.npmjs.com/package/libarchive-wasm)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)

libarchive-wasm is a JavaScript library for reading various archive and compression formats.
It's port of [libarchive](https://github.com/libarchive/libarchive) to WebAssembly and JavaScript wrapper to make it easier to use, since it runs performance should be near native.

This project was inspired by [libarchive.js](https://github.com/nika-begiashvili/libarchivejs).
libarchive-wasm only has a low level API for simpler Int8Array input and output.
You can implement for different file objects and WebWorkers etc. in the browser and NodeJS as needed.

## Feature

- Supported formats: ZIP, 7-Zip, RAR v4, RAR v5, TAR
- Supported compression: GZIP, DEFLATE, BZIP2, LZMA
- Built with emscripten with support for `WebAssembly.instantiateStreaming` (Support NodeJS v18+)

## Usage

```sh
npm i libarchive-wasm
```

### Node

```js
import { readFile } from 'node:fs/promises';
import { ArchiveReader, libarchiveWasm } from 'libarchive-wasm';

(async () => {
  const data = await readFile('example.zip');
  const mod = await libarchiveWasm();
  const reader = new ArchiveReader(mod, new Int8Array(data));
  for (const entry of reader.entries()) {
    const result = {
      pathname: entry.getPathname(),
      size: entry.getSize(),
    };
    if (result.pathname.endsWith('.md')) {
      result.data = new TextDecoder().decode(entry.readData());
    }
    console.log(result);
  }
  reader.free();
})();
```

### Browser

```js
import { ArchiveReader, libarchiveWasm } from 'libarchive-wasm';

document.getElementById('upload').addEventListener('change', async (e) => {
  const file = e.currentTarget.files[0];
  const data = await file.arrayBuffer();
  const mod = await libarchiveWasm();
  const reader = new ArchiveReader(mod, new Int8Array(data));
  for (const entry of reader.entries()) {
    const result = {
      pathname: entry.getPathname(),
      size: entry.getSize(),
    };
    if (result.pathname.endsWith('.md')) {
      result.data = new TextDecoder().decode(entry.readData());
    }
    console.log(result);
  }
  reader.free();
});
```

### Node Worker by Minlink

- [worker](examples/node/worker.mjs)
- [main](examples/node/main.mjs)

### Browser Worker by Minlink

- [worker](examples/browser/worker.js)
- [main](examples/browser/main.js)
