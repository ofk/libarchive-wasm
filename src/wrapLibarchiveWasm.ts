import type { LibarchiveModule } from './libarchive';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function wrapLibarchiveWasm(module: LibarchiveModule) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const checkReturnValue = <R extends any, F extends (...args: any[]) => R>(
    fn: F,
    test: (r: R) => boolean
  ): F =>
    function f(this: any, ...args: any[]) {
      const r = fn(...args);
      if (test(r)) throw new Error(this.error_string(args[0]));
      return r;
    } as unknown as F;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const nonzero = (r: number): boolean => r !== 0;

  return {
    module,
    version_number: module.cwrap('archive_version_number', 'number', []),
    version_string: module.cwrap('archive_version_string', 'string', []),
    version_details: module.cwrap('archive_version_details', 'string', []),
    read_new_memory: checkReturnValue(
      module.cwrap<number, [number, number, string?]>('archive_read_new_memory', 'number', [
        'number',
        'number',
        'string',
      ] as const),
      (r: number) => r === 0
    ),
    read_new: module.cwrap('archive_read_new', 'number', []),
    read_support_filter_all: checkReturnValue(
      module.cwrap('archive_read_support_filter_all', 'number', ['number'] as const),
      nonzero
    ),
    read_support_format_all: checkReturnValue(
      module.cwrap('archive_read_support_format_all', 'number', ['number'] as const),
      nonzero
    ),
    read_open_memory: checkReturnValue(
      module.cwrap('archive_read_open_memory', 'number', ['number', 'number', 'number'] as const),
      nonzero
    ),
    read_next_entry: module.cwrap('archive_read_next_entry', 'number', ['number'] as const),
    read_has_encrypted_entries: module.cwrap('archive_read_has_encrypted_entries', 'number', [
      'number',
    ] as const),
    read_data: checkReturnValue(
      module.cwrap('archive_read_data', 'number', ['number', 'number', 'number'] as const),
      (r: number) => r < 0
    ),
    read_data_skip: checkReturnValue(
      module.cwrap('archive_read_data_skip', 'number', ['number'] as const),
      nonzero
    ),
    read_add_passphrase: checkReturnValue(
      module.cwrap('archive_read_add_passphrase', 'number', ['number', 'string'] as const),
      nonzero
    ),
    read_free: checkReturnValue(
      module.cwrap('archive_read_free', 'number', ['number'] as const),
      nonzero
    ),
    error_string: module.cwrap('archive_error_string', 'string', ['number'] as const),
    entry_filetype: module.cwrap('archive_entry_filetype', 'number', ['number'] as const),
    entry_pathname: module.cwrap('archive_entry_pathname_utf8', 'string', ['number'] as const),
    entry_size: module.cwrap('archive_entry_size', 'number', ['number'] as const),
    entry_is_encrypted: module.cwrap('archive_entry_is_encrypted', 'number', ['number'] as const),
  };
}
