"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterface = function (interfaceName, allInterfaces) {
    var foundInterface = allInterfaces.find(function (i) { return i.name === interfaceName; });
    if (!foundInterface) {
        console.trace();
        throw "'" + interfaceName + "' not found in list of interfaces: [" + allInterfaces.map(function (i) { return i.name; }) + "]";
    }
    return foundInterface;
};
