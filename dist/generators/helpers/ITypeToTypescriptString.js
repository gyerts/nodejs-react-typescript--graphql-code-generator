"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITypeToTypescriptString = function (name, t) {
    return "" + name + (t.nullable ? '?' : '') + ": " + t.name + (t.array ? '[]' : '') + ";";
};
