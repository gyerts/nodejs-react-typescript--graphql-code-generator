"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generateMergeTypesFile_1 = require("./generateMergeTypesFile");
var generateResolversIndexFile_1 = require("./generateResolversIndexFile");
var generateInterfacesFile_1 = require("./generateInterfacesFile");
var server_common;
(function (server_common) {
    server_common.genMergeTypesFile = generateMergeTypesFile_1.generateMergeTypesFile;
    server_common.genInterfacesFile = generateInterfacesFile_1.generateInterfacesFile;
    server_common.genResolversIndexFile = generateResolversIndexFile_1.generateResolversIndexFile;
})(server_common = exports.server_common || (exports.server_common = {}));
