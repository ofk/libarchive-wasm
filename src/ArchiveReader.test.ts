import { readFile } from 'fs/promises';

import { libarchiveWasm } from './libarchiveWasm';
import { ArchiveReader } from './ArchiveReader';

const toEntries = (a: ArchiveReader): Record<string, unknown>[] => {
  const entries = [] as Record<string, unknown>[];
  for (;;) {
    const entryPointer = a.nextEntryPointer();
    if (entryPointer === 0) break;
    const pathname = a.getEntryPathname(entryPointer);
    const size = a.getEntrySize(entryPointer);
    const data = /\.md/.test(pathname) ? a.readData(size) : a.skipData();
    entries.push({
      filetype: a.getEntryFiletype(entryPointer),
      pathname,
      size,
      data: new TextDecoder().decode(data || undefined),
      encrypted: a.isEntryEncrypted(entryPointer),
    });
  }
  return entries;
};

describe('ArchiveReader', () => {
  it('test.zip', async () => {
    const data = await readFile('./archives/example.zip');
    const mod = await libarchiveWasm();
    const a = new ArchiveReader(mod, new Int8Array(data));
    expect(a.hasEncryptedData()).toBe(null);
    const entries = toEntries(a);
    expect(entries).toMatchSnapshot();
    expect(a.hasEncryptedData()).toBe(false);
    a.free();
  });

  it('encrypted.zip', async () => {
    const data = await readFile('./archives/encrypted.zip');
    const mod = await libarchiveWasm();
    const a = new ArchiveReader(mod, new Int8Array(data), 'Passw0rd!');
    expect(a.hasEncryptedData()).toBe(null);
    const entries = toEntries(a);
    expect(entries).toMatchSnapshot();
    expect(a.hasEncryptedData()).toBe(true);
    a.free();
  });
});
