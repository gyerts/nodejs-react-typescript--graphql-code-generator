"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.primitiveTypes = ['number', 'boolean', 'string'];
exports.typeToGQLString = function (type) {
    var output = '';
    output += "" + (type.array ? '[' : '');
    if (exports.primitiveTypes.includes(type.name)) {
        output += "" + (type.name === 'number' ? 'Int' : '');
        output += "" + (type.name === 'string' ? 'String' : '');
        output += "" + (type.name === 'boolean' ? 'Boolean' : '');
        output += "" + (type.nullable ? '' : '!');
    }
    else {
        output += "" + type.name;
    }
    output += "" + (type.array ? ']' : '');
    return output;
};
exports.announceNextSymbol = function (word) {
    var repeatNumber1 = 28 - JSON.stringify(word).length / 2;
    var repeatNumber2 = repeatNumber1 % 2 ? repeatNumber1 + 1 : repeatNumber1;
    console.log('\n==========================================================');
    console.log('|'.repeat(repeatNumber1) + " " + JSON.stringify(word) + " " + '|'.repeat(repeatNumber2));
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
};
