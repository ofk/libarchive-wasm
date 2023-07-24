import { ArchiveReader, libarchiveWasm } from 'libarchive-wasm';
import { wrap } from 'minlink/dist/browser';

document.getElementById('upload').addEventListener('change', async (e) => {
  const file = e.currentTarget.files[0];

  await (async () => {
    console.log('Extract (main)');
    const data = await file.arrayBuffer();
    const mod = await libarchiveWasm({
      locateFile() {
        return new URL('npm:libarchive-wasm/dist/libarchive.wasm', import.meta.url).toString();
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
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    const api = wrap(worker);
    const results = await api.exec('extractAll', file);
    console.log(results);
    await api.terminate();
    document.getElementById('result-worker').textContent = JSON.stringify(results, null, '  ');
  })();
});
