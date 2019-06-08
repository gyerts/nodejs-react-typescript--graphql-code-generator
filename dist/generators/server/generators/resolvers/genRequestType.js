"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ITypeToTypescriptString_1 = require("../../../helpers/ITypeToTypescriptString");
var genNames_1 = require("../genNames");
var _ = "\n";
var ___ = "\n   ";
var ______ = "\n      ";
exports.genRequestType = function (queryType, interfaceName, parentInterfaceName, ownParams, op) {
    var output = '';
    output = "export type " + interfaceName + " = {";
    output += ___ + "_ctx_: " + genNames_1.getRouteContextName(op) + ";";
    if (parentInterfaceName !== queryType) {
        output += ___ + "_parent_: " + genNames_1.getPrimitiveName(parentInterfaceName) + ";";
    }
    ownParams.map(function (p) {
        output += "" + ___ + ITypeToTypescriptString_1.ITypeToTypescriptString(p.name, p.type);
    });
    output += _ + "};";
    output += "" + _;
    return output;
};
