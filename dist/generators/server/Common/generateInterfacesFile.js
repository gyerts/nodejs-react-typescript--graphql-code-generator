"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../../settings");
var fs_1 = __importDefault(require("fs"));
var InterfacesWalker_1 = require("../../../classes/InterfacesWalker");
var getInterface_1 = require("../../helpers/getInterface");
var genMethodParams_1 = require("../../helpers/genMethodParams");
var helpers_1 = require("../../../helpers");
var _ = "\n";
var ___ = "\n   ";
var ______ = "\n      ";
var gen = function (breadcrumbName, ownParams, op, forClientOnly, allInterfaces) {
    var output = '';
    var lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
    var i = getInterface_1.getInterface(lastB.interfaceName, allInterfaces);
    var primitiveMembers = i.members.filter(function (m) { return helpers_1.primitiveTypes.includes(m.type.name); });
    var complexMembers = i.members.filter(function (m) { return !helpers_1.primitiveTypes.includes(m.type.name); });
    output += _ + "export namespace internal {";
    output += ___ + "export type " + lastB.interfaceName + " = {";
    i.methods.map(function (m) {
        output += "" + ______ + m.name + "?: (req: any, " + genMethodParams_1.genMethodParams(m.params) + ") => internal." + m.returnValues[0].name + (m.returnValues[0].array ? '[]' : '');
    });
    complexMembers.map(function (m) {
        output += "" + ______ + m.name + "?: (req: any) => internal." + m.type.name + (m.type.array ? '[]' : '');
    });
    output += ___ + "};";
    output += _ + "}";
    output += _ + "export namespace external {";
    output += ___ + "export type " + lastB.interfaceName + "Primitives = {";
    primitiveMembers.map(function (m) {
        output += "" + ______ + m.name + ": " + m.type.name + (m.type.array ? '[]' : '');
    });
    output += ___ + "};";
    output += _ + "}";
    return output;
};
exports.generateInterfacesFile = function (allInterfaces) {
    var requestFilePath = settings_1.options.serverOutDir.get() + "/interfaces.ts";
    var output = '';
    var handledInterfaceNames = [];
    var handler = function (breadcrumbName, ownParams, op, forClientOnly) {
        if (!forClientOnly) {
            var lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
            if (!handledInterfaceNames.includes(lastB.interfaceName)) {
                handledInterfaceNames.push(lastB.interfaceName);
                output += gen(breadcrumbName, ownParams, op, forClientOnly, allInterfaces);
            }
        }
    };
    {
        var walker = new InterfacesWalker_1.InterfacesWalker('IQuery', allInterfaces, handler);
        walker.run();
    }
    {
        var walker = new InterfacesWalker_1.InterfacesWalker('IMutation', allInterfaces, handler);
        walker.run();
    }
    {
        var walker = new InterfacesWalker_1.InterfacesWalker('ISubscription', allInterfaces, handler);
        walker.run();
    }
    fs_1.default.writeFile(requestFilePath, output, function (err) {
        if (err) {
            return console.error(err);
        }
    });
};
