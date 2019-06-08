"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @return export interface <name>Response { a: { b: c: { d: e } } }
 */
exports.genResponseInterface = function (objectPath) {
    var genNext = function (bcs, i) {
        var output = '';
        output += bcs[i].name + ": ";
        if (bcs[i + 1]) {
            if (!bcs[i].type.array) {
                output += "{ ";
                output += genNext(bcs, i + 1);
                output += " }";
            }
            else {
                output += "" + bcs[i].type.name + (bcs[i].type.array ? '[]' : '');
            }
        }
        else {
            output += "" + objectPath.type.name + (objectPath.type.array ? '[]' : '');
        }
        return output;
    };
    var output = '';
    output += genNext(objectPath.breadcrumbs, 0);
    output += ';';
    return output.trim();
};
