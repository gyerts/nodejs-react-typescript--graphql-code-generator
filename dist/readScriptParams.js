"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
function getArgs() {
    var args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach(function (arg) {
        // long arg
        if (arg.slice(0, 2) === '--') {
            var longArg = arg.split('=');
            var longArgFlag = longArg[0].slice(2, longArg[0].length);
            var longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        // flags
        else if (arg[0] === '-') {
            var flags = arg.slice(1, arg.length).split('');
            flags.forEach(function (flag) {
                args[flag] = true;
            });
        }
    });
    return args;
}
exports.readScriptParams = function () {
    var args = getArgs();
    console.log(args);
    if (args.client) {
        index_1.generateClient(args.dist, args.if);
    }
    else if (args.server) {
        index_1.generateServer(args.dist, args.if);
    }
    else {
        throw 'You need to specify --client or --server ' +
            '\n        with --dist param where all files will be generated' +
            '\n        with --if param which means path to the interfaces IQuery.ts & IMutation.ts & ISubscription.ts';
    }
};
