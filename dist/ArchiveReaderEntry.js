"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveReaderEntry = void 0;
var ArchiveReaderEntry = /** @class */ (function () {
    function ArchiveReaderEntry(reader, ptr) {
        this.reader = reader;
        this.pointer = ptr;
        this.readCalled = false;
    }
    ArchiveReaderEntry.prototype.free = function () {
        this.skipData();
        this.reader = null;
        this.pointer = null;
    };
    ArchiveReaderEntry.prototype.readData = function () {
        if (this.readCalled)
            throw new Error('It has already been called.');
        var size = this.getSize();
        if (!size) {
            this.skipData();
            return undefined;
        }
        this.readCalled = true;
        return this.reader.readData(size);
    };
    ArchiveReaderEntry.prototype.skipData = function () {
        if (this.readCalled)
            return;
        this.readCalled = true;
        this.reader.skipData();
    };
    ArchiveReaderEntry.prototype.getFiletype = function () {
        return this.reader.getEntryFiletype(this.pointer);
    };
    ArchiveReaderEntry.prototype.getPathname = function () {
        return this.reader.getEntryPathname(this.pointer);
    };
    ArchiveReaderEntry.prototype.getSize = function () {
        return this.reader.getEntrySize(this.pointer);
    };
    ArchiveReaderEntry.prototype.getCreationTime = function () {
        return this.reader.getCreationTime(this.pointer);
    };
    ArchiveReaderEntry.prototype.getModificationTime = function () {
        return this.reader.getModificationTime(this.pointer);
    };
    ArchiveReaderEntry.prototype.isEncrypted = function () {
        return this.reader.isEntryEncrypted(this.pointer);
    };
    ArchiveReaderEntry.prototype.getSymlinkTarget = function () {
        return this.reader.getSymlinkTarget(this.pointer);
    };
    ArchiveReaderEntry.prototype.getHardlinkTarget = function () {
        return this.reader.getHardlinkTarget(this.pointer);
    };
    return ArchiveReaderEntry;
}());
exports.ArchiveReaderEntry = ArchiveReaderEntry;
