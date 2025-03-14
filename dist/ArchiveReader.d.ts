import type { LibarchiveWasm } from './libarchiveWasm';
import { ArchiveReaderEntry } from './ArchiveReaderEntry';
export declare class ArchiveReader {
    libarchive: LibarchiveWasm;
    archive: number;
    pointer: number;
    static FileTypes: {
        "61440": string;
        "32768": string;
        "40960": string;
        "49152": string;
        "8192": string;
        "24576": string;
        "16384": string;
        "4096": string;
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
    getEntryAccessTime(ptr: number): number;
    getEntryBirthTime(ptr: number): number;
    getEntryCreationTime(ptr: number): number;
    getEntryModificationTime(ptr: number): number;
    isEntryEncrypted(ptr: number): boolean;
    getSymlinkTarget(ptr: number): string;
    getHardlinkTarget(ptr: number): string;
    nextEntry(): ArchiveReaderEntry | null;
    forEach(fn: (entry: ArchiveReaderEntry) => unknown): void;
    entries(): Generator<ArchiveReaderEntry, void, unknown>;
}
