import { readFile } from 'fs/promises';

import { ArchiveReader } from './ArchiveReader';
import { libarchiveWasm } from './libarchiveWasm';

describe('ArchiveReaderEntry', () => {
  test('verification that time of creation or modification is plausible', async () => {
    const data = await readFile('./archives/deflate.zip');
    const mod = await libarchiveWasm();
    const a = new ArchiveReader(mod, new Int8Array(data));
    const entries = [] as Record<string, unknown>[];
    a.forEach((entry) => {
      const mtime = entry.getModificationTime();
      const ctime = entry.getCreationTime();

      expect(mtime > ctime).toBeTruthy();
      expect(mtime).toBeGreaterThan(new Date('2020-01-01').getTime());
    });
    expect(entries).toMatchSnapshot();
    a.free();
  });
});
