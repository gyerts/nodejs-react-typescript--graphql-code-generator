"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var settings_1 = require("../../../settings");
var InterfacesWalker_1 = require("../../../classes/InterfacesWalker");
var genResponseInterface_1 = require("../../helpers/genResponseInterface");
var genInterface_1 = require("../../helpers/genInterface");
var genNames_1 = require("../../server/generators/genNames");
var renderInterface = function (op, allInterfaces) { return "\nexport interface " + op.type.name + " {\n   " + genInterface_1.genInterface(op.type, allInterfaces, '   ') + "}\n"; };
var renderResponseInterface = function (op, allInterfaces) { return "\nexport namespace " + genNames_1.getNamespaceName(op) + " {\n   export interface " + op.type.name + "Response {\n      " + genResponseInterface_1.genResponseInterface(op) + "\n   }\n}\n"; };
exports.generateInterfacesFile = function (allInterfaces, globalInterfaceName) {
    var output = '';
    var handledInterfaceNames = [];
    var handler = function (breadcrumbName, ownParams, op) {
        if (!handledInterfaceNames.includes(op.type.name)) {
            handledInterfaceNames.push(op.type.name);
            output += renderInterface(op, allInterfaces);
        }
        output += renderResponseInterface(op, allInterfaces);
    };
    var walker = new InterfacesWalker_1.InterfacesWalker(globalInterfaceName, allInterfaces, handler);
    walker.run();
    fs_1.default.writeFile(settings_1.options.clientOutDir.get() + '/' + "query.interfaces.ts", output, function (err) {
        if (err) {
            return console.error(err);
        }
    });
};
