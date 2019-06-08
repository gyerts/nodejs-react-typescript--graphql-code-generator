"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../../../../helpers");
var breadcrumbsToCapitalName_1 = require("../../../helpers/breadcrumbsToCapitalName");
var genNames_1 = require("../genNames");
var _ = "\n";
var ___ = "\n   ";
var ______ = "\n      ";
var genRouteWithDelegateCall = function (queryType, op, i, lastB, bName, primitiveResponse, isFirst) {
    var output = '';
    output += ___ + "const context: " + genNames_1.getRouteContextName(op) + " = {";
    !isFirst && (output += ______ + "...req._ctx_,");
    lastB.params.map(function (p) {
        output += "" + ______ + p.name + ": req." + p.name.slice(lastB.name.length + 1) + ",";
    });
    output += ___ + "};";
    output += ___ + "let " + primitiveResponse + ": " + genNames_1.getPrimitiveName(lastB.type.name) + ";";
    output += ___ + "const node: internal." + i.name + " = {";
    i.members.map(function (m) {
        if (!helpers_1.primitiveTypes.includes(m.type.name)) {
            var routeName = genNames_1.getRouteName(queryType, op, m.name);
            output += "" + ______ + m.name + ": () => " + routeName + "({ _ctx_: context, _parent_: " + primitiveResponse + " }),";
        }
    });
    i.methods.map(function (m) {
        if (!helpers_1.primitiveTypes.includes(m.returnValues[0].name)) {
            var routeName = genNames_1.getRouteName(queryType, op, m.name);
            output += "" + ______ + m.name + ": (req: any) => " + routeName + "({ _ctx_: context, _parent_: " + primitiveResponse + ", ...req }),";
        }
    });
    output += ___ + "};";
    !isFirst && (output += ___ + "req._ctx_ = context;");
    output += "" + ___ + primitiveResponse + " = await " + bName + "_delegate." + lastB.name + "Impl(req, node);";
    output += ___ + "return { ..." + primitiveResponse + ", ...node };";
    return output;
};
var genOnlyRoute = function (queryType, op, i, lastB, bName, primitiveResponse, isFirst) {
    var output = '';
    output += ___ + "const context: " + genNames_1.getRouteContextName(op) + " = {";
    !isFirst && (output += ______ + "...req._ctx_,");
    lastB.params.map(function (p) {
        output += "" + ______ + p.name + ": req." + p.name.slice(lastB.name.length + 1) + ",";
    });
    output += ___ + "};";
    output += ___ + "const node: internal." + i.name + " = {";
    i.members.map(function (m) {
        if (!helpers_1.primitiveTypes.includes(m.type.name)) {
            var routeName = genNames_1.getRouteName(queryType, op, m.name);
            output += "" + ______ + m.name + ": () => " + routeName + "({ _ctx_: context, _parent_: {} }),";
        }
    });
    i.methods.map(function (m) {
        if (!helpers_1.primitiveTypes.includes(m.returnValues[0].name)) {
            var routeName = genNames_1.getRouteName(queryType, op, m.name);
            output += "" + ______ + m.name + ": (req: any) => " + routeName + "({ _ctx_: context, _parent_: {}, ...req }),";
        }
    });
    output += ___ + "};";
    !isFirst && (output += ___ + "req._ctx_ = context;");
    output += ___ + "return { ...node };";
    return output;
};
var genRouteForArray = function (queryType, op, i, lastB, bName, primitiveResponse, isFirst) {
    var output = '';
    output += ___ + "const response = await " + bName + "_delegate." + lastB.name + "Impl(req);";
    {
        output += ___ + "response.map((_parent_: any) => {";
        i.members.map(function (m) {
            if (!helpers_1.primitiveTypes.includes(m.type.name)) {
                var routeName = genNames_1.getRouteName(queryType, op, m.name);
                output += ______ + "_parent_['" + m.name + "'] = () => " + routeName + "({ _ctx_: req._ctx_, _parent_ });";
            }
        });
        i.methods.map(function (m) {
            if (!helpers_1.primitiveTypes.includes(m.returnValues[0].name)) {
                var routeName = genNames_1.getRouteName(queryType, op, m.name);
                output += ______ + "_parent_['" + m.name + "'] = (r: any) => " + routeName + "({ _ctx_: { ...req._ctx_, ...r._ctx_ }, _parent_, ...r });";
            }
        });
        output += ___ + "});";
    }
    output += ___ + "return response;";
    return output;
};
exports.genMutationRoute = function (op, i) {
    var output = "";
    var bName = op.breadcrumbs.map(function (b) { return b.name; }).join('_');
    var lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
    var primitiveResponse = lastB.name + "Primitives";
    var routeName = genNames_1.getRouteName('mutation', op);
    var primitiveMembers = i.members.filter(function (m) { return helpers_1.primitiveTypes.includes(m.type.name); });
    var isFirst = op.breadcrumbs.length === 1;
    output += _ + "export const " + routeName + ": any = async (req: I" + breadcrumbsToCapitalName_1.breadcrumbsToCapitalName(op.breadcrumbs) + "RequestType) => {";
    if (lastB.type.array) {
        output += genRouteForArray('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
    }
    else if (lastB.params.length) {
        output += genRouteWithDelegateCall('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
    }
    else if (!primitiveMembers.length) {
        output += genOnlyRoute('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
    }
    else {
        output += genRouteWithDelegateCall('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
    }
    output += _ + "};";
    output += "" + _;
    return output;
};
exports.genSubscriptionRoute = function (op, i) {
    var output = "";
    var bName = op.breadcrumbs.map(function (b) { return b.name; }).join('_');
    var lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
    var primitiveResponse = lastB.name + "Primitives";
    var routeName = genNames_1.getRouteName('subscription', op);
    var primitiveMembers = i.members.filter(function (m) { return helpers_1.primitiveTypes.includes(m.type.name); });
    var isFirst = op.breadcrumbs.length === 1;
    output += _ + "export const " + routeName + ": any = async (req: I" + breadcrumbsToCapitalName_1.breadcrumbsToCapitalName(op.breadcrumbs) + "RequestType) => {";
    if (lastB.type.array) {
        output += genRouteForArray('subscription', op, i, lastB, bName, primitiveResponse, isFirst);
    }
    else if (lastB.params.length) {
        output += genRouteWithDelegateCall('subscription', op, i, lastB, bName, primitiveResponse, isFirst);
    }
    else if (!primitiveMembers.length) {
        output += genOnlyRoute('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
    }
    else {
        output += genRouteWithDelegateCall('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
    }
    output += _ + "};";
    output += "" + _;
    return output;
};
exports.genQueryRoute = function (op, i) {
    var output = "";
    var bName = op.breadcrumbs.map(function (b) { return b.name; }).join('_');
    var lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
    var primitiveResponse = lastB.name + "Primitives";
    var routeName = genNames_1.getRouteName('query', op);
    var isFirst = op.breadcrumbs.length === 1;
    output += _ + "export const " + routeName + ": any = async (req: I" + breadcrumbsToCapitalName_1.breadcrumbsToCapitalName(op.breadcrumbs) + "RequestType) => {";
    if (lastB.type.array) {
        output += genRouteForArray('query', op, i, lastB, bName, primitiveResponse, isFirst);
    }
    else {
        output += genRouteWithDelegateCall('query', op, i, lastB, bName, primitiveResponse, isFirst);
    }
    output += _ + "};";
    output += "" + _;
    return output;
};
