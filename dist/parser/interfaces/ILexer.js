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
var __1 = require("../..");
var ILexer = /** @class */ (function () {
    function ILexer(name, validators) {
        var _this = this;
        this.name = name;
        this.validators = validators;
        this.currentValidatorIndex = 0;
        /**
         * This method checks - can this lexer handle set of passed symbols in args
         * @warning Be aware that this method call resets this lexer state to initial
         * @warning Even more this method call requires initial state of lexer
         */
        this.canHandleSymbols = function (symbols) {
            if (_this.currentValidatorIndex !== 0) {
                _this.throwException("\n            canHandleSymbols(...) -> this method call requires initial state,             \n  but " + _this.currentValidatorIndex + " steps passed");
            }
            var retVal = true;
            if (_this.validators.length < symbols.length) {
                retVal = false;
            }
            else {
                var handle_1 = function (symbol) {
                    var currentValidator = _this.next();
                    var valid = Boolean(symbol.match(currentValidator.validator));
                    if (!valid && !currentValidator.required) {
                        return handle_1(symbol);
                    }
                    else {
                        return valid;
                    }
                };
                symbols.map(function (symbol) {
                    retVal = retVal && handle_1(symbol);
                });
            }
            _this.reset();
            return retVal;
        };
        this.handle = function (symbol) {
            var currentValidator = _this.next();
            console.log(_this.name + ".validate(" + JSON.stringify(symbol) + ", \"" + currentValidator.validator + "\")");
            var valid = Boolean(symbol.match(currentValidator.validator));
            if (!valid && !currentValidator.required) {
                _this.handle(symbol);
            }
            else if (!valid) {
                _this.throwException("Unexpected symbol: " + JSON.stringify(symbol));
            }
            else {
                currentValidator.action(symbol, _this);
            }
        };
        this.next = function () {
            var validator = _this.validators[_this.currentValidatorIndex++];
            if (!validator) {
                console.log("[" + _this.name + "] pass symbol to parent validator, exit");
                __1.ctrl.popLexer();
                return __1.ctrl.peekLexer().next();
            }
            return validator;
        };
        this.reset = function () {
            _this.currentValidatorIndex = 0;
        };
        this.exit = function () {
            __1.ctrl.popLexer();
        };
        this.throwException = function (msg) {
            throw "[" + _this.name + "][" + (_this.currentValidatorIndex - 1) + "] " + msg;
        };
        /**
         * this method will be called when the lexer did added to the stack
         * */
        this.lexerDidAddedToStack = function () { };
        /**
         * this method will be called when the lexer will going to get removed from the stack
         * */
        this.lexerWillRemoveFromStack = function () { };
        /**
         * this method will be called when the lexer was removed from stack
         * */
        this.lexerDidRemovedFromStack = function () { };
    }
    return ILexer;
}());
exports.ILexer = ILexer;
var ICompositeLexer = /** @class */ (function (_super) {
    __extends(ICompositeLexer, _super);
    function ICompositeLexer(name, lexers) {
        var _this = _super.call(this, name, []) || this;
        _this.name = name;
        _this.lexers = lexers;
        _this.symbols = [];
        _this.handle = function (symbol) {
            var lexersReadyToHandleSymbol = [];
            _this.symbols.push(symbol);
            _this.lexers.map(function (lexer) {
                lexer().canHandleSymbols(_this.symbols) && lexersReadyToHandleSymbol.push(lexer());
            });
            if (lexersReadyToHandleSymbol.length === 1) {
                __1.ctrl.addLexer(lexersReadyToHandleSymbol[0]);
                _this.symbols.map(function (symbol) {
                    __1.ctrl.handleSymbol(symbol);
                });
                _this.symbols = [];
            }
            if (lexersReadyToHandleSymbol.length === 0) {
                _this.handleNoLexerFound(symbol);
            }
        };
        _this.removeComposedLexer = function (index) {
            _this.lexers = _this.lexers.slice(0, index).concat(_this.lexers.slice(index + 1, _this.lexers.length));
        };
        _this.handleNoLexerFound = function (symbol) {
            __1.ctrl.popLexer();
            __1.ctrl.peekLexer().handle(symbol);
            // this.throwException(`
            //    Unexpected symbol: ${JSON.stringify(symbol)}, \
            //    \n  no one lexer: ${JSON.stringify(this.lexers.map(l => l().name))} \
            //    \n  cannot parse this combination: ${JSON.stringify(this.symbols)}`);
        };
        return _this;
    }
    return ICompositeLexer;
}(ILexer));
exports.ICompositeLexer = ICompositeLexer;
