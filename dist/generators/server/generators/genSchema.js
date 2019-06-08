"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InterfacesWalker_1 = require("../../../classes/InterfacesWalker");
var genInterface_1 = require("../../helpers/genInterface");
var tab = '   ';
var _ = '\n';
var __ = '\n' + tab.repeat(1);
var ____ = '\n' + tab.repeat(2);
var addInterfaceToSchema = function (interfaceName, allInterfaces, type) {
    var output = '';
    if (['IQuery', 'IMutation', 'ISubscription'].includes(interfaceName)) {
        output += _ + "type " + interfaceName.slice(1) + " {";
    }
    else {
        output += _ + "type " + interfaceName + " {";
    }
    output += "" + genInterface_1.genInterfaceForGQLSchema(type, allInterfaces, __);
    output += _ + "}";
    return output;
};
exports.genSchema = function (queryType, mainInterfaceName, allInterfaces) {
    var output = '';
    var handledInterfaceNames = [];
    output += addInterfaceToSchema(mainInterfaceName, allInterfaces, { name: mainInterfaceName, array: false, nullable: false });
    var handler = function (breadcrumbName, ownParams, op, forClientOnly) {
        if (!forClientOnly) {
            var interfaceName = op.type.name === mainInterfaceName ? op.type.name.slice(1) : op.type.name;
            if (!handledInterfaceNames.includes(interfaceName)) {
                handledInterfaceNames.push(interfaceName);
                output += addInterfaceToSchema(interfaceName, allInterfaces, op.type);
            }
        }
    };
    var walker = new InterfacesWalker_1.InterfacesWalker(mainInterfaceName, allInterfaces, handler);
    walker.run();
    return output.trim();
};
