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
var Composite_ImportMixedImportNames_1 = require("./Composite.ImportMixedImportNames");
/**
 * this lexer can read next pattern
 * ===================================================================
 * import DefaultModule, { Module1, Module2 } from '../path';
 * ===================================================================
 */
var LexerImport = /** @class */ (function (_super) {
    __extends(LexerImport, _super);
    function LexerImport() {
        var _this = _super.call(this, LexerImport.name, [
            {
                validator: /^import$/g,
                required: true,
                action: function (symbol, lexer) {
                    __1.ctrl.addLexer(new Composite_ImportMixedImportNames_1.CompositeImportMixedImportNames());
                }
            },
            {
                validator: /^from$/g,
                required: true,
                action: function (symbol, lexer) {
                }
            },
            {
                validator: RegexPatterns_1.regexPatterns.import.path,
                required: true,
                action: function (symbol, lexer) {
                }
            },
            {
                validator: /^;$/g,
                required: true,
                action: function (symbol, lexer) {
                    _this.exit();
                }
            }
        ]) || this;
        _this.lexerDidAddedToStack = function () {
            console.log("[" + _this.name + "][lexerDidAddedToStack] lifecycle method call");
        };
        _this.lexerWillRemoveFromStack = function () {
            console.log("[" + _this.name + "][lexerWillRemoveFromStack] lifecycle method call");
        };
        return _this;
    }
    return LexerImport;
}(ILexer_1.ILexer));
exports.LexerImport = LexerImport;
