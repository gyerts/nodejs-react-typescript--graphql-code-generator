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
var ILexer_1 = require("../../../../interfaces/ILexer");
var Lexer_NamedImportName_1 = require("./Lexer.NamedImportName");
var Lexer_DefailtImportName_1 = require("./Lexer.DefailtImportName");
/**
 * this lexer can read next pattern
 * ===================================================================
 * DefaultModule, { Module1, Module2 }
 * ===================================================================
 */
var CompositeImportMixedImportNames = /** @class */ (function (_super) {
    __extends(CompositeImportMixedImportNames, _super);
    function CompositeImportMixedImportNames() {
        var _this = _super.call(this, CompositeImportMixedImportNames.name, [
            function () {
                var lexer = new Lexer_DefailtImportName_1.LexerDefailtImportName();
                lexer.lexerDidRemovedFromStack = function () {
                    // only one default import allowed
                    _this.removeComposedLexer(0);
                };
                return lexer;
            },
            function () {
                var lexer = new Lexer_NamedImportName_1.LexerNamedImportName();
                // no default imports allowed after named imports
                lexer.lexerDidRemovedFromStack = function () {
                    _this.exit();
                };
                return lexer;
            },
        ]) || this;
        _this.lexerDidAddedToStack = function () {
            console.log("[" + _this.name + "][lexerDidAddedToStack] lifecycle method call");
        };
        _this.lexerWillRemoveFromStack = function () {
            console.log("[" + _this.name + "][lexerWillRemoveFromStack] lifecycle method call");
        };
        return _this;
    }
    return CompositeImportMixedImportNames;
}(ILexer_1.ICompositeLexer));
exports.CompositeImportMixedImportNames = CompositeImportMixedImportNames;
