"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InterfacesWalker_1 = require("../../../classes/InterfacesWalker");
var genInterface_1 = require("../../helpers/genInterface");
var renderInterface = function (op, allInterfaces) { return "\nexport interface " + op.type.name + " {\n   " + genInterface_1.genInterface(op.type, allInterfaces, '   ') + "}\n"; };
var tab_space = '   ';
exports.genInterfaces = function (allInterfaces, globalInterfaceName) {
    var output = '';
    var handledInterfaceNames = [];
    var handler = function (breadcrumbName, ownParams, op) {
        var __ = '\n' + tab_space.repeat(op.breadcrumbs.length);
        var ____ = '\n' + tab_space.repeat(op.breadcrumbs.length + 1);
        if (!handledInterfaceNames.includes(op.type.name)) {
            handledInterfaceNames.push(op.type.name);
            output += renderInterface(op, allInterfaces);
        }
    };
    var walker = new InterfacesWalker_1.InterfacesWalker(globalInterfaceName, allInterfaces, handler);
    walker.run();
    return output;
};
