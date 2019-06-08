"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../../settings");
var fs_1 = __importDefault(require("fs"));
var InterfacesWalker_1 = require("../../../classes/InterfacesWalker");
var ArrayContainer_1 = require("../../helpers/ArrayContainer");
var genDummyFile_1 = require("../generators/genDummyFile");
exports.generateDummyFiles = function (mainInterfaceName, allInterfaces) {
    var outputDir = settings_1.options.serverOutDir.get() + "/dummy";
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir);
    }
    var handler = function (breadcrumbName, ownParams, op, forClientOnly) {
        var output = '';
        var arrayContainer = new ArrayContainer_1.ArrayContainer();
        if (!forClientOnly && arrayContainer.allowed(op)) {
            output += genDummyFile_1.genDummyFile('query', op, allInterfaces);
            var bPath = op.breadcrumbs.map(function (b) { return b.name; });
            fs_1.default.writeFile(outputDir + "/query." + bPath.join('.') + ".ts", output, function (err) {
                if (err) {
                    return console.error(err);
                }
            });
        }
    };
    var walker = new InterfacesWalker_1.InterfacesWalker(mainInterfaceName, allInterfaces, handler);
    walker.run();
};
