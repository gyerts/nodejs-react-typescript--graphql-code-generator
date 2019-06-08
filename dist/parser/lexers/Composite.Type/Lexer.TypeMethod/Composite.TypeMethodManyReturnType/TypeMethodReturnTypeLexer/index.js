"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ILexer_1 = require("../../../../../interfaces/ILexer");
var RegexPatterns_1 = require("../../../../../classes/RegexPatterns");
/**
 * this lexer can read next pattern
 * ===================================================================
 * |IType3;
 * ===================================================================
 */
var TypeMethodReturnTypeLexer = /** @class */ (function (_super) {
    __extends(TypeMethodReturnTypeLexer, _super);
    function TypeMethodReturnTypeLexer(parentMethod) {
        var _this = _super.call(this, TypeMethodReturnTypeLexer.name, [
            {
                validator: /^\|$/g,
                required: false,
                action: function (symbol) {
                }
            },
            {
                validator: RegexPatterns_1.regexPatterns.types.array,
                required: false,
                action: function (symbol) {
                    parentMethod.returnValues.push({
                        name: symbol.replace('[]', ''),
                        array: true,
                        nullable: false,
                    });
                    _this.exit();
                }
            },
            {
                validator: RegexPatterns_1.regexPatterns.types.object,
                required: true,
                action: function (symbol) {
                    parentMethod.returnValues.push({
                        name: symbol,
                        array: false,
                        nullable: false,
                    });
                    _this.exit();
                }
            },
        ]) || this;
        _this.parentMethod = parentMethod;
        _this.lexerDidAddedToStack = function () {
            console.log("[" + _this.name + "][lexerDidAddedToStack] lifecycle method call");
        };
        _this.lexerWillRemoveFromStack = function () {
            console.log("[" + _this.name + "][lexerWillRemoveFromStack] lifecycle method call");
        };
        return _this;
    }
    return TypeMethodReturnTypeLexer;
}(ILexer_1.ILexer));
exports.TypeMethodReturnTypeLexer = TypeMethodReturnTypeLexer;
