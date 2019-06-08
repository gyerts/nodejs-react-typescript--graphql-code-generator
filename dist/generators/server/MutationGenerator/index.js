"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generateGQLSchemaFile_1 = require("./generateGQLSchemaFile");
var generateResolversFile_1 = require("./generateResolversFile");
var generateDummyFiles_1 = require("./generateDummyFiles");
var server_mutation;
(function (server_mutation) {
    server_mutation.genGQLSchemaFile = generateGQLSchemaFile_1.generateGQLSchemaFile;
    server_mutation.genResolversFile = generateResolversFile_1.generateResolversFile;
    server_mutation.genDummyFiles = generateDummyFiles_1.generateDummyFiles;
})(server_mutation = exports.server_mutation || (exports.server_mutation = {}));
