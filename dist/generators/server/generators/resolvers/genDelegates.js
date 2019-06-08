"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getInterface_1 = require("../../../helpers/getInterface");
var helpers_1 = require("../../../../helpers");
var breadcrumbsToCapitalName_1 = require("../../../helpers/breadcrumbsToCapitalName");
var _ = "\n";
var ___ = "\n   ";
var ______ = "\n      ";
exports.genDelegates = function (queryType, op, allInterfaces) {
    var output = "";
    var bName = op.breadcrumbs.map(function (b) { return b.name; }).join('_') + '_delegate';
    var bPath = op.breadcrumbs.map(function (b) { return b.name; }).join('.');
    var lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
    var i = getInterface_1.getInterface(lastB.interfaceName, allInterfaces);
    var primitiveMembers = i.members.filter(function (m) { return helpers_1.primitiveTypes.includes(m.type.name); });
    if (primitiveMembers.length || lastB.params.length || queryType === 'query') {
        output += _ + "let " + bName + ": { " + lastB.name + "Impl: I" + breadcrumbsToCapitalName_1.breadcrumbsToCapitalName(op.breadcrumbs) + "ImplCallback };";
        output += _ + "try {";
        output += "" + ___ + bName + " = require('../generatedImpl/" + queryType + "." + bPath + "');";
        output += _ + "} catch (e) {";
        output += ___ + "console.warn('will be used dummy impl of \"dummy/" + queryType + "." + bPath + "\" resolver');";
        output += "" + ___ + bName + " = require('./dummy/" + queryType + "." + bPath + "');";
        output += _ + "}";
        output += "" + _;
    }
    return output;
};
