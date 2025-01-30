/* eslint-disable no-underscore-dangle */
import { ArchiveReaderEntry } from './ArchiveReaderEntry';
import type { LibarchiveWasm } from './libarchiveWasm';

/**
 * Specifies how many milliseconds make up a second.
 *
 * This constant allows the conversion of the C `time_t` type into JavaScript-friendly `Date` time.
 */
const ONE_SEC_IN_MS = 1000;

export class ArchiveReader {
  public libarchive: LibarchiveWasm;

  public archive: number;

  public pointer: number;

  static FileTypes = {
    [`${0o170000}`]: 'Mount',
    [`${0o100000}`]: 'File',
    [`${0o120000}`]: 'SymbolicLink',
    [`${0o140000}`]: 'Socket',
    [`${0o020000}`]: 'CharacterDevice',
    [`${0o060000}`]: 'BlockDevice',
    [`${0o040000}`]: 'Directory',
    [`${0o010000}`]: 'NamedPipe',
  };

  constructor(libarchive: LibarchiveWasm, data: Int8Array, passphrase?: string) {
    const ptr = libarchive.module._malloc(data.length);
    libarchive.module.HEAP8.set(data, ptr);

    this.libarchive = libarchive;
    this.archive = libarchive.read_new_memory(ptr, data.length, passphrase as string);
    this.pointer = ptr;
  }

  free(): void {
    this.libarchive.read_free(this.archive);
    this.libarchive.module._free(this.pointer);

    this.libarchive = null as unknown as LibarchiveWasm;
    this.archive = null as unknown as number;
    this.pointer = null as unknown as number;
  }

  hasEncryptedData(): boolean | null {
    const code = this.libarchive.read_has_encrypted_entries(this.archive);
    return code < 0 ? null : !!code;
  }

  readData(size: number): Int8Array {
    const eptr = this.libarchive.module._malloc(size);
    const esize = this.libarchive.read_data(this.archive, eptr, size);
    const data = this.libarchive.module.HEAP8.slice(eptr, eptr + esize);
    this.libarchive.module._free(eptr);
    return data;
  }

  skipData(): void {
    this.libarchive.read_data_skip(this.archive);
  }

  nextEntryPointer(): number {
    return this.libarchive.read_next_entry(this.archive);
  }

  getEntryFiletype(ptr: number): string {
    return ArchiveReader.FileTypes[`${this.libarchive.entry_filetype(ptr)}`] || 'Invalid';
  }

  getEntryPathname(ptr: number): string {
    return this.libarchive.entry_pathname(ptr);
  }

  getEntrySize(ptr: number): number {
    return this.libarchive.entry_size(ptr);
  }

  getCreationTime(ptr: number): number {
    return this.libarchive.entry_ctime(ptr) * ONE_SEC_IN_MS; // convert secs to ms
  }

  getModificationTime(ptr: number): number {
    return this.libarchive.entry_mtime(ptr) * ONE_SEC_IN_MS; // convert secs to ms
  }

  isEntryEncrypted(ptr: number): boolean {
    return !!this.libarchive.entry_is_encrypted(ptr);
  }

  getSymlinkTarget(ptr: number): string {
    return this.libarchive.entry_symlink(ptr);
  }

  getHardlinkTarget(ptr: number): string {
    return this.libarchive.entry_hardlink(ptr);
  }

  nextEntry(): ArchiveReaderEntry | null {
    const entryPtr = this.nextEntryPointer();
    if (entryPtr === 0) return null;
    return new ArchiveReaderEntry(this, entryPtr);
  }

  forEach(fn: (entry: ArchiveReaderEntry) => unknown): void {
    for (;;) {
      const entry = this.nextEntry();
      if (!entry) break;
      fn(entry);
      entry.free();
    }
  }

  *entries(): Generator<ArchiveReaderEntry, void, unknown> {
    for (;;) {
      const entry = this.nextEntry();
      if (!entry) break;
      yield entry;
      entry.free();
    }
  }
}
