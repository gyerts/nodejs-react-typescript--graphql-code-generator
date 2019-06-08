"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../../settings");
var fs_1 = __importDefault(require("fs"));
var genAllResolvers_1 = require("../generators/resolvers/genAllResolvers");
exports.generateResolversFile = function (globalInterfaceName, allInterfaces) {
    var output = genAllResolvers_1.genResolver('query', allInterfaces, globalInterfaceName);
    fs_1.default.writeFile(settings_1.options.serverOutDir.get() + "/query.routes.ts", output, function (err) {
        if (err) {
            return console.error(err);
        }
    });
};
