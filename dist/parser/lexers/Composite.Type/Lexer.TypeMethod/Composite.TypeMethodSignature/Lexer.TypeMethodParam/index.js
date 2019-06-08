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
 * account: (token: string, name: string, age: number) => IAccount;
 * ===================================================================
 */
var LexerTypeMethodParam = /** @class */ (function (_super) {
    __extends(LexerTypeMethodParam, _super);
    function LexerTypeMethodParam(parentMethod) {
        var _this = _super.call(this, LexerTypeMethodParam.name, [
            {
                validator: /^,$/g,
                required: false,
                action: function (symbol) {
                }
            },
            {
                validator: RegexPatterns_1.regexPatterns.nameConventions.anyName,
                required: true,
                action: function (symbol) {
                    _this.param.name = symbol;
                }
            },
            {
                validator: /^\?$/g,
                required: false,
                action: function (symbol) {
                    _this.param.type.nullable = true;
                }
            },
            {
                validator: /^:$/g,
                required: true,
                action: function (symbol) {
                }
            },
            {
                validator: RegexPatterns_1.regexPatterns.types.object,
                required: false,
                action: function (symbol) {
                    _this.param.type = {
                        name: symbol,
                        array: false,
                        nullable: false,
                    };
                    _this.exit();
                }
            },
            {
                validator: RegexPatterns_1.regexPatterns.types.array,
                required: false,
                action: function (symbol) {
                    _this.param.type = {
                        name: symbol.replace('[]', ''),
                        array: true,
                        nullable: false,
                    };
                    _this.exit();
                }
            },
        ]) || this;
        _this.parentMethod = parentMethod;
        _this.param = {
            name: '',
            type: {
                name: '',
                array: false,
                nullable: false,
            }
        };
        _this.lexerDidAddedToStack = function () {
            console.log("[" + _this.name + "][lexerDidAddedToStack] lifecycle method call");
        };
        _this.lexerWillRemoveFromStack = function () {
            console.log("[" + _this.name + "][lexerWillRemoveFromStack] lifecycle method call");
            if (_this.param.name && _this.param.type.name) {
                _this.parentMethod.params.push(_this.param);
            }
            else {
                _this.throwException("invalid param body: " + JSON.stringify(_this.param));
            }
        };
        return _this;
    }
    return LexerTypeMethodParam;
}(ILexer_1.ILexer));
exports.LexerTypeMethodParam = LexerTypeMethodParam;
