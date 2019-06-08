"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @return ("${param1}", "${param2}")
 * */
exports.genMethodParams = function (params) {
    var output = '';
    params.map(function (p) {
        output += "" + p.name + (p.type.nullable ? '?' : '') + ": " + p.type.name + (p.type.array ? '[]' : '') + ", ";
    });
    return output.slice(0, output.length - 2);
};
exports.genMethodParamsWithPrefix = function (params) {
    var output = '';
    params.map(function (p) {
        output += "" + p.name + (p.param.type.nullable ? '?' : '') + ": " + p.param.type.name + (p.param.type.array ? '[]' : '') + ", ";
    });
    return output.slice(0, output.length - 2);
};
