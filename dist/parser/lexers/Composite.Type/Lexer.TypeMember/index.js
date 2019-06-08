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
var RegexPatterns_1 = require("../../../classes/RegexPatterns");
/**
 * this lexer can read next pattern
 * ===================================================================
 * account: IAccount;
 * ===================================================================
 */
var LexerTypeMember = /** @class */ (function (_super) {
    __extends(LexerTypeMember, _super);
    function LexerTypeMember(parentInterface) {
        var _this = _super.call(this, LexerTypeMember.name, [
            {
                validator: RegexPatterns_1.regexPatterns.nameConventions.anyName,
                required: true,
                action: function (symbol) {
                    _this.member.name = symbol;
                }
            },
            {
                validator: /^:$/g,
                required: true,
                action: function (symbol) {
                }
            },
            {
                validator: RegexPatterns_1.regexPatterns.types.array,
                required: false,
                action: function (symbol) {
                    _this.member.type.name = symbol.replace('[]', '');
                    _this.member.type.array = true;
                }
            },
            {
                validator: RegexPatterns_1.regexPatterns.types.object,
                required: false,
                action: function (symbol) {
                    _this.member.type.name = symbol;
                    _this.member.type.array = false;
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
        _this.parentInterface = parentInterface;
        _this.member = {
            name: '',
            type: {
                name: '',
                nullable: false,
                array: false,
            }
        };
        _this.lexerDidAddedToStack = function () {
            console.log("[" + _this.name + "][lexerDidAddedToStack] lifecycle method call");
        };
        _this.lexerWillRemoveFromStack = function () {
            console.log("[" + _this.name + "][lexerWillRemoveFromStack] lifecycle method call");
            if (!_this.member.name || !_this.member.type.name) {
                _this.throwException("invalid member body: " + JSON.stringify(_this.member));
            }
            _this.parentInterface.members.push(_this.member);
        };
        return _this;
    }
    return LexerTypeMember;
}(ILexer_1.ILexer));
exports.LexerTypeMember = LexerTypeMember;
