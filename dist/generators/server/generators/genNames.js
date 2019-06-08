"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouteName = function (queryType, op, name) {
    return queryType + "_" + op.breadcrumbs.map(function (b) { return b.name; }).join('_') + (name ? "_" + name : '') + '_route';
};
exports.getRouteContextName = function (op) {
    return op.breadcrumbs.map(function (b) { return b.name[0].toUpperCase() + b.name.slice(1); }).join('') + 'RouteContext';
};
exports.getPrimitiveName = function (iName) {
    return "external." + iName + "Primitives";
};
exports.getNamespaceName = function (op) {
    return "" + op.breadcrumbs.map(function (b) { return b.name; }).join('_');
};
