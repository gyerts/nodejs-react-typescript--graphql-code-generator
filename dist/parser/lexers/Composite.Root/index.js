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
var ILexer_1 = require("../../interfaces/ILexer");
var Lexer_Interface_1 = require("./Lexer.Interface");
var Lexer_Import_1 = require("./Lexer.Import");
/**
 * this lexer contains only other lexers, this lexer delegates recognition to the other lexers
 */
var CompositeRoot = /** @class */ (function (_super) {
    __extends(CompositeRoot, _super);
    function CompositeRoot() {
        var _this = _super.call(this, CompositeRoot.name, [
            function () { return new Lexer_Interface_1.LexerInterface(); },
            function () { return new Lexer_Import_1.LexerImport(); },
        ]) || this;
        _this.lexerDidAddedToStack = function () {
            console.log("[" + _this.name + "][lexerDidAddedToStack] lifecycle method call");
        };
        _this.lexerWillRemoveFromStack = function () {
            console.log("[" + _this.name + "][lexerWillRemoveFromStack] lifecycle method call");
        };
        return _this;
    }
    return CompositeRoot;
}(ILexer_1.ICompositeLexer));
exports.CompositeRoot = CompositeRoot;
