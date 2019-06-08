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
var ILexer_1 = require("../../../interfaces/ILexer");
var __1 = require("../../../..");
var RegexPatterns_1 = require("../../../classes/RegexPatterns");
var Composite_TypeMethodManyReturnType_1 = require("./Composite.TypeMethodManyReturnType");
var Composite_TypeMethodSignature_1 = require("./Composite.TypeMethodSignature");
/**
 * this lexer can read next pattern
 * ===================================================================
 * account: (token: string, name: string, age?: number) => IAccount;
 * ===================================================================
 */
var LexerTypeMethod = /** @class */ (function (_super) {
    __extends(LexerTypeMethod, _super);
    function LexerTypeMethod(parentInterface) {
        var _this = _super.call(this, LexerTypeMethod.name, [
            {
                validator: RegexPatterns_1.regexPatterns.nameConventions.anyName,
                required: true,
                action: function (symbol) {
                    _this.method.name = symbol;
                }
            },
            {
                validator: /^:$/g,
                required: true,
                action: function (symbol) {
                }
            },
            {
                validator: /^\($/g,
                required: true,
                action: function (symbol) {
                    __1.ctrl.addLexer(new Composite_TypeMethodSignature_1.CompositeTypeMethodSignature(_this.method));
                }
            },
            {
                validator: /^\)$/g,
                required: true,
                action: function (symbol) {
                }
            },
            {
                validator: /^=>$/g,
                required: true,
                action: function (symbol) {
                    __1.ctrl.addLexer(new Composite_TypeMethodManyReturnType_1.CompositeTypeMethodManyReturnType(_this.method));
                }
            },
            {
                validator: /^;$/g,
                required: true,
                action: function (symbol) {
                    _this.exit();
                }
            },
        ]) || this;
        _this.parentInterface = parentInterface;
        _this.method = {
            name: '',
            params: [],
            returnValues: [],
        };
        _this.lexerDidAddedToStack = function () {
            console.log("[" + _this.name + "][lexerDidAddedToStack] lifecycle method call");
        };
        _this.lexerWillRemoveFromStack = function () {
            console.log("[" + _this.name + "][lexerWillRemoveFromStack] lifecycle method call");
            if (!_this.method.name) {
                _this.throwException("invalid method body: " + JSON.stringify(_this.method));
            }
            _this.parentInterface.methods.push(_this.method);
        };
        return _this;
    }
    return LexerTypeMethod;
}(ILexer_1.ILexer));
exports.LexerTypeMethod = LexerTypeMethod;
