"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveReader = void 0;
/* eslint-disable no-underscore-dangle */
var ArchiveReaderEntry_1 = require("./ArchiveReaderEntry");
/**
 * Specifies how many milliseconds make up a second.
 *
 * This constant allows the conversion of the C `time_t` type into JavaScript-friendly `Date` time.
 */
var ONE_SEC_IN_MS = 1000;
var ArchiveReader = /** @class */ (function () {
    function ArchiveReader(libarchive, data, passphrase) {
        var ptr = libarchive.module._malloc(data.length);
        libarchive.module.HEAP8.set(data, ptr);
        this.libarchive = libarchive;
        this.archive = libarchive.read_new_memory(ptr, data.length, passphrase);
        this.pointer = ptr;
    }
    ArchiveReader.prototype.free = function () {
        this.libarchive.read_free(this.archive);
        this.libarchive.module._free(this.pointer);
        this.libarchive = null;
        this.archive = null;
        this.pointer = null;
    };
    ArchiveReader.prototype.hasEncryptedData = function () {
        var code = this.libarchive.read_has_encrypted_entries(this.archive);
        return code < 0 ? null : !!code;
    };
    ArchiveReader.prototype.readData = function (size) {
        var eptr = this.libarchive.module._malloc(size);
        var esize = this.libarchive.read_data(this.archive, eptr, size);
        var data = this.libarchive.module.HEAP8.slice(eptr, eptr + esize);
        this.libarchive.module._free(eptr);
        return data;
    };
    ArchiveReader.prototype.skipData = function () {
        this.libarchive.read_data_skip(this.archive);
    };
    ArchiveReader.prototype.nextEntryPointer = function () {
        return this.libarchive.read_next_entry(this.archive);
    };
    ArchiveReader.prototype.getEntryFiletype = function (ptr) {
        return ArchiveReader.FileTypes["".concat(this.libarchive.entry_filetype(ptr))] || 'Invalid';
    };
    ArchiveReader.prototype.getEntryPathname = function (ptr) {
        return this.libarchive.entry_pathname(ptr);
    };
    ArchiveReader.prototype.getEntrySize = function (ptr) {
        return this.libarchive.entry_size(ptr);
    };
    ArchiveReader.prototype.getCreationTime = function (ptr) {
        return this.libarchive.entry_ctime(ptr) * ONE_SEC_IN_MS; // convert secs to ms
    };
    ArchiveReader.prototype.getModificationTime = function (ptr) {
        return this.libarchive.entry_mtime(ptr) * ONE_SEC_IN_MS; // convert secs to ms
    };
    ArchiveReader.prototype.isEntryEncrypted = function (ptr) {
        return !!this.libarchive.entry_is_encrypted(ptr);
    };
    ArchiveReader.prototype.getSymlinkTarget = function (ptr) {
        return this.libarchive.entry_symlink(ptr);
    };
    ArchiveReader.prototype.getHardlinkTarget = function (ptr) {
        return this.libarchive.entry_hardlink(ptr);
    };
    ArchiveReader.prototype.nextEntry = function () {
        var entryPtr = this.nextEntryPointer();
        if (entryPtr === 0)
            return null;
        return new ArchiveReaderEntry_1.ArchiveReaderEntry(this, entryPtr);
    };
    ArchiveReader.prototype.forEach = function (fn) {
        for (;;) {
            var entry = this.nextEntry();
            if (!entry)
                break;
            fn(entry);
            entry.free();
        }
    };
    ArchiveReader.prototype.entries = function () {
        var entry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    entry = this.nextEntry();
                    if (!entry)
                        return [3 /*break*/, 3];
                    return [4 /*yield*/, entry];
                case 1:
                    _a.sent();
                    entry.free();
                    _a.label = 2;
                case 2: return [3 /*break*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    };
    ArchiveReader.FileTypes = (_a = {},
        _a["".concat(61440)] = 'Mount',
        _a["".concat(32768)] = 'File',
        _a["".concat(40960)] = 'SymbolicLink',
        _a["".concat(49152)] = 'Socket',
        _a["".concat(8192)] = 'CharacterDevice',
        _a["".concat(24576)] = 'BlockDevice',
        _a["".concat(16384)] = 'Directory',
        _a["".concat(4096)] = 'NamedPipe',
        _a);
    return ArchiveReader;
}());
exports.ArchiveReader = ArchiveReader;
