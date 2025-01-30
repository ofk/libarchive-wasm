import libarchive from './libarchive';
import { wrapLibarchiveWasm } from './wrapLibarchiveWasm';
export declare type LibarchiveWasm = ReturnType<typeof wrapLibarchiveWasm>;
export declare function libarchiveWasm(...args: Parameters<typeof libarchive>): Promise<LibarchiveWasm>;
