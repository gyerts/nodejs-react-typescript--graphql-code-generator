"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generateInterfacesFile_1 = require("./generateInterfacesFile");
var generateQueriesFile_1 = require("./generateQueriesFile");
var generateRequestsFile_1 = require("./generateRequestsFile");
var client_mutation;
(function (client_mutation) {
    client_mutation.genInterfacesFile = generateInterfacesFile_1.generateInterfacesFile;
    client_mutation.genQueriesFile = generateQueriesFile_1.generateQueriesFile;
    client_mutation.genRequestsFile = generateRequestsFile_1.generateRequestsFile;
})(client_mutation = exports.client_mutation || (exports.client_mutation = {}));
