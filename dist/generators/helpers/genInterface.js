"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getInterface_1 = require("./getInterface");
var helpers_1 = require("../../helpers");
var ITypeToTypescriptString_1 = require("./ITypeToTypescriptString");
exports.genInterface = function (type, allInterfaces, tab) {
    var output = '';
    var currentInterface = getInterface_1.getInterface(type.name, allInterfaces);
    currentInterface.members.map(function (m) {
        output += "" + tab + ITypeToTypescriptString_1.ITypeToTypescriptString(m.name, m.type);
        output += '\n';
    });
    currentInterface.methods.map(function (m) {
        output += "" + tab + ITypeToTypescriptString_1.ITypeToTypescriptString(m.name, m.returnValues[0]);
        output += '\n';
    });
    return output;
};
exports.genInterfaceForGQLSchema = function (type, allInterfaces, ___) {
    var output = '';
    var currentInterface = getInterface_1.getInterface(type.name, allInterfaces);
    currentInterface.members.map(function (m) {
        output += "" + ___ + m.name + ": " + helpers_1.typeToGQLString(m.type);
    });
    currentInterface.methods.map(function (m) {
        output += "" + ___ + m.name;
        if (m.params.length) {
            output += '(';
            output += m.params.map(function (p) { return p.name + ": " + helpers_1.typeToGQLString(p.type); }).join(', ');
            output += ')';
        }
        else {
        }
        output += ": " + helpers_1.typeToGQLString(m.returnValues[0]);
    });
    return output;
};
