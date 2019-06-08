"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var LexersController_1 = require("./parser/classes/LexersController");
var RegexPatterns_1 = require("./parser/classes/RegexPatterns");
var Composite_Root_1 = require("./parser/lexers/Composite.Root");
var recursive_readdir_1 = __importDefault(require("recursive-readdir"));
var fs_1 = __importDefault(require("fs"));
var QueryGenerator_1 = require("./generators/client/QueryGenerator");
var MutationGenerator_1 = require("./generators/client/MutationGenerator");
var CommonGenerator_1 = require("./generators/client/CommonGenerator");
var QueryGenerator_2 = require("./generators/server/QueryGenerator");
var MutationGenerator_2 = require("./generators/server/MutationGenerator");
var SubscriptionGenerator_1 = require("./generators/server/SubscriptionGenerator");
var Common_1 = require("./generators/server/Common");
var readScriptParams_1 = require("./readScriptParams");
var settings_1 = require("./settings");
/***********************************************************************
 * INIT LEXER CONTROLLER
 ***********************************************************************/
exports.ctrl = new LexersController_1.LexersController();
exports.ctrl.addLexer(new Composite_Root_1.CompositeRoot());
/***********************************************************************
 * READ SYMBOLS
 ***********************************************************************/
var readSymbols = function (text, ctrl) {
    var replacements = [
        [/\n/g, ' \n '],
        [/,/g, ' , '],
        [/;/g, ' ; '],
        [/:/g, ' : '],
        [/{/g, ' { '],
        [/}/g, ' } '],
        [/\(/g, ' ( '],
        [/\)/g, ' ) '],
        [/=>/g, ' => '],
        [/\|/g, ' | '],
        [/\?/g, ' ? '],
    ];
    replacements.map(function (replacement) {
        var regex = replacement[0], symbol = replacement[1];
        text = text.replace(regex, " " + symbol + " ");
    });
    var symbols = text.split(' ');
    symbols = symbols.filter(function (symbol) { return Boolean(symbol); });
    // Анулируем все символы '\n' если они стоят не перед словом, а перед спец символом к примеру
    symbols.map(function (w, i) {
        if (w === '\n') {
            if (symbols[i - 1] && symbols[i - 1].match(RegexPatterns_1.regexPatterns.nameConventions.anyName)) {
                symbols[i] = ';';
            }
            else if (symbols[i - 1] && symbols[i - 1].match(RegexPatterns_1.regexPatterns.import.path)) {
                symbols[i] = ';';
            }
            else {
                symbols[i] = '';
            }
        }
    });
    symbols = symbols.filter(function (symbol) { return Boolean(symbol); });
    console.log(symbols);
    symbols.map(function (symbol) {
        helpers_1.announceNextSymbol(symbol);
        ctrl.handleSymbol(symbol);
    });
};
function generateClient(dest, interfacesPath) {
    settings_1.options.clientOutDir.set(dest);
    settings_1.options.interfacesPath.set(interfacesPath);
    recursive_readdir_1.default(settings_1.options.interfacesPath.get(), function (err, files) {
        files.map(function (filePath) {
            var text = fs_1.default.readFileSync(filePath, 'utf8');
            readSymbols(text, exports.ctrl);
        });
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        var allInterfaces = exports.ctrl.env.interfaces;
        CommonGenerator_1.client_common.cpyLibraryFiles();
        QueryGenerator_1.client_query.genInterfacesFile(allInterfaces, 'IQuery');
        QueryGenerator_1.client_query.genRequestsFile('IQuery', allInterfaces);
        QueryGenerator_1.client_query.genQueriesFile('IQuery', allInterfaces);
        MutationGenerator_1.client_mutation.genInterfacesFile(allInterfaces, 'IMutation');
        MutationGenerator_1.client_mutation.genRequestsFile('IMutation', allInterfaces);
        MutationGenerator_1.client_mutation.genQueriesFile('IMutation', allInterfaces);
    });
}
exports.generateClient = generateClient;
function generateServer(dest, interfacesPath) {
    settings_1.options.serverOutDir.set(dest);
    settings_1.options.interfacesPath.set(interfacesPath);
    recursive_readdir_1.default(settings_1.options.interfacesPath.get(), function (err, files) {
        files.map(function (filePath) {
            var text = fs_1.default.readFileSync(filePath, 'utf8');
            readSymbols(text, exports.ctrl);
        });
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        var allInterfaces = exports.ctrl.env.interfaces;
        QueryGenerator_2.server_query.genGQLSchemaFile('IQuery', allInterfaces);
        QueryGenerator_2.server_query.genResolversFile('IQuery', allInterfaces);
        QueryGenerator_2.server_query.genDummyFiles('IQuery', allInterfaces);
        MutationGenerator_2.server_mutation.genGQLSchemaFile('IMutation', allInterfaces);
        MutationGenerator_2.server_mutation.genResolversFile('IMutation', allInterfaces);
        MutationGenerator_2.server_mutation.genDummyFiles('IMutation', allInterfaces);
        SubscriptionGenerator_1.server_subscription.genGQLSchemaFile('ISubscription', allInterfaces);
        SubscriptionGenerator_1.server_subscription.genResolversFile('ISubscription', allInterfaces);
        SubscriptionGenerator_1.server_subscription.genDummyFiles('ISubscription', allInterfaces);
        Common_1.server_common.genMergeTypesFile();
        Common_1.server_common.genResolversIndexFile(allInterfaces);
        Common_1.server_common.genInterfacesFile(allInterfaces);
    });
}
exports.generateServer = generateServer;
readScriptParams_1.readScriptParams();
