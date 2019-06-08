"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../../settings");
var fs_1 = __importDefault(require("fs"));
var getInterface_1 = require("../../helpers/getInterface");
var genMethodParams_1 = require("../../helpers/genMethodParams");
var _ = "\n";
var ___ = "\n   ";
var ______ = "\n      ";
var output = function (allInterfaces) {
    var query = getInterface_1.getInterface('IQuery', allInterfaces);
    var mutation = getInterface_1.getInterface('IMutation', allInterfaces);
    var subscription = getInterface_1.getInterface('ISubscription', allInterfaces);
    var output = '';
    var addImport = function (type, name) {
        output = "import {" + type + "_" + name + "_route} from './" + type + ".routes';\n" + output;
    };
    output += _ + "export const resolvers = {";
    output += ___ + "Query: {";
    if (query) {
        query.members.map(function (m) {
            addImport('query', m.name);
            output += "" + ______ + m.name + ": () => query_" + m.name + "_route(),";
        });
        query.methods.map(function (m) {
            addImport('query', m.name);
            output += "" + ______ + m.name + ": (root: any, " + genMethodParams_1.genMethodParams(m.params) + ") => query_" + m.name + "_route(" + m.params.map(function (p) { return p.name; }).join(', ') + "),";
        });
    }
    output += ___ + "},";
    output += ___ + "Mutation: {";
    if (mutation) {
        mutation.members.map(function (m) {
            addImport('mutation', m.name);
            output += "" + ______ + m.name + ": () => mutation_" + m.name + "_route(),";
        });
        mutation.methods.map(function (m) {
            addImport('mutation', m.name);
            output += "" + ______ + m.name + ": (root: any, " + genMethodParams_1.genMethodParams(m.params) + ") => mutation_" + m.name + "_route(" + m.params.map(function (p) { return p.name; }).join(', ') + "),";
        });
    }
    output += ___ + "},";
    output += ___ + "Subscription: {";
    if (subscription) {
        subscription.members.map(function (m) {
            addImport('subscription', m.name);
            output += "" + ______ + m.name + ": () => subscription_" + m.name + "_route(),";
        });
        subscription.methods.map(function (m) {
            addImport('subscription', m.name);
            output += "" + ______ + m.name + ": (root: any, " + genMethodParams_1.genMethodParams(m.params) + ") => subscription_" + m.name + "_route(" + m.params.map(function (p) { return p.name; }).join(', ') + "),";
        });
    }
    output += ___ + "},";
    output += _ + "};";
    return output;
};
exports.generateResolversIndexFile = function (allInterfaces) {
    var requestFilePath = settings_1.options.serverOutDir.get() + "/resolvers.ts";
    fs_1.default.writeFile(requestFilePath, output(allInterfaces), function (err) {
        if (err) {
            return console.error(err);
        }
    });
};
