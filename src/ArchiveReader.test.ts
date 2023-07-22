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

const testExtract = (name: string, passphrase?: string): void => {
  test(name, async () => {
    const data = await readFile(`./archives/${name}`);
    const mod = await libarchiveWasm();
    const a = new ArchiveReader(mod, new Int8Array(data), passphrase);
    expect(a.hasEncryptedData()).toBe(null);
    const entries = toEntries(a);
    expect(entries).toMatchSnapshot();
    expect(!!a.hasEncryptedData()).toBe(passphrase != null);
    a.free();
  });
};

describe('ArchiveReader', () => {
  test('deflate.zip (forEach)', async () => {
    const data = await readFile('./archives/deflate.zip');
    const mod = await libarchiveWasm();
    const a = new ArchiveReader(mod, new Int8Array(data));
    const entries = [] as Record<string, unknown>[];
    a.forEach((entry) => {
      const pathname = entry.getPathname();
      const entryData = /\.md/.test(pathname) ? entry.readData() : undefined;
      entries.push({
        filetype: entry.getFiletype(),
        pathname,
        size: entry.getSize(),
        data: new TextDecoder().decode(entryData || undefined),
        encrypted: entry.isEncrypted(),
      });
    });
    expect(entries).toMatchSnapshot();
    a.free();
  });

  testExtract('deflate.zip');
  testExtract('deflate-encrypted.zip', 'Passw0rd!');
  testExtract('store.zip');

  testExtract('a.tar');
  testExtract('a.tar.bz2');
  testExtract('a.tar.gz');
  testExtract('a.tar.xz');

  testExtract('bzip2.7z');
  testExtract('lzma.7z');
  testExtract('lzma2.7z');

  testExtract('v4.rar');
  testExtract('v4-encrypted.rar', 'Passw0rd!');
  testExtract('v5.rar');
});
