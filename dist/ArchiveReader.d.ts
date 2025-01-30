import { ArchiveReaderEntry } from './ArchiveReaderEntry';
import type { LibarchiveWasm } from './libarchiveWasm';
export declare class ArchiveReader {
    libarchive: LibarchiveWasm;
    archive: number;
    pointer: number;
    static FileTypes: {
        [x: string]: string;
    };
    constructor(libarchive: LibarchiveWasm, data: Int8Array, passphrase?: string);
    free(): void;
    hasEncryptedData(): boolean | null;
    readData(size: number): Int8Array;
    skipData(): void;
    nextEntryPointer(): number;
    getEntryFiletype(ptr: number): string;
    getEntryPathname(ptr: number): string;
    getEntrySize(ptr: number): number;
    getCreationTime(ptr: number): number;
    getModificationTime(ptr: number): number;
    isEntryEncrypted(ptr: number): boolean;
    nextEntry(): ArchiveReaderEntry | null;
    forEach(fn: (entry: ArchiveReaderEntry) => unknown): void;
    entries(): Generator<ArchiveReaderEntry, void, unknown>;
}
