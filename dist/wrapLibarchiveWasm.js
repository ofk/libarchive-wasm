"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapLibarchiveWasm = void 0;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function wrapLibarchiveWasm(module) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    var checkReturnValue = function (fn, test) {
        return function f() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var r = fn.apply(void 0, args);
            if (test(r))
                throw new Error(this.error_string(args[0]));
            return r;
        };
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */
    var nonzero = function (r) { return r !== 0; };
    return {
        module: module,
        version_number: module.cwrap('archive_version_number', 'number', []),
        version_string: module.cwrap('archive_version_string', 'string', []),
        version_details: module.cwrap('archive_version_details', 'string', []),
        read_new_memory: checkReturnValue(module.cwrap('archive_read_new_memory', 'number', [
            'number',
            'number',
            'string',
        ]), function (r) { return r === 0; }),
        read_new: module.cwrap('archive_read_new', 'number', []),
        read_support_filter_all: checkReturnValue(module.cwrap('archive_read_support_filter_all', 'number', ['number']), nonzero),
        read_support_format_all: checkReturnValue(module.cwrap('archive_read_support_format_all', 'number', ['number']), nonzero),
        read_open_memory: checkReturnValue(module.cwrap('archive_read_open_memory', 'number', ['number', 'number', 'number']), nonzero),
        read_next_entry: module.cwrap('archive_read_next_entry', 'number', ['number']),
        read_has_encrypted_entries: module.cwrap('archive_read_has_encrypted_entries', 'number', [
            'number',
        ]),
        read_data: checkReturnValue(module.cwrap('archive_read_data', 'number', ['number', 'number', 'number']), function (r) { return r < 0; }),
        read_data_skip: checkReturnValue(module.cwrap('archive_read_data_skip', 'number', ['number']), nonzero),
        read_add_passphrase: checkReturnValue(module.cwrap('archive_read_add_passphrase', 'number', ['number', 'string']), nonzero),
        read_free: checkReturnValue(module.cwrap('archive_read_free', 'number', ['number']), nonzero),
        error_string: module.cwrap('archive_error_string', 'string', ['number']),
        entry_filetype: module.cwrap('archive_entry_filetype', 'number', ['number']),
        entry_pathname: module.cwrap('archive_entry_pathname_utf8', 'string', ['number']),
        entry_symlink: module.cwrap('archive_entry_symlink_utf8', 'string', ['number']),
        entry_hardlink: module.cwrap('archive_entry_hardlink_utf8', 'string', ['number']),
        entry_size: module.cwrap('archive_entry_size', 'number', ['number']),
        entry_ctime: module.cwrap('archive_entry_ctime', 'number', ['number']),
        entry_mtime: module.cwrap('archive_entry_mtime', 'number', ['number']),
        entry_is_encrypted: module.cwrap('archive_entry_is_encrypted', 'number', ['number']),
    };
}
exports.wrapLibarchiveWasm = wrapLibarchiveWasm;
