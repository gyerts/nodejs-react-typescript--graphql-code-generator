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
 * export interface Foo { <Composite.Type> }
 * ===================================================================
 */
var ILexer_1 = require("../../../../../interfaces/ILexer");
var RegexPatterns_1 = require("../../../../../classes/RegexPatterns");
var LexerDefailtImportName = /** @class */ (function (_super) {
    __extends(LexerDefailtImportName, _super);
    function LexerDefailtImportName() {
        var _this = _super.call(this, LexerDefailtImportName.name, [
            {
                validator: /,/g,
                required: false,
                action: function (symbol, lexer) {
                }
            },
            {
                validator: RegexPatterns_1.regexPatterns.nameConventions.anyName,
                required: true,
                action: function (symbol, lexer) {
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
    return LexerDefailtImportName;
}(ILexer_1.ILexer));
exports.LexerDefailtImportName = LexerDefailtImportName;
