"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../../settings");
var fs_1 = __importDefault(require("fs"));
var helpers_1 = require("../../../helpers");
var GQLObjectPath_1 = require("../../../classes/GQLObjectPath");
var genMethodParams_1 = require("../../helpers/genMethodParams");
var getInterface_1 = require("../../helpers/getInterface");
var tab = '   ';
var getFileContent = function (objectPath, allInterfaces) {
    var full_breadcrumb_name = objectPath.breadcrumbs.map(function (b) { return b.name; }).join('_');
    var genGQLMethodParams = function (breadcrumb, objectPath) {
        var output = '';
        if (breadcrumb.params.length) {
            output += '(';
            breadcrumb.params.map(function (p) {
                var foundParam = objectPath.signatureParams.find(function (sp) { return sp.name === p.name; });
                output += p.name.replace(breadcrumb.name + "_", '') + ": ";
                if (foundParam && foundParam.type.array) {
                    output += "${JSON.stringify(" + p.name + ")}, ";
                }
                else if (foundParam && foundParam.type.name === 'string') {
                    output += "\"${" + p.name + "}\", ";
                }
                else {
                    output += "${" + p.name + "}, ";
                }
            });
            output = output.slice(0, output.length - 2) + ')';
        }
        return output;
    };
    var genGQLRequestString = function (objectPath, shift) {
        if (shift === void 0) { shift = 0; }
        var genBreadcrumbs = function (bcs, i, shift) {
            var output = '';
            var space = tab.repeat(shift);
            output += "" + space + bcs[i].name + " " + genGQLMethodParams(bcs[i], objectPath) + " {\n";
            if (bcs[i + 1]) {
                output += genBreadcrumbs(bcs, i + 1, shift + 1);
            }
            else {
                var genInterface_1 = function (interfaceName, shift) {
                    var space = tab.repeat(shift);
                    var currentInterface = getInterface_1.getInterface(interfaceName, allInterfaces);
                    currentInterface.members.map(function (m) {
                        if (!helpers_1.primitiveTypes.includes(m.type.name)) {
                            output += "\n" + space + m.name + " {";
                            genInterface_1(m.type.name, shift + 1);
                            output += "\n" + space + "}";
                        }
                        else {
                            output += "\n" + space + m.name;
                        }
                    });
                    currentInterface.methods.map(function (m) {
                        output += "\n" + space + m.name;
                        output += genGQLMethodParams({
                            name: m.name,
                            params: m.params.map(function (p) { return ({ name: m.name + "_" + p.name, param: p }); }),
                            interfaceName: '',
                            type: m.returnValues[0]
                        }, {
                            type: m.returnValues[0],
                            breadcrumbs: [],
                            signatureParams: m.params.map(function (p) { return ({ name: m.name + "_" + p.name, type: p.type }); })
                        });
                        output += " {";
                        genInterface_1(m.returnValues[0].name, shift + 1);
                        output += "\n" + space + "}";
                    });
                };
                genInterface_1(objectPath.type.name, shift + 1);
            }
            output += "\n" + space + "}";
            return output;
        };
        var output = '';
        output += genBreadcrumbs(objectPath.breadcrumbs, 0, shift + 1);
        return output.trim();
    };
    return ("\nexport const " + full_breadcrumb_name + "_" + objectPath.type.name + "_fields = (" + genMethodParams_1.genMethodParams(objectPath.signatureParams) + ") => `\n   " + genGQLRequestString(objectPath) + "\n`;\n").replace(/(^[ \t]*\n)/gm, '');
};
exports.generateQueriesFile = function (mainInterfaceName, allInterfaces) {
    var output = '';
    new GQLObjectPath_1.GQLObjectPath(mainInterfaceName, allInterfaces).objectPaths.map(function (objectPath) {
        var query = getFileContent(objectPath, allInterfaces);
        if (!output.includes(query)) {
            output += query;
        }
    });
    var requestFilePath = settings_1.options.clientOutDir.get() + "/query.queries.ts";
    fs_1.default.writeFile(requestFilePath, output, function (err) {
        if (err) {
            return console.error(err);
        }
    });
};
