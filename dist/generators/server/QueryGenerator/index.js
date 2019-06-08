"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generateGQLSchemaFile_1 = require("./generateGQLSchemaFile");
var generateResolversFile_1 = require("./generateResolversFile");
var generateDummyFiles_1 = require("./generateDummyFiles");
var server_query;
(function (server_query) {
    server_query.genGQLSchemaFile = generateGQLSchemaFile_1.generateGQLSchemaFile;
    server_query.genResolversFile = generateResolversFile_1.generateResolversFile;
    server_query.genDummyFiles = generateDummyFiles_1.generateDummyFiles;
})(server_query = exports.server_query || (exports.server_query = {}));
