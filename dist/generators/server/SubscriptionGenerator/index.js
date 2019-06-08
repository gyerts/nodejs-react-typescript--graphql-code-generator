"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generateGQLSchemaFile_1 = require("./generateGQLSchemaFile");
var generateResolversFile_1 = require("./generateResolversFile");
var generateDummyFiles_1 = require("./generateDummyFiles");
var server_subscription;
(function (server_subscription) {
    server_subscription.genGQLSchemaFile = generateGQLSchemaFile_1.generateGQLSchemaFile;
    server_subscription.genResolversFile = generateResolversFile_1.generateResolversFile;
    server_subscription.genDummyFiles = generateDummyFiles_1.generateDummyFiles;
})(server_subscription = exports.server_subscription || (exports.server_subscription = {}));
