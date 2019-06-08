"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../../settings");
var fs_1 = __importDefault(require("fs"));
var output = "import { mergeTypes } from 'merge-graphql-schemas';\nconst fs = require('fs');\nconst path = require('path');\n\nconst dirname = __dirname.replace('/dist', '/src');\n\nconst querySchema = fs.readFileSync(path.join(dirname, 'query.graphql'), 'utf8');\nconst mutationSchema = fs.readFileSync(path.join(dirname, 'mutation.graphql'), 'utf8');\nconst subscriptionSchema = fs.readFileSync(path.join(dirname, 'subscription.graphql'), 'utf8');\n\nexport const typeDefs = mergeTypes([subscriptionSchema, mutationSchema, querySchema], { all: true });\n";
exports.generateMergeTypesFile = function () {
    var requestFilePath = settings_1.options.serverOutDir.get() + "/mergedGQLSchemas.ts";
    fs_1.default.writeFile(requestFilePath, output, function (err) {
        if (err) {
            return console.error(err);
        }
    });
};
