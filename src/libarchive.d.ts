/* eslint-disable import/no-default-export */

// cf. https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/emscripten/index.d.ts

type JSTypes = {
  number: number;
  string: string;
};

type JSTypeStrings = keyof JSTypes;

type ToJSType<S> = S extends null ? null : S extends JSTypeStrings ? JSTypes[S] : unknown;

type ToJSTypeArray<SA> = SA extends readonly [infer S, ...infer R]
  ? readonly [ToJSType<S>, ...ToJSTypeArray<R>]
  : readonly [];

export interface LibarchiveModule {
  cwrap: <
    RT extends ToJSType<RS>,
    TA = undefined,
    RS extends JSTypeStrings = JSTypeStrings,
    SA extends readonly JSTypeStrings[] = readonly JSTypeStrings[],
  >(
    ident: string,
    returnType: RS,
    argTypes: SA,
  ) => (...args: TA extends unknown[] ? TA : ToJSTypeArray<SA>) => RT;

  HEAP8: Int8Array;

  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
}

declare function libarchive(options?: {
  locateFile?: (path: string, prefix: string) => string;
}): Promise<LibarchiveModule>;

export default libarchive;
