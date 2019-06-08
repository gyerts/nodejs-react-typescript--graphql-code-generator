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
/**
 * this lexer can read next pattern
 * ===================================================================
 * DefaultModule, { Module1, Module2 }
 * ===================================================================
 */
var ILexer_1 = require("../../../../../interfaces/ILexer");
var __1 = require("../../../../../..");
var Composite_ListedNames_1 = require("./Composite.ListedNames");
var LexerNamedImportName = /** @class */ (function (_super) {
    __extends(LexerNamedImportName, _super);
    function LexerNamedImportName() {
        var _this = _super.call(this, LexerNamedImportName.name, [
            {
                validator: /,/g,
                required: false,
                action: function (symbol, lexer) {
                }
            },
            {
                validator: /{/g,
                required: true,
                action: function (symbol, lexer) {
                    __1.ctrl.addLexer(new Composite_ListedNames_1.CompositeListedNames());
                }
            },
            {
                validator: /}/g,
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
    return LexerNamedImportName;
}(ILexer_1.ILexer));
exports.LexerNamedImportName = LexerNamedImportName;
