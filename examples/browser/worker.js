import { ArchiveReader, libarchiveWasm } from 'libarchive-wasm';
import { expose } from 'minlink/dist/browser';

// eslint-disable-next-line no-restricted-globals
expose(self, {
  async extractAll(file) {
    const data = await file.arrayBuffer();
    const mod = await libarchiveWasm({
      locateFile() {
        return new URL('npm:libarchive-wasm/dist/libarchive.wasm', import.meta.url).toString();
      },
    });
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
