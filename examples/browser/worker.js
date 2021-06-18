import { expose } from 'minlink/dist/browser';
import { libarchiveWasm, ArchiveReader } from 'libarchive-wasm';

// eslint-disable-next-line no-restricted-globals
expose(self, {
  async extractAll(file) {
    const data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(file);
    });
    const mod = await libarchiveWasm({
      locateFile() {
        // eslint-disable-next-line global-require, import/no-unresolved
        return require('url:libarchive-wasm/dist/libarchive.wasm');
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
