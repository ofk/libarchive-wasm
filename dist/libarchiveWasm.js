"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.libarchiveWasm = void 0;
var libarchive_1 = __importDefault(require("./libarchive"));
var wrapLibarchiveWasm_1 = require("./wrapLibarchiveWasm");
function libarchiveWasm() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new Promise(function (resolve) {
        libarchive_1.default.apply(void 0, args).then(function (mod) {
            resolve((0, wrapLibarchiveWasm_1.wrapLibarchiveWasm)(mod));
        });
    });
}
exports.libarchiveWasm = libarchiveWasm;
