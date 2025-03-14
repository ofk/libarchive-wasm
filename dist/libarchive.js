"use strict";
var libarchive = (function () {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined')
        _scriptDir = _scriptDir || __filename;
    return (function (moduleArg) {
        if (moduleArg === void 0) { moduleArg = {}; }
        var Module = moduleArg;
        var readyPromiseResolve, readyPromiseReject;
        Module["ready"] = new Promise((function (resolve, reject) { readyPromiseResolve = resolve; readyPromiseReject = reject; }));
        var moduleOverrides = Object.assign({}, Module);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = function (status, toThrow) { throw toThrow; };
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        var scriptDirectory = "";
        function locateFile(path) { if (Module["locateFile"]) {
            return Module["locateFile"](path, scriptDirectory);
        } return scriptDirectory + path; }
        var read_, readAsync, readBinary, setWindowTitle;
        if (ENVIRONMENT_IS_NODE) {
            var fs = require("fs");
            var nodePath = require("path");
            if (ENVIRONMENT_IS_WORKER) {
                scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
            }
            else {
                scriptDirectory = __dirname + "/";
            }
            read_ = function (filename, binary) { filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename); return fs.readFileSync(filename, binary ? undefined : "utf8"); };
            readBinary = function (filename) { var ret = read_(filename, true); if (!ret.buffer) {
                ret = new Uint8Array(ret);
            } return ret; };
            readAsync = function (filename, onload, onerror, binary) {
                if (binary === void 0) { binary = true; }
                filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
                fs.readFile(filename, binary ? undefined : "utf8", (function (err, data) { if (err)
                    onerror(err);
                else
                    onload(binary ? data.buffer : data); }));
            };
            if (!Module["thisProgram"] && process.argv.length > 1) {
                thisProgram = process.argv[1].replace(/\\/g, "/");
            }
            arguments_ = process.argv.slice(2);
            quit_ = function (status, toThrow) { process.exitCode = status; throw toThrow; };
            Module["inspect"] = function () { return "[Emscripten Module object]"; };
        }
        else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            if (ENVIRONMENT_IS_WORKER) {
                scriptDirectory = self.location.href;
            }
            else if (typeof document != "undefined" && document.currentScript) {
                scriptDirectory = document.currentScript.src;
            }
            if (_scriptDir) {
                scriptDirectory = _scriptDir;
            }
            if (scriptDirectory.indexOf("blob:") !== 0) {
                scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
            }
            else {
                scriptDirectory = "";
            }
            {
                read_ = function (url) { var xhr = new XMLHttpRequest; xhr.open("GET", url, false); xhr.send(null); return xhr.responseText; };
                if (ENVIRONMENT_IS_WORKER) {
                    readBinary = function (url) { var xhr = new XMLHttpRequest; xhr.open("GET", url, false); xhr.responseType = "arraybuffer"; xhr.send(null); return new Uint8Array(xhr.response); };
                }
                readAsync = function (url, onload, onerror) { var xhr = new XMLHttpRequest; xhr.open("GET", url, true); xhr.responseType = "arraybuffer"; xhr.onload = function () { if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                    onload(xhr.response);
                    return;
                } onerror(); }; xhr.onerror = onerror; xhr.send(null); };
            }
            setWindowTitle = function (title) { return document.title = title; };
        }
        else { }
        var out = Module["print"] || console.log.bind(console);
        var err = Module["printErr"] || console.error.bind(console);
        Object.assign(Module, moduleOverrides);
        moduleOverrides = null;
        if (Module["arguments"])
            arguments_ = Module["arguments"];
        if (Module["thisProgram"])
            thisProgram = Module["thisProgram"];
        if (Module["quit"])
            quit_ = Module["quit"];
        var wasmBinary;
        if (Module["wasmBinary"])
            wasmBinary = Module["wasmBinary"];
        var noExitRuntime = Module["noExitRuntime"] || true;
        if (typeof WebAssembly != "object") {
            abort("no native wasm support detected");
        }
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        function assert(condition, text) { if (!condition) {
            abort(text);
        } }
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        function updateMemoryViews() { var b = wasmMemory.buffer; Module["HEAP8"] = HEAP8 = new Int8Array(b); Module["HEAP16"] = HEAP16 = new Int16Array(b); Module["HEAP32"] = HEAP32 = new Int32Array(b); Module["HEAPU8"] = HEAPU8 = new Uint8Array(b); Module["HEAPU16"] = HEAPU16 = new Uint16Array(b); Module["HEAPU32"] = HEAPU32 = new Uint32Array(b); Module["HEAPF32"] = HEAPF32 = new Float32Array(b); Module["HEAPF64"] = HEAPF64 = new Float64Array(b); }
        var wasmTable;
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        var runtimeKeepaliveCounter = 0;
        function keepRuntimeAlive() { return noExitRuntime || runtimeKeepaliveCounter > 0; }
        function preRun() { if (Module["preRun"]) {
            if (typeof Module["preRun"] == "function")
                Module["preRun"] = [Module["preRun"]];
            while (Module["preRun"].length) {
                addOnPreRun(Module["preRun"].shift());
            }
        } callRuntimeCallbacks(__ATPRERUN__); }
        function initRuntime() { runtimeInitialized = true; if (!Module["noFSInit"] && !FS.init.initialized)
            FS.init(); FS.ignorePermissions = false; TTY.init(); PIPEFS.root = FS.mount(PIPEFS, {}, null); callRuntimeCallbacks(__ATINIT__); }
        function postRun() { if (Module["postRun"]) {
            if (typeof Module["postRun"] == "function")
                Module["postRun"] = [Module["postRun"]];
            while (Module["postRun"].length) {
                addOnPostRun(Module["postRun"].shift());
            }
        } callRuntimeCallbacks(__ATPOSTRUN__); }
        function addOnPreRun(cb) { __ATPRERUN__.unshift(cb); }
        function addOnInit(cb) { __ATINIT__.unshift(cb); }
        function addOnPostRun(cb) { __ATPOSTRUN__.unshift(cb); }
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function getUniqueRunDependency(id) { return id; }
        function addRunDependency(id) { runDependencies++; if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
        } }
        function removeRunDependency(id) { runDependencies--; if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
        } if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
                clearInterval(runDependencyWatcher);
                runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
                var callback = dependenciesFulfilled;
                dependenciesFulfilled = null;
                callback();
            }
        } }
        function abort(what) { if (Module["onAbort"]) {
            Module["onAbort"](what);
        } what = "Aborted(" + what + ")"; err(what); ABORT = true; EXITSTATUS = 1; what += ". Build with -sASSERTIONS for more info."; var e = new WebAssembly.RuntimeError(what); readyPromiseReject(e); throw e; }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        function isDataURI(filename) { return filename.startsWith(dataURIPrefix); }
        function isFileURI(filename) { return filename.startsWith("file://"); }
        var wasmBinaryFile;
        wasmBinaryFile = "libarchive.wasm";
        if (!isDataURI(wasmBinaryFile)) {
            wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinarySync(file) { if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
        } if (readBinary) {
            return readBinary(file);
        } throw "both async and sync fetching of the wasm failed"; }
        function getBinaryPromise(binaryFile) { if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
            if (typeof fetch == "function" && !isFileURI(binaryFile)) {
                return fetch(binaryFile, { credentials: "same-origin" }).then((function (response) { if (!response["ok"]) {
                    throw "failed to load wasm binary file at '" + binaryFile + "'";
                } return response["arrayBuffer"](); })).catch((function () { return getBinarySync(binaryFile); }));
            }
            else if (readAsync) {
                return new Promise((function (resolve, reject) { readAsync(binaryFile, (function (response) { return resolve(new Uint8Array(response)); }), reject); }));
            }
        } return Promise.resolve().then((function () { return getBinarySync(binaryFile); })); }
        function instantiateArrayBuffer(binaryFile, imports, receiver) { return getBinaryPromise(binaryFile).then((function (binary) { return WebAssembly.instantiate(binary, imports); })).then((function (instance) { return instance; })).then(receiver, (function (reason) { err("failed to asynchronously prepare wasm: " + reason); abort(reason); })); }
        function instantiateAsync(binary, binaryFile, imports, callback) { if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
            return fetch(binaryFile, { credentials: "same-origin" }).then((function (response) { var result = WebAssembly.instantiateStreaming(response, imports); return result.then(callback, (function (reason) { err("wasm streaming compile failed: " + reason); err("falling back to ArrayBuffer instantiation"); return instantiateArrayBuffer(binaryFile, imports, callback); })); }));
        } return instantiateArrayBuffer(binaryFile, imports, callback); }
        function createWasm() { var info = { "a": wasmImports }; function receiveInstance(instance, module) { var exports = instance.exports; Module["asm"] = exports; wasmMemory = Module["asm"]["x"]; updateMemoryViews(); wasmTable = Module["asm"]["G"]; addOnInit(Module["asm"]["y"]); removeRunDependency("wasm-instantiate"); return exports; } addRunDependency("wasm-instantiate"); function receiveInstantiationResult(result) { receiveInstance(result["instance"]); } if (Module["instantiateWasm"]) {
            try {
                return Module["instantiateWasm"](info, receiveInstance);
            }
            catch (e) {
                err("Module.instantiateWasm callback failed with error: " + e);
                readyPromiseReject(e);
            }
        } instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject); return {}; }
        var tempDouble;
        var tempI64;
        function ExitStatus(status) { this.name = "ExitStatus"; this.message = "Program terminated with exit(".concat(status, ")"); this.status = status; }
        var callRuntimeCallbacks = function (callbacks) { while (callbacks.length > 0) {
            callbacks.shift()(Module);
        } };
        var PATH = { isAbs: function (path) { return path.charAt(0) === "/"; }, splitPath: function (filename) { var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/; return splitPathRe.exec(filename).slice(1); }, normalizeArray: function (parts, allowAboveRoot) { var up = 0; for (var i = parts.length - 1; i >= 0; i--) {
                var last = parts[i];
                if (last === ".") {
                    parts.splice(i, 1);
                }
                else if (last === "..") {
                    parts.splice(i, 1);
                    up++;
                }
                else if (up) {
                    parts.splice(i, 1);
                    up--;
                }
            } if (allowAboveRoot) {
                for (; up; up--) {
                    parts.unshift("..");
                }
            } return parts; }, normalize: function (path) { var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/"; path = PATH.normalizeArray(path.split("/").filter((function (p) { return !!p; })), !isAbsolute).join("/"); if (!path && !isAbsolute) {
                path = ".";
            } if (path && trailingSlash) {
                path += "/";
            } return (isAbsolute ? "/" : "") + path; }, dirname: function (path) { var result = PATH.splitPath(path), root = result[0], dir = result[1]; if (!root && !dir) {
                return ".";
            } if (dir) {
                dir = dir.substr(0, dir.length - 1);
            } return root + dir; }, basename: function (path) { if (path === "/")
                return "/"; path = PATH.normalize(path); path = path.replace(/\/$/, ""); var lastSlash = path.lastIndexOf("/"); if (lastSlash === -1)
                return path; return path.substr(lastSlash + 1); }, join: function () { var paths = Array.prototype.slice.call(arguments); return PATH.normalize(paths.join("/")); }, join2: function (l, r) { return PATH.normalize(l + "/" + r); } };
        var initRandomFill = function () { if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
            return function (view) { return crypto.getRandomValues(view); };
        }
        else if (ENVIRONMENT_IS_NODE) {
            try {
                var crypto_module = require("crypto");
                var randomFillSync = crypto_module["randomFillSync"];
                if (randomFillSync) {
                    return function (view) { return crypto_module["randomFillSync"](view); };
                }
                var randomBytes = crypto_module["randomBytes"];
                return function (view) { return (view.set(randomBytes(view.byteLength)), view); };
            }
            catch (e) { }
        } abort("initRandomDevice"); };
        var randomFill = function (view) { return (randomFill = initRandomFill())(view); };
        var PATH_FS = { resolve: function () { var resolvedPath = "", resolvedAbsolute = false; for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                var path = i >= 0 ? arguments[i] : FS.cwd();
                if (typeof path != "string") {
                    throw new TypeError("Arguments to path.resolve must be strings");
                }
                else if (!path) {
                    return "";
                }
                resolvedPath = path + "/" + resolvedPath;
                resolvedAbsolute = PATH.isAbs(path);
            } resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((function (p) { return !!p; })), !resolvedAbsolute).join("/"); return (resolvedAbsolute ? "/" : "") + resolvedPath || "."; }, relative: function (from, to) { from = PATH_FS.resolve(from).substr(1); to = PATH_FS.resolve(to).substr(1); function trim(arr) { var start = 0; for (; start < arr.length; start++) {
                if (arr[start] !== "")
                    break;
            } var end = arr.length - 1; for (; end >= 0; end--) {
                if (arr[end] !== "")
                    break;
            } if (start > end)
                return []; return arr.slice(start, end - start + 1); } var fromParts = trim(from.split("/")); var toParts = trim(to.split("/")); var length = Math.min(fromParts.length, toParts.length); var samePartsLength = length; for (var i = 0; i < length; i++) {
                if (fromParts[i] !== toParts[i]) {
                    samePartsLength = i;
                    break;
                }
            } var outputParts = []; for (var i = samePartsLength; i < fromParts.length; i++) {
                outputParts.push("..");
            } outputParts = outputParts.concat(toParts.slice(samePartsLength)); return outputParts.join("/"); } };
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;
        var UTF8ArrayToString = function (heapOrArray, idx, maxBytesToRead) { var endIdx = idx + maxBytesToRead; var endPtr = idx; while (heapOrArray[endPtr] && !(endPtr >= endIdx))
            ++endPtr; if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
        } var str = ""; while (idx < endPtr) {
            var u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
            }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue;
            }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            }
            else {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
            }
            if (u0 < 65536) {
                str += String.fromCharCode(u0);
            }
            else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
        } return str; };
        var FS_stdin_getChar_buffer = [];
        var lengthBytesUTF8 = function (str) { var len = 0; for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if (c <= 127) {
                len++;
            }
            else if (c <= 2047) {
                len += 2;
            }
            else if (c >= 55296 && c <= 57343) {
                len += 4;
                ++i;
            }
            else {
                len += 3;
            }
        } return len; };
        var stringToUTF8Array = function (str, heap, outIdx, maxBytesToWrite) { if (!(maxBytesToWrite > 0))
            return 0; var startIdx = outIdx; var endIdx = outIdx + maxBytesToWrite - 1; for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
                var u1 = str.charCodeAt(++i);
                u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
                if (outIdx >= endIdx)
                    break;
                heap[outIdx++] = u;
            }
            else if (u <= 2047) {
                if (outIdx + 1 >= endIdx)
                    break;
                heap[outIdx++] = 192 | u >> 6;
                heap[outIdx++] = 128 | u & 63;
            }
            else if (u <= 65535) {
                if (outIdx + 2 >= endIdx)
                    break;
                heap[outIdx++] = 224 | u >> 12;
                heap[outIdx++] = 128 | u >> 6 & 63;
                heap[outIdx++] = 128 | u & 63;
            }
            else {
                if (outIdx + 3 >= endIdx)
                    break;
                heap[outIdx++] = 240 | u >> 18;
                heap[outIdx++] = 128 | u >> 12 & 63;
                heap[outIdx++] = 128 | u >> 6 & 63;
                heap[outIdx++] = 128 | u & 63;
            }
        } heap[outIdx] = 0; return outIdx - startIdx; };
        function intArrayFromString(stringy, dontAddNull, length) { var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1; var u8array = new Array(len); var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length); if (dontAddNull)
            u8array.length = numBytesWritten; return u8array; }
        var FS_stdin_getChar = function () { if (!FS_stdin_getChar_buffer.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
                var BUFSIZE = 256;
                var buf = Buffer.alloc(BUFSIZE);
                var bytesRead = 0;
                var fd = process.stdin.fd;
                try {
                    bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, -1);
                }
                catch (e) {
                    if (e.toString().includes("EOF"))
                        bytesRead = 0;
                    else
                        throw e;
                }
                if (bytesRead > 0) {
                    result = buf.slice(0, bytesRead).toString("utf-8");
                }
                else {
                    result = null;
                }
            }
            else if (typeof window != "undefined" && typeof window.prompt == "function") {
                result = window.prompt("Input: ");
                if (result !== null) {
                    result += "\n";
                }
            }
            else if (typeof readline == "function") {
                result = readline();
                if (result !== null) {
                    result += "\n";
                }
            }
            if (!result) {
                return null;
            }
            FS_stdin_getChar_buffer = intArrayFromString(result, true);
        } return FS_stdin_getChar_buffer.shift(); };
        var TTY = { ttys: [], init: function () { }, shutdown: function () { }, register: function (dev, ops) { TTY.ttys[dev] = { input: [], output: [], ops: ops }; FS.registerDevice(dev, TTY.stream_ops); }, stream_ops: { open: function (stream) { var tty = TTY.ttys[stream.node.rdev]; if (!tty) {
                    throw new FS.ErrnoError(43);
                } stream.tty = tty; stream.seekable = false; }, close: function (stream) { stream.tty.ops.fsync(stream.tty); }, fsync: function (stream) { stream.tty.ops.fsync(stream.tty); }, read: function (stream, buffer, offset, length, pos) { if (!stream.tty || !stream.tty.ops.get_char) {
                    throw new FS.ErrnoError(60);
                } var bytesRead = 0; for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = stream.tty.ops.get_char(stream.tty);
                    }
                    catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(6);
                    }
                    if (result === null || result === undefined)
                        break;
                    bytesRead++;
                    buffer[offset + i] = result;
                } if (bytesRead) {
                    stream.node.timestamp = Date.now();
                } return bytesRead; }, write: function (stream, buffer, offset, length, pos) { if (!stream.tty || !stream.tty.ops.put_char) {
                    throw new FS.ErrnoError(60);
                } try {
                    for (var i = 0; i < length; i++) {
                        stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                    }
                }
                catch (e) {
                    throw new FS.ErrnoError(29);
                } if (length) {
                    stream.node.timestamp = Date.now();
                } return i; } }, default_tty_ops: { get_char: function (tty) { return FS_stdin_getChar(); }, put_char: function (tty, val) { if (val === null || val === 10) {
                    out(UTF8ArrayToString(tty.output, 0));
                    tty.output = [];
                }
                else {
                    if (val != 0)
                        tty.output.push(val);
                } }, fsync: function (tty) { if (tty.output && tty.output.length > 0) {
                    out(UTF8ArrayToString(tty.output, 0));
                    tty.output = [];
                } }, ioctl_tcgets: function (tty) { return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }; }, ioctl_tcsets: function (tty, optional_actions, data) { return 0; }, ioctl_tiocgwinsz: function (tty) { return [24, 80]; } }, default_tty1_ops: { put_char: function (tty, val) { if (val === null || val === 10) {
                    err(UTF8ArrayToString(tty.output, 0));
                    tty.output = [];
                }
                else {
                    if (val != 0)
                        tty.output.push(val);
                } }, fsync: function (tty) { if (tty.output && tty.output.length > 0) {
                    err(UTF8ArrayToString(tty.output, 0));
                    tty.output = [];
                } } } };
        var mmapAlloc = function (size) { abort(); };
        var MEMFS = { ops_table: null, mount: function (mount) { return MEMFS.createNode(null, "/", 16384 | 511, 0); }, createNode: function (parent, name, mode, dev) { if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                throw new FS.ErrnoError(63);
            } if (!MEMFS.ops_table) {
                MEMFS.ops_table = { dir: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, lookup: MEMFS.node_ops.lookup, mknod: MEMFS.node_ops.mknod, rename: MEMFS.node_ops.rename, unlink: MEMFS.node_ops.unlink, rmdir: MEMFS.node_ops.rmdir, readdir: MEMFS.node_ops.readdir, symlink: MEMFS.node_ops.symlink }, stream: { llseek: MEMFS.stream_ops.llseek } }, file: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: { llseek: MEMFS.stream_ops.llseek, read: MEMFS.stream_ops.read, write: MEMFS.stream_ops.write, allocate: MEMFS.stream_ops.allocate, mmap: MEMFS.stream_ops.mmap, msync: MEMFS.stream_ops.msync } }, link: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, readlink: MEMFS.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: FS.chrdev_stream_ops } };
            } var node = FS.createNode(parent, name, mode, dev); if (FS.isDir(node.mode)) {
                node.node_ops = MEMFS.ops_table.dir.node;
                node.stream_ops = MEMFS.ops_table.dir.stream;
                node.contents = {};
            }
            else if (FS.isFile(node.mode)) {
                node.node_ops = MEMFS.ops_table.file.node;
                node.stream_ops = MEMFS.ops_table.file.stream;
                node.usedBytes = 0;
                node.contents = null;
            }
            else if (FS.isLink(node.mode)) {
                node.node_ops = MEMFS.ops_table.link.node;
                node.stream_ops = MEMFS.ops_table.link.stream;
            }
            else if (FS.isChrdev(node.mode)) {
                node.node_ops = MEMFS.ops_table.chrdev.node;
                node.stream_ops = MEMFS.ops_table.chrdev.stream;
            } node.timestamp = Date.now(); if (parent) {
                parent.contents[name] = node;
                parent.timestamp = node.timestamp;
            } return node; }, getFileDataAsTypedArray: function (node) { if (!node.contents)
                return new Uint8Array(0); if (node.contents.subarray)
                return node.contents.subarray(0, node.usedBytes); return new Uint8Array(node.contents); }, expandFileStorage: function (node, newCapacity) { var prevCapacity = node.contents ? node.contents.length : 0; if (prevCapacity >= newCapacity)
                return; var CAPACITY_DOUBLING_MAX = 1024 * 1024; newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0); if (prevCapacity != 0)
                newCapacity = Math.max(newCapacity, 256); var oldContents = node.contents; node.contents = new Uint8Array(newCapacity); if (node.usedBytes > 0)
                node.contents.set(oldContents.subarray(0, node.usedBytes), 0); }, resizeFileStorage: function (node, newSize) { if (node.usedBytes == newSize)
                return; if (newSize == 0) {
                node.contents = null;
                node.usedBytes = 0;
            }
            else {
                var oldContents = node.contents;
                node.contents = new Uint8Array(newSize);
                if (oldContents) {
                    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
                }
                node.usedBytes = newSize;
            } }, node_ops: { getattr: function (node) { var attr = {}; attr.dev = FS.isChrdev(node.mode) ? node.id : 1; attr.ino = node.id; attr.mode = node.mode; attr.nlink = 1; attr.uid = 0; attr.gid = 0; attr.rdev = node.rdev; if (FS.isDir(node.mode)) {
                    attr.size = 4096;
                }
                else if (FS.isFile(node.mode)) {
                    attr.size = node.usedBytes;
                }
                else if (FS.isLink(node.mode)) {
                    attr.size = node.link.length;
                }
                else {
                    attr.size = 0;
                } attr.atime = new Date(node.timestamp); attr.mtime = new Date(node.timestamp); attr.ctime = new Date(node.timestamp); attr.blksize = 4096; attr.blocks = Math.ceil(attr.size / attr.blksize); return attr; }, setattr: function (node, attr) { if (attr.mode !== undefined) {
                    node.mode = attr.mode;
                } if (attr.timestamp !== undefined) {
                    node.timestamp = attr.timestamp;
                } if (attr.size !== undefined) {
                    MEMFS.resizeFileStorage(node, attr.size);
                } }, lookup: function (parent, name) { throw FS.genericErrors[44]; }, mknod: function (parent, name, mode, dev) { return MEMFS.createNode(parent, name, mode, dev); }, rename: function (old_node, new_dir, new_name) { if (FS.isDir(old_node.mode)) {
                    var new_node;
                    try {
                        new_node = FS.lookupNode(new_dir, new_name);
                    }
                    catch (e) { }
                    if (new_node) {
                        for (var i in new_node.contents) {
                            throw new FS.ErrnoError(55);
                        }
                    }
                } delete old_node.parent.contents[old_node.name]; old_node.parent.timestamp = Date.now(); old_node.name = new_name; new_dir.contents[new_name] = old_node; new_dir.timestamp = old_node.parent.timestamp; old_node.parent = new_dir; }, unlink: function (parent, name) { delete parent.contents[name]; parent.timestamp = Date.now(); }, rmdir: function (parent, name) { var node = FS.lookupNode(parent, name); for (var i in node.contents) {
                    throw new FS.ErrnoError(55);
                } delete parent.contents[name]; parent.timestamp = Date.now(); }, readdir: function (node) { var entries = [".", ".."]; for (var key in node.contents) {
                    if (!node.contents.hasOwnProperty(key)) {
                        continue;
                    }
                    entries.push(key);
                } return entries; }, symlink: function (parent, newname, oldpath) { var node = MEMFS.createNode(parent, newname, 511 | 40960, 0); node.link = oldpath; return node; }, readlink: function (node) { if (!FS.isLink(node.mode)) {
                    throw new FS.ErrnoError(28);
                } return node.link; } }, stream_ops: { read: function (stream, buffer, offset, length, position) { var contents = stream.node.contents; if (position >= stream.node.usedBytes)
                    return 0; var size = Math.min(stream.node.usedBytes - position, length); if (size > 8 && contents.subarray) {
                    buffer.set(contents.subarray(position, position + size), offset);
                }
                else {
                    for (var i = 0; i < size; i++)
                        buffer[offset + i] = contents[position + i];
                } return size; }, write: function (stream, buffer, offset, length, position, canOwn) { if (buffer.buffer === HEAP8.buffer) {
                    canOwn = false;
                } if (!length)
                    return 0; var node = stream.node; node.timestamp = Date.now(); if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                    if (canOwn) {
                        node.contents = buffer.subarray(offset, offset + length);
                        node.usedBytes = length;
                        return length;
                    }
                    else if (node.usedBytes === 0 && position === 0) {
                        node.contents = buffer.slice(offset, offset + length);
                        node.usedBytes = length;
                        return length;
                    }
                    else if (position + length <= node.usedBytes) {
                        node.contents.set(buffer.subarray(offset, offset + length), position);
                        return length;
                    }
                } MEMFS.expandFileStorage(node, position + length); if (node.contents.subarray && buffer.subarray) {
                    node.contents.set(buffer.subarray(offset, offset + length), position);
                }
                else {
                    for (var i = 0; i < length; i++) {
                        node.contents[position + i] = buffer[offset + i];
                    }
                } node.usedBytes = Math.max(node.usedBytes, position + length); return length; }, llseek: function (stream, offset, whence) { var position = offset; if (whence === 1) {
                    position += stream.position;
                }
                else if (whence === 2) {
                    if (FS.isFile(stream.node.mode)) {
                        position += stream.node.usedBytes;
                    }
                } if (position < 0) {
                    throw new FS.ErrnoError(28);
                } return position; }, allocate: function (stream, offset, length) { MEMFS.expandFileStorage(stream.node, offset + length); stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length); }, mmap: function (stream, length, position, prot, flags) { if (!FS.isFile(stream.node.mode)) {
                    throw new FS.ErrnoError(43);
                } var ptr; var allocated; var contents = stream.node.contents; if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
                    allocated = false;
                    ptr = contents.byteOffset;
                }
                else {
                    if (position > 0 || position + length < contents.length) {
                        if (contents.subarray) {
                            contents = contents.subarray(position, position + length);
                        }
                        else {
                            contents = Array.prototype.slice.call(contents, position, position + length);
                        }
                    }
                    allocated = true;
                    ptr = mmapAlloc(length);
                    if (!ptr) {
                        throw new FS.ErrnoError(48);
                    }
                    HEAP8.set(contents, ptr);
                } return { ptr: ptr, allocated: allocated }; }, msync: function (stream, buffer, offset, length, mmapFlags) { MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false); return 0; } } };
        var asyncLoad = function (url, onload, onerror, noRunDep) { var dep = !noRunDep ? getUniqueRunDependency("al ".concat(url)) : ""; readAsync(url, (function (arrayBuffer) { assert(arrayBuffer, "Loading data file \"".concat(url, "\" failed (no arrayBuffer).")); onload(new Uint8Array(arrayBuffer)); if (dep)
            removeRunDependency(dep); }), (function (event) { if (onerror) {
            onerror();
        }
        else {
            throw "Loading data file \"".concat(url, "\" failed.");
        } })); if (dep)
            addRunDependency(dep); };
        var preloadPlugins = Module["preloadPlugins"] || [];
        function FS_handledByPreloadPlugin(byteArray, fullname, finish, onerror) { if (typeof Browser != "undefined")
            Browser.init(); var handled = false; preloadPlugins.forEach((function (plugin) { if (handled)
            return; if (plugin["canHandle"](fullname)) {
            plugin["handle"](byteArray, fullname, finish, onerror);
            handled = true;
        } })); return handled; }
        function FS_createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) { var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent; var dep = getUniqueRunDependency("cp ".concat(fullname)); function processData(byteArray) { function finish(byteArray) { if (preFinish)
            preFinish(); if (!dontCreateFile) {
            FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
        } if (onload)
            onload(); removeRunDependency(dep); } if (FS_handledByPreloadPlugin(byteArray, fullname, finish, (function () { if (onerror)
            onerror(); removeRunDependency(dep); }))) {
            return;
        } finish(byteArray); } addRunDependency(dep); if (typeof url == "string") {
            asyncLoad(url, (function (byteArray) { return processData(byteArray); }), onerror);
        }
        else {
            processData(url);
        } }
        function FS_modeStringToFlags(str) { var flagModes = { "r": 0, "r+": 2, "w": 512 | 64 | 1, "w+": 512 | 64 | 2, "a": 1024 | 64 | 1, "a+": 1024 | 64 | 2 }; var flags = flagModes[str]; if (typeof flags == "undefined") {
            throw new Error("Unknown file open mode: ".concat(str));
        } return flags; }
        function FS_getMode(canRead, canWrite) { var mode = 0; if (canRead)
            mode |= 292 | 73; if (canWrite)
            mode |= 146; return mode; }
        var FS = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: false, ignorePermissions: true, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: function (path, opts) {
                if (opts === void 0) { opts = {}; }
                path = PATH_FS.resolve(path);
                if (!path)
                    return { path: "", node: null };
                var defaults = { follow_mount: true, recurse_count: 0 };
                opts = Object.assign(defaults, opts);
                if (opts.recurse_count > 8) {
                    throw new FS.ErrnoError(32);
                }
                var parts = path.split("/").filter((function (p) { return !!p; }));
                var current = FS.root;
                var current_path = "/";
                for (var i = 0; i < parts.length; i++) {
                    var islast = i === parts.length - 1;
                    if (islast && opts.parent) {
                        break;
                    }
                    current = FS.lookupNode(current, parts[i]);
                    current_path = PATH.join2(current_path, parts[i]);
                    if (FS.isMountpoint(current)) {
                        if (!islast || islast && opts.follow_mount) {
                            current = current.mounted.root;
                        }
                    }
                    if (!islast || opts.follow) {
                        var count = 0;
                        while (FS.isLink(current.mode)) {
                            var link = FS.readlink(current_path);
                            current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                            var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
                            current = lookup.node;
                            if (count++ > 40) {
                                throw new FS.ErrnoError(32);
                            }
                        }
                    }
                }
                return { path: current_path, node: current };
            }, getPath: function (node) { var path; while (true) {
                if (FS.isRoot(node)) {
                    var mount = node.mount.mountpoint;
                    if (!path)
                        return mount;
                    return mount[mount.length - 1] !== "/" ? "".concat(mount, "/").concat(path) : mount + path;
                }
                path = path ? "".concat(node.name, "/").concat(path) : node.name;
                node = node.parent;
            } }, hashName: function (parentid, name) { var hash = 0; for (var i = 0; i < name.length; i++) {
                hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
            } return (parentid + hash >>> 0) % FS.nameTable.length; }, hashAddNode: function (node) { var hash = FS.hashName(node.parent.id, node.name); node.name_next = FS.nameTable[hash]; FS.nameTable[hash] = node; }, hashRemoveNode: function (node) { var hash = FS.hashName(node.parent.id, node.name); if (FS.nameTable[hash] === node) {
                FS.nameTable[hash] = node.name_next;
            }
            else {
                var current = FS.nameTable[hash];
                while (current) {
                    if (current.name_next === node) {
                        current.name_next = node.name_next;
                        break;
                    }
                    current = current.name_next;
                }
            } }, lookupNode: function (parent, name) { var errCode = FS.mayLookup(parent); if (errCode) {
                throw new FS.ErrnoError(errCode, parent);
            } var hash = FS.hashName(parent.id, name); for (var node = FS.nameTable[hash]; node; node = node.name_next) {
                var nodeName = node.name;
                if (node.parent.id === parent.id && nodeName === name) {
                    return node;
                }
            } return FS.lookup(parent, name); }, createNode: function (parent, name, mode, rdev) { var node = new FS.FSNode(parent, name, mode, rdev); FS.hashAddNode(node); return node; }, destroyNode: function (node) { FS.hashRemoveNode(node); }, isRoot: function (node) { return node === node.parent; }, isMountpoint: function (node) { return !!node.mounted; }, isFile: function (mode) { return (mode & 61440) === 32768; }, isDir: function (mode) { return (mode & 61440) === 16384; }, isLink: function (mode) { return (mode & 61440) === 40960; }, isChrdev: function (mode) { return (mode & 61440) === 8192; }, isBlkdev: function (mode) { return (mode & 61440) === 24576; }, isFIFO: function (mode) { return (mode & 61440) === 4096; }, isSocket: function (mode) { return (mode & 49152) === 49152; }, flagsToPermissionString: function (flag) { var perms = ["r", "w", "rw"][flag & 3]; if (flag & 512) {
                perms += "w";
            } return perms; }, nodePermissions: function (node, perms) { if (FS.ignorePermissions) {
                return 0;
            } if (perms.includes("r") && !(node.mode & 292)) {
                return 2;
            }
            else if (perms.includes("w") && !(node.mode & 146)) {
                return 2;
            }
            else if (perms.includes("x") && !(node.mode & 73)) {
                return 2;
            } return 0; }, mayLookup: function (dir) { var errCode = FS.nodePermissions(dir, "x"); if (errCode)
                return errCode; if (!dir.node_ops.lookup)
                return 2; return 0; }, mayCreate: function (dir, name) { try {
                var node = FS.lookupNode(dir, name);
                return 20;
            }
            catch (e) { } return FS.nodePermissions(dir, "wx"); }, mayDelete: function (dir, name, isdir) { var node; try {
                node = FS.lookupNode(dir, name);
            }
            catch (e) {
                return e.errno;
            } var errCode = FS.nodePermissions(dir, "wx"); if (errCode) {
                return errCode;
            } if (isdir) {
                if (!FS.isDir(node.mode)) {
                    return 54;
                }
                if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                    return 10;
                }
            }
            else {
                if (FS.isDir(node.mode)) {
                    return 31;
                }
            } return 0; }, mayOpen: function (node, flags) { if (!node) {
                return 44;
            } if (FS.isLink(node.mode)) {
                return 32;
            }
            else if (FS.isDir(node.mode)) {
                if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                    return 31;
                }
            } return FS.nodePermissions(node, FS.flagsToPermissionString(flags)); }, MAX_OPEN_FDS: 4096, nextfd: function () { for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
                if (!FS.streams[fd]) {
                    return fd;
                }
            } throw new FS.ErrnoError(33); }, getStreamChecked: function (fd) { var stream = FS.getStream(fd); if (!stream) {
                throw new FS.ErrnoError(8);
            } return stream; }, getStream: function (fd) { return FS.streams[fd]; }, createStream: function (stream, fd) {
                if (fd === void 0) { fd = -1; }
                if (!FS.FSStream) {
                    FS.FSStream = function () { this.shared = {}; };
                    FS.FSStream.prototype = {};
                    Object.defineProperties(FS.FSStream.prototype, { object: { get: function () { return this.node; }, set: function (val) { this.node = val; } }, isRead: { get: function () { return (this.flags & 2097155) !== 1; } }, isWrite: { get: function () { return (this.flags & 2097155) !== 0; } }, isAppend: { get: function () { return this.flags & 1024; } }, flags: { get: function () { return this.shared.flags; }, set: function (val) { this.shared.flags = val; } }, position: { get: function () { return this.shared.position; }, set: function (val) { this.shared.position = val; } } });
                }
                stream = Object.assign(new FS.FSStream, stream);
                if (fd == -1) {
                    fd = FS.nextfd();
                }
                stream.fd = fd;
                FS.streams[fd] = stream;
                return stream;
            }, closeStream: function (fd) { FS.streams[fd] = null; }, chrdev_stream_ops: { open: function (stream) { var device = FS.getDevice(stream.node.rdev); stream.stream_ops = device.stream_ops; if (stream.stream_ops.open) {
                    stream.stream_ops.open(stream);
                } }, llseek: function () { throw new FS.ErrnoError(70); } }, major: function (dev) { return dev >> 8; }, minor: function (dev) { return dev & 255; }, makedev: function (ma, mi) { return ma << 8 | mi; }, registerDevice: function (dev, ops) { FS.devices[dev] = { stream_ops: ops }; }, getDevice: function (dev) { return FS.devices[dev]; }, getMounts: function (mount) { var mounts = []; var check = [mount]; while (check.length) {
                var m = check.pop();
                mounts.push(m);
                check.push.apply(check, m.mounts);
            } return mounts; }, syncfs: function (populate, callback) { if (typeof populate == "function") {
                callback = populate;
                populate = false;
            } FS.syncFSRequests++; if (FS.syncFSRequests > 1) {
                err("warning: ".concat(FS.syncFSRequests, " FS.syncfs operations in flight at once, probably just doing extra work"));
            } var mounts = FS.getMounts(FS.root.mount); var completed = 0; function doCallback(errCode) { FS.syncFSRequests--; return callback(errCode); } function done(errCode) { if (errCode) {
                if (!done.errored) {
                    done.errored = true;
                    return doCallback(errCode);
                }
                return;
            } if (++completed >= mounts.length) {
                doCallback(null);
            } } mounts.forEach((function (mount) { if (!mount.type.syncfs) {
                return done(null);
            } mount.type.syncfs(mount, populate, done); })); }, mount: function (type, opts, mountpoint) { var root = mountpoint === "/"; var pseudo = !mountpoint; var node; if (root && FS.root) {
                throw new FS.ErrnoError(10);
            }
            else if (!root && !pseudo) {
                var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
                mountpoint = lookup.path;
                node = lookup.node;
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(10);
                }
                if (!FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(54);
                }
            } var mount = { type: type, opts: opts, mountpoint: mountpoint, mounts: [] }; var mountRoot = type.mount(mount); mountRoot.mount = mount; mount.root = mountRoot; if (root) {
                FS.root = mountRoot;
            }
            else if (node) {
                node.mounted = mount;
                if (node.mount) {
                    node.mount.mounts.push(mount);
                }
            } return mountRoot; }, unmount: function (mountpoint) { var lookup = FS.lookupPath(mountpoint, { follow_mount: false }); if (!FS.isMountpoint(lookup.node)) {
                throw new FS.ErrnoError(28);
            } var node = lookup.node; var mount = node.mounted; var mounts = FS.getMounts(mount); Object.keys(FS.nameTable).forEach((function (hash) { var current = FS.nameTable[hash]; while (current) {
                var next = current.name_next;
                if (mounts.includes(current.mount)) {
                    FS.destroyNode(current);
                }
                current = next;
            } })); node.mounted = null; var idx = node.mount.mounts.indexOf(mount); node.mount.mounts.splice(idx, 1); }, lookup: function (parent, name) { return parent.node_ops.lookup(parent, name); }, mknod: function (path, mode, dev) { var lookup = FS.lookupPath(path, { parent: true }); var parent = lookup.node; var name = PATH.basename(path); if (!name || name === "." || name === "..") {
                throw new FS.ErrnoError(28);
            } var errCode = FS.mayCreate(parent, name); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } if (!parent.node_ops.mknod) {
                throw new FS.ErrnoError(63);
            } return parent.node_ops.mknod(parent, name, mode, dev); }, create: function (path, mode) { mode = mode !== undefined ? mode : 438; mode &= 4095; mode |= 32768; return FS.mknod(path, mode, 0); }, mkdir: function (path, mode) { mode = mode !== undefined ? mode : 511; mode &= 511 | 512; mode |= 16384; return FS.mknod(path, mode, 0); }, mkdirTree: function (path, mode) { var dirs = path.split("/"); var d = ""; for (var i = 0; i < dirs.length; ++i) {
                if (!dirs[i])
                    continue;
                d += "/" + dirs[i];
                try {
                    FS.mkdir(d, mode);
                }
                catch (e) {
                    if (e.errno != 20)
                        throw e;
                }
            } }, mkdev: function (path, mode, dev) { if (typeof dev == "undefined") {
                dev = mode;
                mode = 438;
            } mode |= 8192; return FS.mknod(path, mode, dev); }, symlink: function (oldpath, newpath) { if (!PATH_FS.resolve(oldpath)) {
                throw new FS.ErrnoError(44);
            } var lookup = FS.lookupPath(newpath, { parent: true }); var parent = lookup.node; if (!parent) {
                throw new FS.ErrnoError(44);
            } var newname = PATH.basename(newpath); var errCode = FS.mayCreate(parent, newname); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } if (!parent.node_ops.symlink) {
                throw new FS.ErrnoError(63);
            } return parent.node_ops.symlink(parent, newname, oldpath); }, rename: function (old_path, new_path) { var old_dirname = PATH.dirname(old_path); var new_dirname = PATH.dirname(new_path); var old_name = PATH.basename(old_path); var new_name = PATH.basename(new_path); var lookup, old_dir, new_dir; lookup = FS.lookupPath(old_path, { parent: true }); old_dir = lookup.node; lookup = FS.lookupPath(new_path, { parent: true }); new_dir = lookup.node; if (!old_dir || !new_dir)
                throw new FS.ErrnoError(44); if (old_dir.mount !== new_dir.mount) {
                throw new FS.ErrnoError(75);
            } var old_node = FS.lookupNode(old_dir, old_name); var relative = PATH_FS.relative(old_path, new_dirname); if (relative.charAt(0) !== ".") {
                throw new FS.ErrnoError(28);
            } relative = PATH_FS.relative(new_path, old_dirname); if (relative.charAt(0) !== ".") {
                throw new FS.ErrnoError(55);
            } var new_node; try {
                new_node = FS.lookupNode(new_dir, new_name);
            }
            catch (e) { } if (old_node === new_node) {
                return;
            } var isdir = FS.isDir(old_node.mode); var errCode = FS.mayDelete(old_dir, old_name, isdir); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } if (!old_dir.node_ops.rename) {
                throw new FS.ErrnoError(63);
            } if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
                throw new FS.ErrnoError(10);
            } if (new_dir !== old_dir) {
                errCode = FS.nodePermissions(old_dir, "w");
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
            } FS.hashRemoveNode(old_node); try {
                old_dir.node_ops.rename(old_node, new_dir, new_name);
            }
            catch (e) {
                throw e;
            }
            finally {
                FS.hashAddNode(old_node);
            } }, rmdir: function (path) { var lookup = FS.lookupPath(path, { parent: true }); var parent = lookup.node; var name = PATH.basename(path); var node = FS.lookupNode(parent, name); var errCode = FS.mayDelete(parent, name, true); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } if (!parent.node_ops.rmdir) {
                throw new FS.ErrnoError(63);
            } if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
            } parent.node_ops.rmdir(parent, name); FS.destroyNode(node); }, readdir: function (path) { var lookup = FS.lookupPath(path, { follow: true }); var node = lookup.node; if (!node.node_ops.readdir) {
                throw new FS.ErrnoError(54);
            } return node.node_ops.readdir(node); }, unlink: function (path) { var lookup = FS.lookupPath(path, { parent: true }); var parent = lookup.node; if (!parent) {
                throw new FS.ErrnoError(44);
            } var name = PATH.basename(path); var node = FS.lookupNode(parent, name); var errCode = FS.mayDelete(parent, name, false); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } if (!parent.node_ops.unlink) {
                throw new FS.ErrnoError(63);
            } if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
            } parent.node_ops.unlink(parent, name); FS.destroyNode(node); }, readlink: function (path) { var lookup = FS.lookupPath(path); var link = lookup.node; if (!link) {
                throw new FS.ErrnoError(44);
            } if (!link.node_ops.readlink) {
                throw new FS.ErrnoError(28);
            } return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link)); }, stat: function (path, dontFollow) { var lookup = FS.lookupPath(path, { follow: !dontFollow }); var node = lookup.node; if (!node) {
                throw new FS.ErrnoError(44);
            } if (!node.node_ops.getattr) {
                throw new FS.ErrnoError(63);
            } return node.node_ops.getattr(node); }, lstat: function (path) { return FS.stat(path, true); }, chmod: function (path, mode, dontFollow) { var node; if (typeof path == "string") {
                var lookup = FS.lookupPath(path, { follow: !dontFollow });
                node = lookup.node;
            }
            else {
                node = path;
            } if (!node.node_ops.setattr) {
                throw new FS.ErrnoError(63);
            } node.node_ops.setattr(node, { mode: mode & 4095 | node.mode & ~4095, timestamp: Date.now() }); }, lchmod: function (path, mode) { FS.chmod(path, mode, true); }, fchmod: function (fd, mode) { var stream = FS.getStreamChecked(fd); FS.chmod(stream.node, mode); }, chown: function (path, uid, gid, dontFollow) { var node; if (typeof path == "string") {
                var lookup = FS.lookupPath(path, { follow: !dontFollow });
                node = lookup.node;
            }
            else {
                node = path;
            } if (!node.node_ops.setattr) {
                throw new FS.ErrnoError(63);
            } node.node_ops.setattr(node, { timestamp: Date.now() }); }, lchown: function (path, uid, gid) { FS.chown(path, uid, gid, true); }, fchown: function (fd, uid, gid) { var stream = FS.getStreamChecked(fd); FS.chown(stream.node, uid, gid); }, truncate: function (path, len) { if (len < 0) {
                throw new FS.ErrnoError(28);
            } var node; if (typeof path == "string") {
                var lookup = FS.lookupPath(path, { follow: true });
                node = lookup.node;
            }
            else {
                node = path;
            } if (!node.node_ops.setattr) {
                throw new FS.ErrnoError(63);
            } if (FS.isDir(node.mode)) {
                throw new FS.ErrnoError(31);
            } if (!FS.isFile(node.mode)) {
                throw new FS.ErrnoError(28);
            } var errCode = FS.nodePermissions(node, "w"); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } node.node_ops.setattr(node, { size: len, timestamp: Date.now() }); }, ftruncate: function (fd, len) { var stream = FS.getStreamChecked(fd); if ((stream.flags & 2097155) === 0) {
                throw new FS.ErrnoError(28);
            } FS.truncate(stream.node, len); }, utime: function (path, atime, mtime) { var lookup = FS.lookupPath(path, { follow: true }); var node = lookup.node; node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) }); }, open: function (path, flags, mode) { if (path === "") {
                throw new FS.ErrnoError(44);
            } flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags; mode = typeof mode == "undefined" ? 438 : mode; if (flags & 64) {
                mode = mode & 4095 | 32768;
            }
            else {
                mode = 0;
            } var node; if (typeof path == "object") {
                node = path;
            }
            else {
                path = PATH.normalize(path);
                try {
                    var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
                    node = lookup.node;
                }
                catch (e) { }
            } var created = false; if (flags & 64) {
                if (node) {
                    if (flags & 128) {
                        throw new FS.ErrnoError(20);
                    }
                }
                else {
                    node = FS.mknod(path, mode, 0);
                    created = true;
                }
            } if (!node) {
                throw new FS.ErrnoError(44);
            } if (FS.isChrdev(node.mode)) {
                flags &= ~512;
            } if (flags & 65536 && !FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54);
            } if (!created) {
                var errCode = FS.mayOpen(node, flags);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
            } if (flags & 512 && !created) {
                FS.truncate(node, 0);
            } flags &= ~(128 | 512 | 131072); var stream = FS.createStream({ node: node, path: FS.getPath(node), flags: flags, seekable: true, position: 0, stream_ops: node.stream_ops, ungotten: [], error: false }); if (stream.stream_ops.open) {
                stream.stream_ops.open(stream);
            } if (Module["logReadFiles"] && !(flags & 1)) {
                if (!FS.readFiles)
                    FS.readFiles = {};
                if (!(path in FS.readFiles)) {
                    FS.readFiles[path] = 1;
                }
            } return stream; }, close: function (stream) { if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
            } if (stream.getdents)
                stream.getdents = null; try {
                if (stream.stream_ops.close) {
                    stream.stream_ops.close(stream);
                }
            }
            catch (e) {
                throw e;
            }
            finally {
                FS.closeStream(stream.fd);
            } stream.fd = null; }, isClosed: function (stream) { return stream.fd === null; }, llseek: function (stream, offset, whence) { if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
            } if (!stream.seekable || !stream.stream_ops.llseek) {
                throw new FS.ErrnoError(70);
            } if (whence != 0 && whence != 1 && whence != 2) {
                throw new FS.ErrnoError(28);
            } stream.position = stream.stream_ops.llseek(stream, offset, whence); stream.ungotten = []; return stream.position; }, read: function (stream, buffer, offset, length, position) { if (length < 0 || position < 0) {
                throw new FS.ErrnoError(28);
            } if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
            } if ((stream.flags & 2097155) === 1) {
                throw new FS.ErrnoError(8);
            } if (FS.isDir(stream.node.mode)) {
                throw new FS.ErrnoError(31);
            } if (!stream.stream_ops.read) {
                throw new FS.ErrnoError(28);
            } var seeking = typeof position != "undefined"; if (!seeking) {
                position = stream.position;
            }
            else if (!stream.seekable) {
                throw new FS.ErrnoError(70);
            } var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position); if (!seeking)
                stream.position += bytesRead; return bytesRead; }, write: function (stream, buffer, offset, length, position, canOwn) { if (length < 0 || position < 0) {
                throw new FS.ErrnoError(28);
            } if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
            } if ((stream.flags & 2097155) === 0) {
                throw new FS.ErrnoError(8);
            } if (FS.isDir(stream.node.mode)) {
                throw new FS.ErrnoError(31);
            } if (!stream.stream_ops.write) {
                throw new FS.ErrnoError(28);
            } if (stream.seekable && stream.flags & 1024) {
                FS.llseek(stream, 0, 2);
            } var seeking = typeof position != "undefined"; if (!seeking) {
                position = stream.position;
            }
            else if (!stream.seekable) {
                throw new FS.ErrnoError(70);
            } var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn); if (!seeking)
                stream.position += bytesWritten; return bytesWritten; }, allocate: function (stream, offset, length) { if (FS.isClosed(stream)) {
                throw new FS.ErrnoError(8);
            } if (offset < 0 || length <= 0) {
                throw new FS.ErrnoError(28);
            } if ((stream.flags & 2097155) === 0) {
                throw new FS.ErrnoError(8);
            } if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
                throw new FS.ErrnoError(43);
            } if (!stream.stream_ops.allocate) {
                throw new FS.ErrnoError(138);
            } stream.stream_ops.allocate(stream, offset, length); }, mmap: function (stream, length, position, prot, flags) { if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
                throw new FS.ErrnoError(2);
            } if ((stream.flags & 2097155) === 1) {
                throw new FS.ErrnoError(2);
            } if (!stream.stream_ops.mmap) {
                throw new FS.ErrnoError(43);
            } return stream.stream_ops.mmap(stream, length, position, prot, flags); }, msync: function (stream, buffer, offset, length, mmapFlags) { if (!stream.stream_ops.msync) {
                return 0;
            } return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags); }, munmap: function (stream) { return 0; }, ioctl: function (stream, cmd, arg) { if (!stream.stream_ops.ioctl) {
                throw new FS.ErrnoError(59);
            } return stream.stream_ops.ioctl(stream, cmd, arg); }, readFile: function (path, opts) {
                if (opts === void 0) { opts = {}; }
                opts.flags = opts.flags || 0;
                opts.encoding = opts.encoding || "binary";
                if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                    throw new Error("Invalid encoding type \"".concat(opts.encoding, "\""));
                }
                var ret;
                var stream = FS.open(path, opts.flags);
                var stat = FS.stat(path);
                var length = stat.size;
                var buf = new Uint8Array(length);
                FS.read(stream, buf, 0, length, 0);
                if (opts.encoding === "utf8") {
                    ret = UTF8ArrayToString(buf, 0);
                }
                else if (opts.encoding === "binary") {
                    ret = buf;
                }
                FS.close(stream);
                return ret;
            }, writeFile: function (path, data, opts) {
                if (opts === void 0) { opts = {}; }
                opts.flags = opts.flags || 577;
                var stream = FS.open(path, opts.flags, opts.mode);
                if (typeof data == "string") {
                    var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
                    var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
                    FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
                }
                else if (ArrayBuffer.isView(data)) {
                    FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
                }
                else {
                    throw new Error("Unsupported data type");
                }
                FS.close(stream);
            }, cwd: function () { return FS.currentPath; }, chdir: function (path) { var lookup = FS.lookupPath(path, { follow: true }); if (lookup.node === null) {
                throw new FS.ErrnoError(44);
            } if (!FS.isDir(lookup.node.mode)) {
                throw new FS.ErrnoError(54);
            } var errCode = FS.nodePermissions(lookup.node, "x"); if (errCode) {
                throw new FS.ErrnoError(errCode);
            } FS.currentPath = lookup.path; }, createDefaultDirectories: function () { FS.mkdir("/tmp"); FS.mkdir("/home"); FS.mkdir("/home/web_user"); }, createDefaultDevices: function () { FS.mkdir("/dev"); FS.registerDevice(FS.makedev(1, 3), { read: function () { return 0; }, write: function (stream, buffer, offset, length, pos) { return length; } }); FS.mkdev("/dev/null", FS.makedev(1, 3)); TTY.register(FS.makedev(5, 0), TTY.default_tty_ops); TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops); FS.mkdev("/dev/tty", FS.makedev(5, 0)); FS.mkdev("/dev/tty1", FS.makedev(6, 0)); var randomBuffer = new Uint8Array(1024), randomLeft = 0; var randomByte = function () { if (randomLeft === 0) {
                randomLeft = randomFill(randomBuffer).byteLength;
            } return randomBuffer[--randomLeft]; }; FS.createDevice("/dev", "random", randomByte); FS.createDevice("/dev", "urandom", randomByte); FS.mkdir("/dev/shm"); FS.mkdir("/dev/shm/tmp"); }, createSpecialDirectories: function () { FS.mkdir("/proc"); var proc_self = FS.mkdir("/proc/self"); FS.mkdir("/proc/self/fd"); FS.mount({ mount: function () { var node = FS.createNode(proc_self, "fd", 16384 | 511, 73); node.node_ops = { lookup: function (parent, name) { var fd = +name; var stream = FS.getStreamChecked(fd); var ret = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: function () { return stream.path; } } }; ret.parent = ret; return ret; } }; return node; } }, {}, "/proc/self/fd"); }, createStandardStreams: function () { if (Module["stdin"]) {
                FS.createDevice("/dev", "stdin", Module["stdin"]);
            }
            else {
                FS.symlink("/dev/tty", "/dev/stdin");
            } if (Module["stdout"]) {
                FS.createDevice("/dev", "stdout", null, Module["stdout"]);
            }
            else {
                FS.symlink("/dev/tty", "/dev/stdout");
            } if (Module["stderr"]) {
                FS.createDevice("/dev", "stderr", null, Module["stderr"]);
            }
            else {
                FS.symlink("/dev/tty1", "/dev/stderr");
            } var stdin = FS.open("/dev/stdin", 0); var stdout = FS.open("/dev/stdout", 1); var stderr = FS.open("/dev/stderr", 1); }, ensureErrnoError: function () { if (FS.ErrnoError)
                return; FS.ErrnoError = function ErrnoError(errno, node) { this.name = "ErrnoError"; this.node = node; this.setErrno = function (errno) { this.errno = errno; }; this.setErrno(errno); this.message = "FS error"; }; FS.ErrnoError.prototype = new Error; FS.ErrnoError.prototype.constructor = FS.ErrnoError; [44].forEach((function (code) { FS.genericErrors[code] = new FS.ErrnoError(code); FS.genericErrors[code].stack = "<generic error, no stack>"; })); }, staticInit: function () { FS.ensureErrnoError(); FS.nameTable = new Array(4096); FS.mount(MEMFS, {}, "/"); FS.createDefaultDirectories(); FS.createDefaultDevices(); FS.createSpecialDirectories(); FS.filesystems = { "MEMFS": MEMFS }; }, init: function (input, output, error) { FS.init.initialized = true; FS.ensureErrnoError(); Module["stdin"] = input || Module["stdin"]; Module["stdout"] = output || Module["stdout"]; Module["stderr"] = error || Module["stderr"]; FS.createStandardStreams(); }, quit: function () { FS.init.initialized = false; for (var i = 0; i < FS.streams.length; i++) {
                var stream = FS.streams[i];
                if (!stream) {
                    continue;
                }
                FS.close(stream);
            } }, findObject: function (path, dontResolveLastLink) { var ret = FS.analyzePath(path, dontResolveLastLink); if (!ret.exists) {
                return null;
            } return ret.object; }, analyzePath: function (path, dontResolveLastLink) { try {
                var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
                path = lookup.path;
            }
            catch (e) { } var ret = { isRoot: false, exists: false, error: 0, name: null, path: null, object: null, parentExists: false, parentPath: null, parentObject: null }; try {
                var lookup = FS.lookupPath(path, { parent: true });
                ret.parentExists = true;
                ret.parentPath = lookup.path;
                ret.parentObject = lookup.node;
                ret.name = PATH.basename(path);
                lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
                ret.exists = true;
                ret.path = lookup.path;
                ret.object = lookup.node;
                ret.name = lookup.node.name;
                ret.isRoot = lookup.path === "/";
            }
            catch (e) {
                ret.error = e.errno;
            } return ret; }, createPath: function (parent, path, canRead, canWrite) { parent = typeof parent == "string" ? parent : FS.getPath(parent); var parts = path.split("/").reverse(); while (parts.length) {
                var part = parts.pop();
                if (!part)
                    continue;
                var current = PATH.join2(parent, part);
                try {
                    FS.mkdir(current);
                }
                catch (e) { }
                parent = current;
            } return current; }, createFile: function (parent, name, properties, canRead, canWrite) { var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name); var mode = FS_getMode(canRead, canWrite); return FS.create(path, mode); }, createDataFile: function (parent, name, data, canRead, canWrite, canOwn) { var path = name; if (parent) {
                parent = typeof parent == "string" ? parent : FS.getPath(parent);
                path = name ? PATH.join2(parent, name) : parent;
            } var mode = FS_getMode(canRead, canWrite); var node = FS.create(path, mode); if (data) {
                if (typeof data == "string") {
                    var arr = new Array(data.length);
                    for (var i = 0, len = data.length; i < len; ++i)
                        arr[i] = data.charCodeAt(i);
                    data = arr;
                }
                FS.chmod(node, mode | 146);
                var stream = FS.open(node, 577);
                FS.write(stream, data, 0, data.length, 0, canOwn);
                FS.close(stream);
                FS.chmod(node, mode);
            } return node; }, createDevice: function (parent, name, input, output) { var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name); var mode = FS_getMode(!!input, !!output); if (!FS.createDevice.major)
                FS.createDevice.major = 64; var dev = FS.makedev(FS.createDevice.major++, 0); FS.registerDevice(dev, { open: function (stream) { stream.seekable = false; }, close: function (stream) { if (output && output.buffer && output.buffer.length) {
                    output(10);
                } }, read: function (stream, buffer, offset, length, pos) { var bytesRead = 0; for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = input();
                    }
                    catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(6);
                    }
                    if (result === null || result === undefined)
                        break;
                    bytesRead++;
                    buffer[offset + i] = result;
                } if (bytesRead) {
                    stream.node.timestamp = Date.now();
                } return bytesRead; }, write: function (stream, buffer, offset, length, pos) { for (var i = 0; i < length; i++) {
                    try {
                        output(buffer[offset + i]);
                    }
                    catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                } if (length) {
                    stream.node.timestamp = Date.now();
                } return i; } }); return FS.mkdev(path, mode, dev); }, forceLoadFile: function (obj) { if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
                return true; if (typeof XMLHttpRequest != "undefined") {
                throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
            }
            else if (read_) {
                try {
                    obj.contents = intArrayFromString(read_(obj.url), true);
                    obj.usedBytes = obj.contents.length;
                }
                catch (e) {
                    throw new FS.ErrnoError(29);
                }
            }
            else {
                throw new Error("Cannot load without read() or XMLHttpRequest.");
            } }, createLazyFile: function (parent, name, url, canRead, canWrite) { function LazyUint8Array() { this.lengthKnown = false; this.chunks = []; } LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) { if (idx > this.length - 1 || idx < 0) {
                return undefined;
            } var chunkOffset = idx % this.chunkSize; var chunkNum = idx / this.chunkSize | 0; return this.getter(chunkNum)[chunkOffset]; }; LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) { this.getter = getter; }; LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() { var xhr = new XMLHttpRequest; xhr.open("HEAD", url, false); xhr.send(null); if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                throw new Error("Couldn't load " + url + ". Status: " + xhr.status); var datalength = Number(xhr.getResponseHeader("Content-length")); var header; var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes"; var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip"; var chunkSize = 1024 * 1024; if (!hasByteServing)
                chunkSize = datalength; var doXHR = function (from, to) { if (from > to)
                throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!"); if (to > datalength - 1)
                throw new Error("only " + datalength + " bytes available! programmer error!"); var xhr = new XMLHttpRequest; xhr.open("GET", url, false); if (datalength !== chunkSize)
                xhr.setRequestHeader("Range", "bytes=" + from + "-" + to); xhr.responseType = "arraybuffer"; if (xhr.overrideMimeType) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            } xhr.send(null); if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                throw new Error("Couldn't load " + url + ". Status: " + xhr.status); if (xhr.response !== undefined) {
                return new Uint8Array(xhr.response || []);
            } return intArrayFromString(xhr.responseText || "", true); }; var lazyArray = this; lazyArray.setDataGetter((function (chunkNum) { var start = chunkNum * chunkSize; var end = (chunkNum + 1) * chunkSize - 1; end = Math.min(end, datalength - 1); if (typeof lazyArray.chunks[chunkNum] == "undefined") {
                lazyArray.chunks[chunkNum] = doXHR(start, end);
            } if (typeof lazyArray.chunks[chunkNum] == "undefined")
                throw new Error("doXHR failed!"); return lazyArray.chunks[chunkNum]; })); if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                out("LazyFiles on gzip forces download of the whole file when length is accessed");
            } this._length = datalength; this._chunkSize = chunkSize; this.lengthKnown = true; }; if (typeof XMLHttpRequest != "undefined") {
                if (!ENVIRONMENT_IS_WORKER)
                    throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                var lazyArray = new LazyUint8Array;
                Object.defineProperties(lazyArray, { length: { get: function () { if (!this.lengthKnown) {
                            this.cacheLength();
                        } return this._length; } }, chunkSize: { get: function () { if (!this.lengthKnown) {
                            this.cacheLength();
                        } return this._chunkSize; } } });
                var properties = { isDevice: false, contents: lazyArray };
            }
            else {
                var properties = { isDevice: false, url: url };
            } var node = FS.createFile(parent, name, properties, canRead, canWrite); if (properties.contents) {
                node.contents = properties.contents;
            }
            else if (properties.url) {
                node.contents = null;
                node.url = properties.url;
            } Object.defineProperties(node, { usedBytes: { get: function () { return this.contents.length; } } }); var stream_ops = {}; var keys = Object.keys(node.stream_ops); keys.forEach((function (key) { var fn = node.stream_ops[key]; stream_ops[key] = function forceLoadLazyFile() { FS.forceLoadFile(node); return fn.apply(null, arguments); }; })); function writeChunks(stream, buffer, offset, length, position) { var contents = stream.node.contents; if (position >= contents.length)
                return 0; var size = Math.min(contents.length - position, length); if (contents.slice) {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i];
                }
            }
            else {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents.get(position + i);
                }
            } return size; } stream_ops.read = function (stream, buffer, offset, length, position) { FS.forceLoadFile(node); return writeChunks(stream, buffer, offset, length, position); }; stream_ops.mmap = function (stream, length, position, prot, flags) { FS.forceLoadFile(node); var ptr = mmapAlloc(length); if (!ptr) {
                throw new FS.ErrnoError(48);
            } writeChunks(stream, HEAP8, ptr, length, position); return { ptr: ptr, allocated: true }; }; node.stream_ops = stream_ops; return node; } };
        var UTF8ToString = function (ptr, maxBytesToRead) { return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""; };
        var SYSCALLS = { DEFAULT_POLLMASK: 5, calculateAt: function (dirfd, path, allowEmpty) { if (PATH.isAbs(path)) {
                return path;
            } var dir; if (dirfd === -100) {
                dir = FS.cwd();
            }
            else {
                var dirstream = SYSCALLS.getStreamFromFD(dirfd);
                dir = dirstream.path;
            } if (path.length == 0) {
                if (!allowEmpty) {
                    throw new FS.ErrnoError(44);
                }
                return dir;
            } return PATH.join2(dir, path); }, doStat: function (func, path, buf) { try {
                var stat = func(path);
            }
            catch (e) {
                if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
                    return -54;
                }
                throw e;
            } HEAP32[buf >> 2] = stat.dev; HEAP32[buf + 4 >> 2] = stat.mode; HEAPU32[buf + 8 >> 2] = stat.nlink; HEAP32[buf + 12 >> 2] = stat.uid; HEAP32[buf + 16 >> 2] = stat.gid; HEAP32[buf + 20 >> 2] = stat.rdev; tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 24 >> 2] = tempI64[0], HEAP32[buf + 28 >> 2] = tempI64[1]; HEAP32[buf + 32 >> 2] = 4096; HEAP32[buf + 36 >> 2] = stat.blocks; var atime = stat.atime.getTime(); var mtime = stat.mtime.getTime(); var ctime = stat.ctime.getTime(); tempI64 = [Math.floor(atime / 1e3) >>> 0, (tempDouble = Math.floor(atime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1]; HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3; tempI64 = [Math.floor(mtime / 1e3) >>> 0, (tempDouble = Math.floor(mtime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 56 >> 2] = tempI64[0], HEAP32[buf + 60 >> 2] = tempI64[1]; HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3; tempI64 = [Math.floor(ctime / 1e3) >>> 0, (tempDouble = Math.floor(ctime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 72 >> 2] = tempI64[0], HEAP32[buf + 76 >> 2] = tempI64[1]; HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3; tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 88 >> 2] = tempI64[0], HEAP32[buf + 92 >> 2] = tempI64[1]; return 0; }, doMsync: function (addr, stream, len, flags, offset) { if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
            } if (flags & 2) {
                return 0;
            } var buffer = HEAPU8.slice(addr, addr + len); FS.msync(stream, buffer, offset, len, flags); }, varargs: undefined, get: function () { SYSCALLS.varargs += 4; var ret = HEAP32[SYSCALLS.varargs - 4 >> 2]; return ret; }, getStr: function (ptr) { var ret = UTF8ToString(ptr); return ret; }, getStreamFromFD: function (fd) { var stream = FS.getStreamChecked(fd); return stream; } };
        function ___syscall_dup(fd) { try {
            var old = SYSCALLS.getStreamFromFD(fd);
            return FS.createStream(old).fd;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        var setErrNo = function (value) { HEAP32[___errno_location() >> 2] = value; return value; };
        function ___syscall_fcntl64(fd, cmd, varargs) { SYSCALLS.varargs = varargs; try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (cmd) {
                case 0: {
                    var arg = SYSCALLS.get();
                    if (arg < 0) {
                        return -28;
                    }
                    var newStream;
                    newStream = FS.createStream(stream, arg);
                    return newStream.fd;
                }
                case 1:
                case 2: return 0;
                case 3: return stream.flags;
                case 4: {
                    var arg = SYSCALLS.get();
                    stream.flags |= arg;
                    return 0;
                }
                case 5: {
                    var arg = SYSCALLS.get();
                    var offset = 0;
                    HEAP16[arg + offset >> 1] = 2;
                    return 0;
                }
                case 6:
                case 7: return 0;
                case 16:
                case 8: return -28;
                case 9:
                    setErrNo(28);
                    return -1;
                default: {
                    return -28;
                }
            }
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_fstat64(fd, buf) { try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            return SYSCALLS.doStat(FS.stat, stream.path, buf);
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_lstat64(path, buf) { try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.lstat, path, buf);
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_newfstatat(dirfd, path, buf, flags) { try {
            path = SYSCALLS.getStr(path);
            var nofollow = flags & 256;
            var allowEmpty = flags & 4096;
            flags = flags & ~6400;
            path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
            return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_openat(dirfd, path, flags, varargs) { SYSCALLS.varargs = varargs; try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            var mode = varargs ? SYSCALLS.get() : 0;
            return FS.open(path, flags, mode).fd;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        var PIPEFS = { BUCKET_BUFFER_SIZE: 8192, mount: function (mount) { return FS.createNode(null, "/", 16384 | 511, 0); }, createPipe: function () { var pipe = { buckets: [], refcnt: 2 }; pipe.buckets.push({ buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: 0, roffset: 0 }); var rName = PIPEFS.nextname(); var wName = PIPEFS.nextname(); var rNode = FS.createNode(PIPEFS.root, rName, 4096, 0); var wNode = FS.createNode(PIPEFS.root, wName, 4096, 0); rNode.pipe = pipe; wNode.pipe = pipe; var readableStream = FS.createStream({ path: rName, node: rNode, flags: 0, seekable: false, stream_ops: PIPEFS.stream_ops }); rNode.stream = readableStream; var writableStream = FS.createStream({ path: wName, node: wNode, flags: 1, seekable: false, stream_ops: PIPEFS.stream_ops }); wNode.stream = writableStream; return { readable_fd: readableStream.fd, writable_fd: writableStream.fd }; }, stream_ops: { poll: function (stream) { var pipe = stream.node.pipe; if ((stream.flags & 2097155) === 1) {
                    return 256 | 4;
                } if (pipe.buckets.length > 0) {
                    for (var i = 0; i < pipe.buckets.length; i++) {
                        var bucket = pipe.buckets[i];
                        if (bucket.offset - bucket.roffset > 0) {
                            return 64 | 1;
                        }
                    }
                } return 0; }, ioctl: function (stream, request, varargs) { return 28; }, fsync: function (stream) { return 28; }, read: function (stream, buffer, offset, length, position) { var pipe = stream.node.pipe; var currentLength = 0; for (var i = 0; i < pipe.buckets.length; i++) {
                    var bucket = pipe.buckets[i];
                    currentLength += bucket.offset - bucket.roffset;
                } assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer)); var data = buffer.subarray(offset, offset + length); if (length <= 0) {
                    return 0;
                } if (currentLength == 0) {
                    throw new FS.ErrnoError(6);
                } var toRead = Math.min(currentLength, length); var totalRead = toRead; var toRemove = 0; for (var i = 0; i < pipe.buckets.length; i++) {
                    var currBucket = pipe.buckets[i];
                    var bucketSize = currBucket.offset - currBucket.roffset;
                    if (toRead <= bucketSize) {
                        var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
                        if (toRead < bucketSize) {
                            tmpSlice = tmpSlice.subarray(0, toRead);
                            currBucket.roffset += toRead;
                        }
                        else {
                            toRemove++;
                        }
                        data.set(tmpSlice);
                        break;
                    }
                    else {
                        var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
                        data.set(tmpSlice);
                        data = data.subarray(tmpSlice.byteLength);
                        toRead -= tmpSlice.byteLength;
                        toRemove++;
                    }
                } if (toRemove && toRemove == pipe.buckets.length) {
                    toRemove--;
                    pipe.buckets[toRemove].offset = 0;
                    pipe.buckets[toRemove].roffset = 0;
                } pipe.buckets.splice(0, toRemove); return totalRead; }, write: function (stream, buffer, offset, length, position) { var pipe = stream.node.pipe; assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer)); var data = buffer.subarray(offset, offset + length); var dataLen = data.byteLength; if (dataLen <= 0) {
                    return 0;
                } var currBucket = null; if (pipe.buckets.length == 0) {
                    currBucket = { buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: 0, roffset: 0 };
                    pipe.buckets.push(currBucket);
                }
                else {
                    currBucket = pipe.buckets[pipe.buckets.length - 1];
                } assert(currBucket.offset <= PIPEFS.BUCKET_BUFFER_SIZE); var freeBytesInCurrBuffer = PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset; if (freeBytesInCurrBuffer >= dataLen) {
                    currBucket.buffer.set(data, currBucket.offset);
                    currBucket.offset += dataLen;
                    return dataLen;
                }
                else if (freeBytesInCurrBuffer > 0) {
                    currBucket.buffer.set(data.subarray(0, freeBytesInCurrBuffer), currBucket.offset);
                    currBucket.offset += freeBytesInCurrBuffer;
                    data = data.subarray(freeBytesInCurrBuffer, data.byteLength);
                } var numBuckets = data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE | 0; var remElements = data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE; for (var i = 0; i < numBuckets; i++) {
                    var newBucket = { buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: PIPEFS.BUCKET_BUFFER_SIZE, roffset: 0 };
                    pipe.buckets.push(newBucket);
                    newBucket.buffer.set(data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE));
                    data = data.subarray(PIPEFS.BUCKET_BUFFER_SIZE, data.byteLength);
                } if (remElements > 0) {
                    var newBucket = { buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: data.byteLength, roffset: 0 };
                    pipe.buckets.push(newBucket);
                    newBucket.buffer.set(data);
                } return dataLen; }, close: function (stream) { var pipe = stream.node.pipe; pipe.refcnt--; if (pipe.refcnt === 0) {
                    pipe.buckets = null;
                } } }, nextname: function () { if (!PIPEFS.nextname.current) {
                PIPEFS.nextname.current = 0;
            } return "pipe[" + PIPEFS.nextname.current++ + "]"; } };
        function ___syscall_pipe(fdPtr) { try {
            if (fdPtr == 0) {
                throw new FS.ErrnoError(21);
            }
            var res = PIPEFS.createPipe();
            HEAP32[fdPtr >> 2] = res.readable_fd;
            HEAP32[fdPtr + 4 >> 2] = res.writable_fd;
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_poll(fds, nfds, timeout) { try {
            var nonzero = 0;
            for (var i = 0; i < nfds; i++) {
                var pollfd = fds + 8 * i;
                var fd = HEAP32[pollfd >> 2];
                var events = HEAP16[pollfd + 4 >> 1];
                var mask = 32;
                var stream = FS.getStream(fd);
                if (stream) {
                    mask = SYSCALLS.DEFAULT_POLLMASK;
                    if (stream.stream_ops.poll) {
                        mask = stream.stream_ops.poll(stream, -1);
                    }
                }
                mask &= events | 8 | 16;
                if (mask)
                    nonzero++;
                HEAP16[pollfd + 6 >> 1] = mask;
            }
            return nonzero;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        function ___syscall_stat64(path, buf) { try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.stat, path, buf);
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return -e.errno;
        } }
        var isLeapYear = function (year) { return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0); };
        var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var ydayFromDate = function (date) { var leap = isLeapYear(date.getFullYear()); var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE; var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1; return yday; };
        function convertI32PairToI53Checked(lo, hi) { return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN; }
        function __localtime_js(time_low, time_high, tmPtr) { var time = convertI32PairToI53Checked(time_low, time_high); var date = new Date(time * 1e3); HEAP32[tmPtr >> 2] = date.getSeconds(); HEAP32[tmPtr + 4 >> 2] = date.getMinutes(); HEAP32[tmPtr + 8 >> 2] = date.getHours(); HEAP32[tmPtr + 12 >> 2] = date.getDate(); HEAP32[tmPtr + 16 >> 2] = date.getMonth(); HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900; HEAP32[tmPtr + 24 >> 2] = date.getDay(); var yday = ydayFromDate(date) | 0; HEAP32[tmPtr + 28 >> 2] = yday; HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60); var start = new Date(date.getFullYear(), 0, 1); var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset(); var winterOffset = start.getTimezoneOffset(); var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0; HEAP32[tmPtr + 32 >> 2] = dst; }
        var __mktime_js = function (tmPtr) { var ret = (function () { var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0); var dst = HEAP32[tmPtr + 32 >> 2]; var guessedOffset = date.getTimezoneOffset(); var start = new Date(date.getFullYear(), 0, 1); var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset(); var winterOffset = start.getTimezoneOffset(); var dstOffset = Math.min(winterOffset, summerOffset); if (dst < 0) {
            HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
        }
        else if (dst > 0 != (dstOffset == guessedOffset)) {
            var nonDstOffset = Math.max(winterOffset, summerOffset);
            var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
            date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
        } HEAP32[tmPtr + 24 >> 2] = date.getDay(); var yday = ydayFromDate(date) | 0; HEAP32[tmPtr + 28 >> 2] = yday; HEAP32[tmPtr >> 2] = date.getSeconds(); HEAP32[tmPtr + 4 >> 2] = date.getMinutes(); HEAP32[tmPtr + 8 >> 2] = date.getHours(); HEAP32[tmPtr + 12 >> 2] = date.getDate(); HEAP32[tmPtr + 16 >> 2] = date.getMonth(); HEAP32[tmPtr + 20 >> 2] = date.getYear(); return date.getTime() / 1e3; })(); return setTempRet0((tempDouble = ret, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)), ret >>> 0; };
        var __timegm_js = function (tmPtr) { var ret = (function () { var time = Date.UTC(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0); var date = new Date(time); HEAP32[tmPtr + 24 >> 2] = date.getUTCDay(); var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0); var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0; HEAP32[tmPtr + 28 >> 2] = yday; return date.getTime() / 1e3; })(); return setTempRet0((tempDouble = ret, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)), ret >>> 0; };
        var stringToUTF8 = function (str, outPtr, maxBytesToWrite) { return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite); };
        var stringToNewUTF8 = function (str) { var size = lengthBytesUTF8(str) + 1; var ret = _malloc(size); if (ret)
            stringToUTF8(str, ret, size); return ret; };
        var __tzset_js = function (timezone, daylight, tzname) { var currentYear = (new Date).getFullYear(); var winter = new Date(currentYear, 0, 1); var summer = new Date(currentYear, 6, 1); var winterOffset = winter.getTimezoneOffset(); var summerOffset = summer.getTimezoneOffset(); var stdTimezoneOffset = Math.max(winterOffset, summerOffset); HEAPU32[timezone >> 2] = stdTimezoneOffset * 60; HEAP32[daylight >> 2] = Number(winterOffset != summerOffset); function extractZone(date) { var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/); return match ? match[1] : "GMT"; } var winterName = extractZone(winter); var summerName = extractZone(summer); var winterNamePtr = stringToNewUTF8(winterName); var summerNamePtr = stringToNewUTF8(summerName); if (summerOffset < winterOffset) {
            HEAPU32[tzname >> 2] = winterNamePtr;
            HEAPU32[tzname + 4 >> 2] = summerNamePtr;
        }
        else {
            HEAPU32[tzname >> 2] = summerNamePtr;
            HEAPU32[tzname + 4 >> 2] = winterNamePtr;
        } };
        var _abort = function () { abort(""); };
        var _emscripten_memcpy_big = function (dest, src, num) { return HEAPU8.copyWithin(dest, src, src + num); };
        var getHeapMax = function () { return 2147483648; };
        var growMemory = function (size) { var b = wasmMemory.buffer; var pages = size - b.byteLength + 65535 >>> 16; try {
            wasmMemory.grow(pages);
            updateMemoryViews();
            return 1;
        }
        catch (e) { } };
        var _emscripten_resize_heap = function (requestedSize) { var oldSize = HEAPU8.length; requestedSize >>>= 0; var maxHeapSize = getHeapMax(); if (requestedSize > maxHeapSize) {
            return false;
        } var alignUp = function (x, multiple) { return x + (multiple - x % multiple) % multiple; }; for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
            var replacement = growMemory(newSize);
            if (replacement) {
                return true;
            }
        } return false; };
        var ENV = {};
        var getExecutableName = function () { return thisProgram || "./this.program"; };
        var getEnvStrings = function () { if (!getEnvStrings.strings) {
            var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
            var env = { "USER": "web_user", "LOGNAME": "web_user", "PATH": "/", "PWD": "/", "HOME": "/home/web_user", "LANG": lang, "_": getExecutableName() };
            for (var x in ENV) {
                if (ENV[x] === undefined)
                    delete env[x];
                else
                    env[x] = ENV[x];
            }
            var strings = [];
            for (var x in env) {
                strings.push("".concat(x, "=").concat(env[x]));
            }
            getEnvStrings.strings = strings;
        } return getEnvStrings.strings; };
        var stringToAscii = function (str, buffer) { for (var i = 0; i < str.length; ++i) {
            HEAP8[buffer++ >> 0] = str.charCodeAt(i);
        } HEAP8[buffer >> 0] = 0; };
        var _environ_get = function (__environ, environ_buf) { var bufSize = 0; getEnvStrings().forEach((function (string, i) { var ptr = environ_buf + bufSize; HEAPU32[__environ + i * 4 >> 2] = ptr; stringToAscii(string, ptr); bufSize += string.length + 1; })); return 0; };
        var _environ_sizes_get = function (penviron_count, penviron_buf_size) { var strings = getEnvStrings(); HEAPU32[penviron_count >> 2] = strings.length; var bufSize = 0; strings.forEach((function (string) { bufSize += string.length + 1; })); HEAPU32[penviron_buf_size >> 2] = bufSize; return 0; };
        var _proc_exit = function (code) { EXITSTATUS = code; if (!keepRuntimeAlive()) {
            if (Module["onExit"])
                Module["onExit"](code);
            ABORT = true;
        } quit_(code, new ExitStatus(code)); };
        var exitJS = function (status, implicit) { EXITSTATUS = status; _proc_exit(status); };
        var _exit = exitJS;
        function _fd_close(fd) { try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.close(stream);
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return e.errno;
        } }
        var doReadv = function (stream, iov, iovcnt, offset) { var ret = 0; for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
                return -1;
            ret += curr;
            if (curr < len)
                break;
            if (typeof offset !== "undefined") {
                offset += curr;
            }
        } return ret; };
        function _fd_read(fd, iov, iovcnt, pnum) { try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doReadv(stream, iov, iovcnt);
            HEAPU32[pnum >> 2] = num;
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return e.errno;
        } }
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) { var offset = convertI32PairToI53Checked(offset_low, offset_high); try {
            if (isNaN(offset))
                return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.llseek(stream, offset, whence);
            tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
            if (stream.getdents && offset === 0 && whence === 0)
                stream.getdents = null;
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return e.errno;
        } }
        var doWritev = function (stream, iov, iovcnt, offset) { var ret = 0; for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
                return -1;
            ret += curr;
            if (typeof offset !== "undefined") {
                offset += curr;
            }
        } return ret; };
        function _fd_write(fd, iov, iovcnt, pnum) { try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doWritev(stream, iov, iovcnt);
            HEAPU32[pnum >> 2] = num;
            return 0;
        }
        catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                throw e;
            return e.errno;
        } }
        function getCFunc(ident) { var func = Module["_" + ident]; return func; }
        var writeArrayToMemory = function (array, buffer) { HEAP8.set(array, buffer); };
        var stringToUTF8OnStack = function (str) { var size = lengthBytesUTF8(str) + 1; var ret = stackAlloc(size); stringToUTF8(str, ret, size); return ret; };
        var ccall = function (ident, returnType, argTypes, args, opts) { var toC = { "string": function (str) { var ret = 0; if (str !== null && str !== undefined && str !== 0) {
                ret = stringToUTF8OnStack(str);
            } return ret; }, "array": function (arr) { var ret = stackAlloc(arr.length); writeArrayToMemory(arr, ret); return ret; } }; function convertReturnValue(ret) { if (returnType === "string") {
            return UTF8ToString(ret);
        } if (returnType === "boolean")
            return Boolean(ret); return ret; } var func = getCFunc(ident); var cArgs = []; var stack = 0; if (args) {
            for (var i = 0; i < args.length; i++) {
                var converter = toC[argTypes[i]];
                if (converter) {
                    if (stack === 0)
                        stack = stackSave();
                    cArgs[i] = converter(args[i]);
                }
                else {
                    cArgs[i] = args[i];
                }
            }
        } var ret = func.apply(null, cArgs); function onDone(ret) { if (stack !== 0)
            stackRestore(stack); return convertReturnValue(ret); } ret = onDone(ret); return ret; };
        var cwrap = function (ident, returnType, argTypes, opts) { var numericArgs = !argTypes || argTypes.every((function (type) { return type === "number" || type === "boolean"; })); var numericRet = returnType !== "string"; if (numericRet && numericArgs && !opts) {
            return getCFunc(ident);
        } return function () { return ccall(ident, returnType, argTypes, arguments, opts); }; };
        var FSNode = function (parent, name, mode, rdev) { if (!parent) {
            parent = this;
        } this.parent = parent; this.mount = parent.mount; this.mounted = null; this.id = FS.nextInode++; this.name = name; this.mode = mode; this.node_ops = {}; this.stream_ops = {}; this.rdev = rdev; };
        var readMode = 292 | 73;
        var writeMode = 146;
        Object.defineProperties(FSNode.prototype, { read: { get: function () { return (this.mode & readMode) === readMode; }, set: function (val) { val ? this.mode |= readMode : this.mode &= ~readMode; } }, write: { get: function () { return (this.mode & writeMode) === writeMode; }, set: function (val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; } }, isFolder: { get: function () { return FS.isDir(this.mode); } }, isDevice: { get: function () { return FS.isChrdev(this.mode); } } });
        FS.FSNode = FSNode;
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.staticInit();
        var wasmImports = { i: ___syscall_dup, a: ___syscall_fcntl64, v: ___syscall_fstat64, s: ___syscall_lstat64, t: ___syscall_newfstatat, w: ___syscall_openat, r: ___syscall_pipe, q: ___syscall_poll, u: ___syscall_stat64, k: __localtime_js, l: __mktime_js, m: __timegm_js, p: __tzset_js, d: _abort, h: _emscripten_memcpy_big, o: _emscripten_resize_heap, f: _environ_get, g: _environ_sizes_get, e: _exit, c: _fd_close, j: _fd_read, n: _fd_seek, b: _fd_write };
        var asm = createWasm();
        var ___wasm_call_ctors = function () { return (___wasm_call_ctors = Module["asm"]["y"]).apply(null, arguments); };
        var _archive_read_new_memory = Module["_archive_read_new_memory"] = function () { return (_archive_read_new_memory = Module["_archive_read_new_memory"] = Module["asm"]["z"]).apply(null, arguments); };
        var _archive_read_new = Module["_archive_read_new"] = function () { return (_archive_read_new = Module["_archive_read_new"] = Module["asm"]["A"]).apply(null, arguments); };
        var _archive_read_support_filter_all = Module["_archive_read_support_filter_all"] = function () { return (_archive_read_support_filter_all = Module["_archive_read_support_filter_all"] = Module["asm"]["B"]).apply(null, arguments); };
        var _archive_read_support_format_all = Module["_archive_read_support_format_all"] = function () { return (_archive_read_support_format_all = Module["_archive_read_support_format_all"] = Module["asm"]["C"]).apply(null, arguments); };
        var _archive_read_add_passphrase = Module["_archive_read_add_passphrase"] = function () { return (_archive_read_add_passphrase = Module["_archive_read_add_passphrase"] = Module["asm"]["D"]).apply(null, arguments); };
        var _archive_read_open_memory = Module["_archive_read_open_memory"] = function () { return (_archive_read_open_memory = Module["_archive_read_open_memory"] = Module["asm"]["E"]).apply(null, arguments); };
        var _archive_read_next_entry = Module["_archive_read_next_entry"] = function () { return (_archive_read_next_entry = Module["_archive_read_next_entry"] = Module["asm"]["F"]).apply(null, arguments); };
        var _archive_entry_ctime = Module["_archive_entry_ctime"] = function () { return (_archive_entry_ctime = Module["_archive_entry_ctime"] = Module["asm"]["H"]).apply(null, arguments); };
        var _archive_entry_filetype = Module["_archive_entry_filetype"] = function () { return (_archive_entry_filetype = Module["_archive_entry_filetype"] = Module["asm"]["I"]).apply(null, arguments); };
        var _archive_entry_hardlink_utf8 = Module["_archive_entry_hardlink_utf8"] = function () { return (_archive_entry_hardlink_utf8 = Module["_archive_entry_hardlink_utf8"] = Module["asm"]["J"]).apply(null, arguments); };
        var _archive_entry_mtime = Module["_archive_entry_mtime"] = function () { return (_archive_entry_mtime = Module["_archive_entry_mtime"] = Module["asm"]["K"]).apply(null, arguments); };
        var _archive_entry_pathname_utf8 = Module["_archive_entry_pathname_utf8"] = function () { return (_archive_entry_pathname_utf8 = Module["_archive_entry_pathname_utf8"] = Module["asm"]["L"]).apply(null, arguments); };
        var _archive_entry_size = Module["_archive_entry_size"] = function () { return (_archive_entry_size = Module["_archive_entry_size"] = Module["asm"]["M"]).apply(null, arguments); };
        var _archive_entry_symlink_utf8 = Module["_archive_entry_symlink_utf8"] = function () { return (_archive_entry_symlink_utf8 = Module["_archive_entry_symlink_utf8"] = Module["asm"]["N"]).apply(null, arguments); };
        var _archive_entry_is_encrypted = Module["_archive_entry_is_encrypted"] = function () { return (_archive_entry_is_encrypted = Module["_archive_entry_is_encrypted"] = Module["asm"]["O"]).apply(null, arguments); };
        var _free = Module["_free"] = function () { return (_free = Module["_free"] = Module["asm"]["P"]).apply(null, arguments); };
        var ___errno_location = function () { return (___errno_location = Module["asm"]["Q"]).apply(null, arguments); };
        var _malloc = Module["_malloc"] = function () { return (_malloc = Module["_malloc"] = Module["asm"]["R"]).apply(null, arguments); };
        var _archive_read_has_encrypted_entries = Module["_archive_read_has_encrypted_entries"] = function () { return (_archive_read_has_encrypted_entries = Module["_archive_read_has_encrypted_entries"] = Module["asm"]["S"]).apply(null, arguments); };
        var _archive_read_data = Module["_archive_read_data"] = function () { return (_archive_read_data = Module["_archive_read_data"] = Module["asm"]["T"]).apply(null, arguments); };
        var _archive_read_data_skip = Module["_archive_read_data_skip"] = function () { return (_archive_read_data_skip = Module["_archive_read_data_skip"] = Module["asm"]["U"]).apply(null, arguments); };
        var _archive_version_number = Module["_archive_version_number"] = function () { return (_archive_version_number = Module["_archive_version_number"] = Module["asm"]["V"]).apply(null, arguments); };
        var _archive_version_string = Module["_archive_version_string"] = function () { return (_archive_version_string = Module["_archive_version_string"] = Module["asm"]["W"]).apply(null, arguments); };
        var _archive_error_string = Module["_archive_error_string"] = function () { return (_archive_error_string = Module["_archive_error_string"] = Module["asm"]["X"]).apply(null, arguments); };
        var _archive_version_details = Module["_archive_version_details"] = function () { return (_archive_version_details = Module["_archive_version_details"] = Module["asm"]["Y"]).apply(null, arguments); };
        var _archive_read_free = Module["_archive_read_free"] = function () { return (_archive_read_free = Module["_archive_read_free"] = Module["asm"]["Z"]).apply(null, arguments); };
        var setTempRet0 = function () { return (setTempRet0 = Module["asm"]["_"]).apply(null, arguments); };
        var stackSave = function () { return (stackSave = Module["asm"]["$"]).apply(null, arguments); };
        var stackRestore = function () { return (stackRestore = Module["asm"]["aa"]).apply(null, arguments); };
        var stackAlloc = function () { return (stackAlloc = Module["asm"]["ba"]).apply(null, arguments); };
        Module["cwrap"] = cwrap;
        var calledRun;
        dependenciesFulfilled = function runCaller() { if (!calledRun)
            run(); if (!calledRun)
            dependenciesFulfilled = runCaller; };
        function run() { if (runDependencies > 0) {
            return;
        } preRun(); if (runDependencies > 0) {
            return;
        } function doRun() { if (calledRun)
            return; calledRun = true; Module["calledRun"] = true; if (ABORT)
            return; initRuntime(); readyPromiseResolve(Module); if (Module["onRuntimeInitialized"])
            Module["onRuntimeInitialized"](); postRun(); } if (Module["setStatus"]) {
            Module["setStatus"]("Running...");
            setTimeout((function () { setTimeout((function () { Module["setStatus"](""); }), 1); doRun(); }), 1);
        }
        else {
            doRun();
        } }
        if (Module["preInit"]) {
            if (typeof Module["preInit"] == "function")
                Module["preInit"] = [Module["preInit"]];
            while (Module["preInit"].length > 0) {
                Module["preInit"].pop()();
            }
        }
        run();
        return moduleArg.ready;
    });
})();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = libarchive;
else if (typeof define === 'function' && define['amd'])
    define([], function () { return libarchive; });
