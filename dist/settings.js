"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var local = {
    interfacesPath: '',
    clientOutDir: '',
    serverOutDir: '',
};
exports.options = {
    interfacesPath: {
        set: function (interfacesPath) {
            local.interfacesPath = interfacesPath;
        },
        get: function () { return local.interfacesPath; },
    },
    clientOutDir: {
        set: function (clientOutDir) {
            local.clientOutDir = clientOutDir;
        },
        get: function () { return local.clientOutDir; },
    },
    serverOutDir: {
        set: function (serverOutDir) {
            local.serverOutDir = serverOutDir;
        },
        get: function () { return local.serverOutDir; },
    },
};
