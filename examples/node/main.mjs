import { readFile } from 'fs/promises';
import { libarchiveWasm, ArchiveReader } from 'libarchive-wasm';

(async () => {
  const data = await readFile('../../archives/example.zip');

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
})();
