import libarchive from './libarchive';
import { wrapLibarchiveWasm } from './wrapLibarchiveWasm';

export type LibarchiveWasm = ReturnType<typeof wrapLibarchiveWasm>;

export function libarchiveWasm(...args: Parameters<typeof libarchive>): Promise<LibarchiveWasm> {
  return new Promise((resolve) => {
    libarchive(...args).then((mod) => {
      resolve(wrapLibarchiveWasm(mod));
    });
  });
}
