"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../../settings");
var fs_1 = __importDefault(require("fs"));
var genAllResolvers_1 = require("../generators/resolvers/genAllResolvers");
var _ = "\n";
var ___ = "\n   ";
var ______ = "\n      ";
exports.generateResolversFile = function (globalInterfaceName, allInterfaces) {
    var output = genAllResolvers_1.genResolver('mutation', allInterfaces, globalInterfaceName);
    fs_1.default.writeFile(settings_1.options.serverOutDir.get() + "/mutation.routes.ts", output, function (err) {
        if (err) {
            return console.error(err);
        }
    });
};
