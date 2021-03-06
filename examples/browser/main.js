import { libarchiveWasm, ArchiveReader } from 'libarchive-wasm';
import { wrap } from 'minlink/dist/browser';

document.getElementById('upload').addEventListener('change', async (e) => {
  const file = e.currentTarget.files[0];

  await (async () => {
    console.log('Extract (main)');

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
    const results = [];
    for (const entry of reader.entries()) {
      const result = {
        pathname: entry.getPathname(),
        size: entry.getSize(),
      };
      if (result.pathname.endsWith('.md')) {
        result.data = new TextDecoder().decode(entry.readData());
      }
      console.log(result);
      results.push(result);
    }
    reader.free();

    document.getElementById('result-main').textContent = JSON.stringify(results, null, '  ');
  })();

  await (async () => {
    console.log('Extract (worker)');
    const worker = new Worker('./worker.js');
    const api = wrap(worker);
    const results = await api.exec('extractAll', file);
    console.log(results);
    document.getElementById('result-worker').textContent = JSON.stringify(results, null, '  ');
    await api.terminate();
  })();
});
