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
var Lexer_TypeMethod_1 = require("./Lexer.TypeMethod");
var Lexer_TypeMember_1 = require("./Lexer.TypeMember");
/**
 * this lexer contains only other lexers, this lexer delegates recognition to the other lexers
 */
var CompositeType = /** @class */ (function (_super) {
    __extends(CompositeType, _super);
    function CompositeType(parentInterface) {
        var _this = _super.call(this, CompositeType.name, [
            function () { return new Lexer_TypeMethod_1.LexerTypeMethod(parentInterface); },
            function () { return new Lexer_TypeMember_1.LexerTypeMember(parentInterface); },
        ]) || this;
        _this.lexerDidAddedToStack = function () {
            console.log("[" + _this.name + "][lexerDidAddedToStack] lifecycle method call");
        };
        _this.lexerWillRemoveFromStack = function () {
            console.log("[" + _this.name + "][lexerWillRemoveFromStack] lifecycle method call");
        };
        return _this;
    }
    return CompositeType;
}(ILexer_1.ICompositeLexer));
exports.CompositeType = CompositeType;
