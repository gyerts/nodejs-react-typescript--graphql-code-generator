"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var breadcrumbsToCapitalName_1 = require("../../helpers/breadcrumbsToCapitalName");
var genInterfacePrimitiveTypes_1 = require("../../helpers/genInterfacePrimitiveTypes");
exports.genDummyFile = function (queryType, op, allInterfaces) {
    var __ = "\n   ";
    var ____ = "\n      ";
    var output = "";
    var bName = op.breadcrumbs.map(function (b) { return b.name; }).join('_') + '_delegate';
    var bPath = op.breadcrumbs.map(function (b) { return b.name; });
    var lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
    var isArray = lastB.type.array;
    var interfaceType = lastB.type.name;
    var returnType = "Promise< external." + interfaceType + "Primitives" + (isArray ? '[]' : '') + " >";
    var requestType = "I" + breadcrumbsToCapitalName_1.breadcrumbsToCapitalName(op.breadcrumbs) + "RequestType";
    output += "import {external, internal} from '../interfaces';";
    output += "\nimport { " + requestType + " } from '../" + queryType + ".routes';";
    output += "\n\n/**\n";
    output += " * this is dummy implementation of node, you need to place this file\n";
    output += " * to the dir with all file-impls, and add your own implementation\n";
    output += " * */\n";
    output += "\nexport const " + lastB.name + "Impl = async (req: " + requestType + ", overrides: internal." + interfaceType + "): " + returnType + " => {";
    // output += `${__}console.warn('dummy impl of "${lastB.name}Impl" resolver');`;
    output += __ + "console.log('" + lastB.name + "Impl =====================================');";
    output += __ + "console.log(JSON.stringify(req, null, 3));";
    output += __ + "console.log(overrides);";
    output += __ + "return Promise.resolve(" + (isArray ? '[{' : '{');
    genInterfacePrimitiveTypes_1.getInterfacePrimitiveTypes(interfaceType, allInterfaces).map(function (p) {
        output += "" + ____ + p.name + ": ";
        if (p.type.array) {
            switch (p.type.name) {
                case 'string': {
                    output += '[\'some string 1\', \'some string 2\'],';
                    break;
                }
                case 'number': {
                    output += '[0, 1, 2, 3, 4],';
                    break;
                }
                case 'boolean': {
                    output += '[true, false, true, false, true],';
                    break;
                }
                default: {
                    output += p.type.name;
                }
            }
        }
        else {
            switch (p.type.name) {
                case 'string': {
                    output += '\'some string 1\',';
                    break;
                }
                case 'number': {
                    output += '0,';
                    break;
                }
                case 'boolean': {
                    output += 'true,';
                    break;
                }
                default: {
                    output += p.type.name;
                }
            }
        }
    });
    isArray ? (output += __ + "}]);") : (output += __ + "});");
    output += "\n};\n";
    return output;
};
