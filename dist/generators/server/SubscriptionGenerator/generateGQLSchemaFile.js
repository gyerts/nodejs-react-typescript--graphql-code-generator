"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../../settings");
var fs_1 = __importDefault(require("fs"));
var genSchema_1 = require("../generators/genSchema");
exports.generateGQLSchemaFile = function (mainInterfaceName, allInterfaces) {
    var output = genSchema_1.genSchema('subscription', mainInterfaceName, allInterfaces);
    var requestFilePath = settings_1.options.serverOutDir.get() + "/subscription.graphql";
    fs_1.default.writeFile(requestFilePath, output, function (err) {
        if (err) {
            return console.error(err);
        }
    });
};
