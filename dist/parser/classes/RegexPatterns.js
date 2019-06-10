"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexPatterns = {
    import: {
        path: /^['"]{1}[\w_/.]+['"]{1}$/g,
    },
    nameConventions: {
        anyName: /^[\w_]+$/g,
        InterfaceName: /^I[\w_]+$/g,
    },
    types: {
        object: /^[\w_]+$/g,
        array: /^[\w_]+\[]$/g,
    },
};
