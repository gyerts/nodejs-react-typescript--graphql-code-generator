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
var Composite_Type_1 = require("../../Composite.Type");
/**
 * this lexer can read next pattern
 * ===================================================================
 * export interface Foo { <Composite.Type> }
 * ===================================================================
 */
var LexerInterface = /** @class */ (function (_super) {
    __extends(LexerInterface, _super);
    function LexerInterface() {
        var _this = _super.call(this, LexerInterface.name, [
            {
                validator: /^export$/g,
                required: false,
                action: function (symbol, lexer) {
                }
            },
            {
                validator: /^interface$/g,
                required: true,
                action: function (symbol, lexer) {
                }
            },
            {
                validator: RegexPatterns_1.regexPatterns.nameConventions.InterfaceName,
                required: true,
                action: function (symbol, lexer) {
                    _this.interface.name = symbol;
                }
            },
            {
                validator: /{/g,
                required: true,
                action: function (symbol, lexer) {
                    __1.ctrl.addLexer(new Composite_Type_1.CompositeType(_this.interface));
                }
            },
            {
                validator: /}/g,
                required: true,
                action: function (symbol, lexer) {
                    __1.ctrl.env.interfaces.push(_this.interface);
                    _this.exit();
                }
            }
        ]) || this;
        _this.interface = {
            name: '',
            members: [],
            methods: [],
        };
        _this.lexerDidAddedToStack = function () {
            console.log("[" + _this.name + "][lexerDidAddedToStack] lifecycle method call");
        };
        _this.lexerWillRemoveFromStack = function () {
            console.log("[" + _this.name + "][lexerWillRemoveFromStack] lifecycle method call");
        };
        return _this;
    }
    return LexerInterface;
}(ILexer_1.ILexer));
exports.LexerInterface = LexerInterface;
