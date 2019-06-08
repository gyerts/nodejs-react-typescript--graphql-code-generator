"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getInterface_1 = require("./getInterface");
var helpers_1 = require("../../helpers");
exports.getInterfacePrimitiveTypes = function (interfaceName, allInterfaces) {
    var currentInterface = getInterface_1.getInterface(interfaceName, allInterfaces);
    var allPrimitiveInterfaceTypes = [];
    currentInterface.members.map(function (m) {
        if (helpers_1.primitiveTypes.includes(m.type.name)) {
            allPrimitiveInterfaceTypes.push(m);
        }
    });
    return allPrimitiveInterfaceTypes;
};
