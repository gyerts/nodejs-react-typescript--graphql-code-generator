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
var getFullListOfParamsNoParent_1 = require("../generators/helpers/getFullListOfParamsNoParent");
var getInterface_1 = require("../generators/helpers/getInterface");
var GQLObjectPath = /** @class */ (function () {
    function GQLObjectPath(globalInterfaceName, allInterfaces) {
        var _this = this;
        this.globalInterfaceName = globalInterfaceName;
        this.allInterfaces = allInterfaces;
        this.objectPaths = [];
        this.readObjectPaths = function (parentBreadcrumbs, currentInterface) {
            currentInterface.members.map(function (m) {
                var breadcrumbs = parentBreadcrumbs.slice();
                if (!helpers_1.primitiveTypes.includes(m.type.name)) {
                    breadcrumbs.push({
                        name: m.name,
                        interfaceName: m.type.name,
                        type: m.type,
                        params: [],
                    });
                    _this.objectPaths.push({
                        type: m.type,
                        breadcrumbs: breadcrumbs,
                        signatureParams: [],
                    });
                    _this.readObjectPaths(breadcrumbs, getInterface_1.getInterface(m.type.name, _this.allInterfaces));
                }
            });
            currentInterface.methods.map(function (m) {
                m.returnValues.map(function (rv) {
                    var breadcrumbs = parentBreadcrumbs.slice();
                    breadcrumbs.push({
                        name: m.name,
                        interfaceName: rv.name,
                        type: rv,
                        params: m.params.map(function (p) { return ({ name: m.name + "_" + p.name, param: p }); }),
                    });
                    _this.objectPaths.push({
                        type: rv,
                        breadcrumbs: breadcrumbs,
                        signatureParams: [],
                    });
                    _this.readObjectPaths(breadcrumbs, getInterface_1.getInterface(rv.name, _this.allInterfaces));
                });
            });
        };
        this.addParamsToAllObjects = function (globalInterface) {
            var handleObjectPath = function (objectPath) {
                var nextInterface = globalInterface;
                objectPath.breadcrumbs.map(function (breadcrumb) {
                    console.log('----------------');
                    console.log(breadcrumb);
                    var foundMethod = nextInterface.methods.find(function (m) { return m.name === breadcrumb.name; });
                    var foundMember = nextInterface.members.find(function (m) { return m.name === breadcrumb.name; });
                    if (foundMethod) {
                        foundMethod.params.map(function (param) {
                            objectPath.signatureParams.push(__assign({}, param, { name: foundMethod.name + "_" + param.name }));
                        });
                        nextInterface = getInterface_1.getInterface(breadcrumb.interfaceName, _this.allInterfaces);
                    }
                    else if (foundMember) {
                        nextInterface = getInterface_1.getInterface(breadcrumb.interfaceName, _this.allInterfaces);
                    }
                    else {
                        throw "[" + nextInterface.name + "][" + nextInterface.methods.map(function (m) { return m.name; }) + "] do not includes \"" + breadcrumb.name + "\"";
                    }
                });
                var params = getFullListOfParamsNoParent_1.getFullListOfParamsNoParent(objectPath.breadcrumbs[objectPath.breadcrumbs.length - 1].interfaceName, _this.allInterfaces);
                objectPath.signatureParams = objectPath.signatureParams.concat(params);
            };
            _this.objectPaths.map(function (objectPath) {
                console.log('======================================================');
                console.log('next breadcrumb ======================================');
                console.log('======================================================');
                handleObjectPath(objectPath);
                console.log('******************************************************');
                console.log(JSON.stringify(objectPath, null, 3));
            });
        };
        this.readObjectPaths([], getInterface_1.getInterface(globalInterfaceName, allInterfaces));
        console.log(JSON.stringify(this.objectPaths, null, 3));
        this.addParamsToAllObjects(getInterface_1.getInterface(globalInterfaceName, allInterfaces));
    }
    return GQLObjectPath;
}());
exports.GQLObjectPath = GQLObjectPath;
