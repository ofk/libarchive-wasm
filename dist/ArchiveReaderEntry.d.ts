import type { ArchiveReader } from './ArchiveReader';
export declare class ArchiveReaderEntry {
    reader: ArchiveReader;
    pointer: number;
    readCalled: boolean;
    constructor(reader: ArchiveReader, ptr: number);
    free(): void;
    readData(): Int8Array | undefined;
    skipData(): void;
    getFiletype(): string;
    getPathname(): string;
    getSize(): number;
    getCreationTime(): number;
    getModificationTime(): number;
    isEncrypted(): boolean;
    getSymlinkTarget(): string;
    getHardlinkTarget(): string;
}
