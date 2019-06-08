"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var genNames_1 = require("../genNames");
var _ = "\n";
var ___ = "\n   ";
var ______ = "\n      ";
exports.genInterfaceImplCallback = function (name, returnInterfaceName, isArray) {
    var output = "";
    if (isArray) {
        output += _ + "export type I" + name + "ImplCallback = (";
        output += ___ + "req: I" + name + "RequestType,";
        output += _ + ") => " + genNames_1.getPrimitiveName(returnInterfaceName) + "[];";
        output += "" + _;
    }
    else {
        output += _ + "export type I" + name + "ImplCallback = (";
        output += ___ + "req: I" + name + "RequestType,";
        output += ___ + "overrides: internal." + returnInterfaceName;
        output += _ + ") => " + genNames_1.getPrimitiveName(returnInterfaceName) + ";";
        output += "" + _;
    }
    return output;
};
