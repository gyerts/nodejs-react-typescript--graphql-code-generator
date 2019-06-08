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
 * this lexer contains only other lexers, this lexer delegates recognition to the other lexers
 */
var ILexer_1 = require("../../../../../../interfaces/ILexer");
var Lexer_ListedName_1 = require("./Lexer.ListedName");
var CompositeListedNames = /** @class */ (function (_super) {
    __extends(CompositeListedNames, _super);
    function CompositeListedNames() {
        var _this = _super.call(this, CompositeListedNames.name, [
            function () { return new Lexer_ListedName_1.LexerListedName(); }
        ]) || this;
        _this.lexerDidAddedToStack = function () {
            console.log("[" + _this.name + "][lexerDidAddedToStack] lifecycle method call");
        };
        _this.lexerWillRemoveFromStack = function () {
            console.log("[" + _this.name + "][lexerWillRemoveFromStack] lifecycle method call");
        };
        return _this;
    }
    return CompositeListedNames;
}(ILexer_1.ICompositeLexer));
exports.CompositeListedNames = CompositeListedNames;
