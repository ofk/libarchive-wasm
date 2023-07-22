import { readFile } from 'fs/promises';
import { libarchiveWasm, ArchiveReader } from 'libarchive-wasm';
import { Worker } from 'worker_threads';
import { wrap } from 'minlink/dist/node.mjs';

(async () => {
  const data = await readFile('../../archives/deflate.zip');

  await (async () => {
    console.log('Extract (main)');
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

  await (async () => {
    console.log('Extract (worker)');
    const worker = new Worker('./worker.mjs');
    const api = wrap(worker);
    const results = await api.exec('extractAll', data);
    console.log(results);
    await api.terminate();
  })();
})();
