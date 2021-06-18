# libarchive-wasm

A WASM version of libarchive API. Inspired by [libarchive.js](https://github.com/nika-begiashvili/libarchivejs).

libarchive-wasm has only a low level API for Int8Array input and optput.

```sh
npm i libarchive-wasm
```

## Requirements

- Node
- Modern Browser

## Node

```js
import { readFile } from 'fs/promises';
import { libarchiveWasm, ArchiveReader } from 'libarchive-wasm';

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

## Browser

```js
import { libarchiveWasm, ArchiveReader } from 'libarchive-wasm';

document.getElementById('upload').addEventListener('change', async (e) => {
  const file = e.currentTarget.files[0];
  const data = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsArrayBuffer(file);
  });
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

## Node Worker by Minlink

- [worker](examples/node/worker.mjs)
- [main](examples/node/main.mjs)

## Browser Worker by Minlink

- [worker](examples/browser/worker.js)
- [main](examples/browser/main.js)
