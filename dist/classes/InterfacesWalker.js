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
var helpers_1 = require("../helpers");
var getInterface_1 = require("../generators/helpers/getInterface");
var getFullListOfParamsNoParent_1 = require("../generators/helpers/getFullListOfParamsNoParent");
var InterfacesWalker = /** @class */ (function () {
    function InterfacesWalker(mainInterfaceName, allInterfaces, callbackIn, callbackOut) {
        var _this = this;
        this.mainInterfaceName = mainInterfaceName;
        this.allInterfaces = allInterfaces;
        this.callbackIn = callbackIn;
        this.callbackOut = callbackOut;
        this.run = function () {
            _this.readNext([], getInterface_1.getInterface(_this.mainInterfaceName, _this.allInterfaces));
        };
        this.readNext = function (parentBreadcrumbs, currentInterface) {
            currentInterface.members.map(function (m) {
                var breadcrumbs = parentBreadcrumbs.slice();
                if (!helpers_1.primitiveTypes.includes(m.type.name)) {
                    breadcrumbs.push({
                        name: m.name,
                        interfaceName: m.type.name,
                        params: [],
                        type: m.type,
                    });
                    var objectPath = {
                        type: m.type,
                        breadcrumbs: breadcrumbs,
                        signatureParams: [],
                    };
                    _this.initWithSignatureParams(objectPath);
                    _this.callbackIn(m.name, [], objectPath, false);
                    _this.readNext(breadcrumbs, getInterface_1.getInterface(m.type.name, _this.allInterfaces));
                    _this.callbackOut && _this.callbackOut(m.name, [], objectPath, false);
                }
            });
            currentInterface.methods.map(function (m) {
                var forClientOnly = false;
                m.returnValues.map(function (rv) {
                    var breadcrumbs = parentBreadcrumbs.slice();
                    breadcrumbs.push({
                        name: m.name,
                        interfaceName: rv.name,
                        type: rv,
                        params: m.params.map(function (p) { return ({ name: m.name + "_" + p.name, param: p }); }),
                    });
                    var objectPath = {
                        type: rv,
                        breadcrumbs: breadcrumbs,
                        signatureParams: [],
                    };
                    _this.initWithSignatureParams(objectPath);
                    _this.callbackIn(m.name, m.params, objectPath, forClientOnly);
                    _this.readNext(breadcrumbs, getInterface_1.getInterface(rv.name, _this.allInterfaces));
                    _this.callbackOut && _this.callbackOut(m.name, m.params, objectPath, forClientOnly);
                    forClientOnly = true;
                });
            });
        };
        this.initWithSignatureParams = function (objectPath) {
            var i = getInterface_1.getInterface(_this.mainInterfaceName, _this.allInterfaces);
            objectPath.breadcrumbs.map(function (breadcrumb) {
                var foundMethod = i.methods.find(function (m) { return m.name === breadcrumb.name; });
                var foundMember = i.members.find(function (m) { return m.name === breadcrumb.name; });
                if (foundMethod) {
                    foundMethod.params.map(function (param) {
                        objectPath.signatureParams.push(__assign({}, param, { name: foundMethod.name + "_" + param.name }));
                    });
                    i = getInterface_1.getInterface(breadcrumb.interfaceName, _this.allInterfaces);
                }
                else if (foundMember) {
                    i = getInterface_1.getInterface(breadcrumb.interfaceName, _this.allInterfaces);
                }
                else {
                    throw "[" + i.name + "][" + i.methods.map(function (m) { return m.name; }) + "] do not includes \"" + breadcrumb.name + "\"";
                }
            });
            var params = getFullListOfParamsNoParent_1.getFullListOfParamsNoParent(objectPath.breadcrumbs[objectPath.breadcrumbs.length - 1].interfaceName, _this.allInterfaces);
            objectPath.signatureParams = objectPath.signatureParams.concat(params);
        };
    }
    return InterfacesWalker;
}());
exports.InterfacesWalker = InterfacesWalker;
