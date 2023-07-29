import type { ArchiveReader } from './ArchiveReader';

const SECS_IN_MS = 1000;

export class ArchiveReaderEntry {
  public reader: ArchiveReader;

  public pointer: number;

  public readCalled: boolean;

  constructor(reader: ArchiveReader, ptr: number) {
    this.reader = reader;
    this.pointer = ptr;
    this.readCalled = false;
  }

  free(): void {
    this.skipData();
    this.reader = null as unknown as ArchiveReader;
    this.pointer = null as unknown as number;
  }

  readData(): Int8Array | undefined {
    if (this.readCalled) throw new Error('It has already been called.');

    const size = this.getSize();
    if (!size) {
      this.skipData();
      return undefined;
    }

    this.readCalled = true;
    return this.reader.readData(size);
  }

  skipData(): void {
    if (this.readCalled) return;
    this.readCalled = true;
    this.reader.skipData();
  }

  getFiletype(): string {
    return this.reader.getEntryFiletype(this.pointer);
  }

  getPathname(): string {
    return this.reader.getEntryPathname(this.pointer);
  }

  getSize(): number {
    return this.reader.getEntrySize(this.pointer);
  }

  getCreationTime(): number {
    return this.reader.getCreationTime(this.pointer) * SECS_IN_MS;
  }

  getModificationTime(): number {
    return this.reader.getModificationTime(this.pointer) * SECS_IN_MS;
  }

  isEncrypted(): boolean {
    return this.reader.isEntryEncrypted(this.pointer);
  }
}
