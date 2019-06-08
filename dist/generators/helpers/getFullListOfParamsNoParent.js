"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../../helpers");
var getInterface_1 = require("./getInterface");
exports.getFullListOfParamsNoParent = function (interfaceName, allInterfaces) {
    var recursivelyFindAllParamsInInterface = function (params, interfaceName) {
        var currentInterface = getInterface_1.getInterface(interfaceName, allInterfaces);
        currentInterface.members.map(function (m) {
            if (!helpers_1.primitiveTypes.includes(m.type.name)) {
                recursivelyFindAllParamsInInterface(params, m.type.name);
            }
        });
        currentInterface.methods.map(function (m) {
            if (m.params.length) {
                m.params.map(function (param) {
                    var name = m.name + "_" + param.name;
                    if (!params.filter(function (p) { return p.name === name; }).length) {
                        params.push(__assign({}, param, { name: m.name + "_" + param.name }));
                    }
                    else {
                        console.warn("met double name: '" + name + "' while gen of all params for interface: '" + interfaceName + "'");
                    }
                });
            }
            m.returnValues.map(function (rv) {
                recursivelyFindAllParamsInInterface(params, rv.name);
            });
        });
    };
    var params = [];
    recursivelyFindAllParamsInInterface(params, interfaceName);
    return params;
};
