"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LexersController = /** @class */ (function () {
    function LexersController() {
        var _this = this;
        this.lexers = [];
        this.env = {
            interfaces: []
        };
        this.addLexer = function (lexer) {
            _this.lexers.push(lexer);
            _this.peekLexer().lexerDidAddedToStack();
        };
        this.popLexer = function () {
            _this.peekLexer().lexerWillRemoveFromStack();
            var deletedLexer = _this.lexers.pop();
            deletedLexer && deletedLexer.lexerDidRemovedFromStack();
            return deletedLexer;
        };
        this.peekLexer = function () {
            return _this.lexers[_this.lexers.length - 1];
        };
        this.handleSymbol = function (symbol) {
            try {
                _this.peekLexer().handle(symbol);
            }
            catch (e) {
                console.error(e);
                var callStack = _this.lexers.map(function (l) { return "[" + l.name + "]\n"; }).reverse().reduce(function (str, call) { return str += call; });
                throw e.toString() + "\n==== call stack ====\n" + callStack;
            }
        };
    }
    return LexersController;
}());
exports.LexersController = LexersController;
