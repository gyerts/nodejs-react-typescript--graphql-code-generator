"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.breadcrumbsToCapitalName = function (breadcrumbs) {
    return breadcrumbs.map(function (b) { return b.name[0].toUpperCase() + b.name.slice(1); }).join('');
};
