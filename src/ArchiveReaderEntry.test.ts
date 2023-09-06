import { readFile } from 'fs/promises';

import { ArchiveReader } from './ArchiveReader';
import { libarchiveWasm } from './libarchiveWasm';

function verifyArchiveEntries(a: ArchiveReader): void {
  const entries: Record<string, unknown>[] = [];
  a.forEach((entry) => {
    const pathname = entry.getPathname();
    const size = entry.getSize();
    const data = /\.md/.test(pathname) ? entry.readData() : entry.skipData();
    entries.push({
      filetype: entry.getFiletype(),
      pathname,
      size,
      data: new TextDecoder().decode(data || undefined),
      encrypted: entry.isEncrypted(),
    });

    const ctime = entry.getCreationTime();
    const mtime = entry.getModificationTime();
    expect(ctime).toBe(0);
    expect(mtime).toBeGreaterThan(new Date('2020-01-01').getTime());
  });
  expect(entries).toMatchSnapshot();
}

describe('ArchiveReaderEntry', () => {
  test('verification all methods', async () => {
    const data = await readFile('./archives/deflate.zip');
    const mod = await libarchiveWasm();
    const a = new ArchiveReader(mod, new Int8Array(data));
    verifyArchiveEntries(a);
    a.free();
  });
});
