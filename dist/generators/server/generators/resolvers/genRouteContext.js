"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ITypeToTypescriptString_1 = require("../../../helpers/ITypeToTypescriptString");
var genNames_1 = require("../genNames");
var _ = "\n";
var ___ = "\n   ";
var ______ = "\n      ";
exports.genRouteContext = function (name, ownParams, isArray, breadcrumbsPath, allOps) {
    var output = "";
    var currentObjectPath = null;
    var parentObjectPath = null;
    var parentOpBreadcrumbsPath = breadcrumbsPath.split('.').slice(0, -1).join('.');
    allOps.map(function (op) {
        var path = op.breadcrumbs.map(function (b) { return b.name; }).join('.');
        if (path === breadcrumbsPath) {
            currentObjectPath = op;
        }
        else if (path === parentOpBreadcrumbsPath) {
            parentObjectPath = op;
        }
    });
    // if (!isArray) {
    if (currentObjectPath && parentObjectPath) {
        output += "export type " + genNames_1.getRouteContextName(currentObjectPath) + " = " + genNames_1.getRouteContextName(parentObjectPath) + " & {";
    }
    else if (currentObjectPath) {
        output += "export type " + genNames_1.getRouteContextName(currentObjectPath) + " = {";
    }
    ownParams.map(function (p) {
        output += "" + ___ + name + "_" + ITypeToTypescriptString_1.ITypeToTypescriptString(p.name, p.type);
    });
    output += _ + "};";
    output += "" + _;
    // }
    return output;
};
