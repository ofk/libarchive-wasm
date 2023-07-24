import { parentPort } from 'node:worker_threads';

import { ArchiveReader, libarchiveWasm } from 'libarchive-wasm';
import { expose } from 'minlink/dist/node.mjs';

expose(parentPort, {
  async extractAll(data) {
    const mod = await libarchiveWasm();
    const reader = new ArchiveReader(mod, new Int8Array(data));
    const entries = [];
    for (const entry of reader.entries()) {
      const result = {
        pathname: entry.getPathname(),
        size: entry.getSize(),
      };
      if (result.pathname.endsWith('.md')) {
        result.data = new TextDecoder().decode(entry.readData());
      }
      entries.push(result);
    }
    reader.free();

    return entries;
  },
});
