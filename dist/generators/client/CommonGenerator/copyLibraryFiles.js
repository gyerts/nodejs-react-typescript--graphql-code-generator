"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var settings_1 = require("../../../settings");
exports.copyLibraryFiles = function () {
    fs_1.default.copyFile((__dirname + "/lib/requests.ts").replace('/dist/', '/src/'), settings_1.options.clientOutDir.get() + "/requests.ts", function (err) {
        if (err) {
            return console.error(err);
        }
    });
};
