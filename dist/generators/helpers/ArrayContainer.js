"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayContainer = /** @class */ (function () {
    function ArrayContainer() {
        var _this = this;
        this.prohibitedPaths = [];
        this.allowed = function (op) {
            var allowed = true;
            var path = op.breadcrumbs.map(function (b) { return b.name; }).join('.');
            var prohibited = _this.prohibitedPaths.find(function (p) { return path.indexOf(p) !== -1; });
            if (prohibited && prohibited.length !== path.length) {
                allowed = false;
            }
            if (op.type.array) {
                _this.prohibitedPaths.push(path);
            }
            return allowed;
        };
    }
    return ArrayContainer;
}());
exports.ArrayContainer = ArrayContainer;
