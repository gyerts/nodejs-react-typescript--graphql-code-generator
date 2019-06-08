"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generateInterfacesFile_1 = require("./generateInterfacesFile");
var generateQueriesFile_1 = require("./generateQueriesFile");
var generateRequestsFile_1 = require("./generateRequestsFile");
var client_query;
(function (client_query) {
    client_query.genInterfacesFile = generateInterfacesFile_1.generateInterfacesFile;
    client_query.genQueriesFile = generateQueriesFile_1.generateQueriesFile;
    client_query.genRequestsFile = generateRequestsFile_1.generateRequestsFile;
})(client_query = exports.client_query || (exports.client_query = {}));
