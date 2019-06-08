"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectPath = function (entriesPath, allObjectPaths) {
    var foundObjectPath = undefined;
    allObjectPaths.map(function (op) {
        if (op.breadcrumbs.length === entriesPath.length) {
            var equal_1 = true;
            op.breadcrumbs.map(function (bc, index) {
                equal_1 = equal_1 && bc.name === entriesPath[index];
            });
            if (equal_1) {
                foundObjectPath = op;
            }
        }
    });
    if (!foundObjectPath) {
        console.trace();
        throw "'" + entriesPath + "' not found in list of object paths";
    }
    return foundObjectPath;
};
