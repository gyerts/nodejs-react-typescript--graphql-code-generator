"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../../settings");
var fs_1 = __importDefault(require("fs"));
var genMethodParams_1 = require("../../helpers/genMethodParams");
var getFullListOfParamsNoParent_1 = require("../../helpers/getFullListOfParamsNoParent");
var InterfacesWalker_1 = require("../../../classes/InterfacesWalker");
var genNames_1 = require("../../server/generators/genNames");
var Node = /** @class */ (function () {
    function Node(name, ownParams) {
        var _this = this;
        this.name = name;
        this.ownParams = ownParams;
        this.children = {};
        this.variants = [];
        this.add = function (ownParams, op) {
            if (!_this.variants.find(function (v) { return v.op.type.name === op.type.name; })) {
                _this.variants.push({ ownParams: ownParams, op: op });
            }
        };
    }
    return Node;
}());
var NodeHolder = /** @class */ (function () {
    function NodeHolder() {
        var _this = this;
        this.node = new Node('query', []);
        this.entries = [];
        this.initStructure = function (breadcrumbs) {
            var currentNode = _this.node;
            breadcrumbs.map(function (b) {
                if (!currentNode.children[b.name]) {
                    currentNode.children[b.name] = new Node(b.name, b.params);
                }
                currentNode = currentNode.children[b.name];
            });
        };
        this.getNode = function (breadcrumbs) {
            var currentNode = _this.node;
            breadcrumbs.map(function (b) {
                currentNode = currentNode.children[b.name];
            });
            return currentNode;
        };
        this.add = function (ownParams, op) {
            _this.initStructure(op.breadcrumbs);
            var currentNode = _this.getNode(op.breadcrumbs);
            currentNode.add(ownParams, op);
        };
    }
    return NodeHolder;
}());
var transformDataForGeneration = function (allInterfaces, globalInterfaceName) {
    var nodeHolder = new NodeHolder();
    var prohibitedPaths = [];
    var handlerInDataTransform = function (breadcrumbName, ownParams, op) {
        var objectPath = op.breadcrumbs.map(function (b) { return b.name; }).join('.');
        var prohibited = prohibitedPaths.find(function (p) { return objectPath.indexOf(p) !== -1; });
        var allowed = true;
        if (prohibited && prohibited.length !== objectPath.length) {
            allowed = false;
        }
        if (op.type.array) {
            prohibitedPaths.push(objectPath);
        }
        if (allowed) {
            nodeHolder.add(ownParams, op);
        }
    };
    var walkerDataTransform = new InterfacesWalker_1.InterfacesWalker(globalInterfaceName, allInterfaces, handlerInDataTransform);
    walkerDataTransform.run();
    return nodeHolder;
};
var genTransformedData = function (allInterfaces, globalInterfaceName) {
    var output = 'import { graphQlRequests } from \'./requests\';\n';
    output += 'import * as i from \'./query.interfaces\';\n';
    output += 'import * as q from \'./query.queries\';\n\n';
    output += 'export const query = {';
    var entriesPath = [];
    var getPromiseTypeString = function (type) {
        return 'i.' + type.name + (type.array ? '[]' : '');
    };
    var genFunction = function (breadcrumbName, ownParams, op) {
        var __ = '\n' + tab_space.repeat(op.breadcrumbs.length);
        var ____ = '\n' + tab_space.repeat(op.breadcrumbs.length + 1);
        var ______ = '\n' + tab_space.repeat(op.breadcrumbs.length + 2);
        var ________ = '\n' + tab_space.repeat(op.breadcrumbs.length + 3);
        var responseType = "i." + genNames_1.getNamespaceName(op) + "." + op.type.name + "Response";
        var joinedAllParams = op.signatureParams.map(function (p) { return p.name; }).join(', ');
        var params = genMethodParams_1.genMethodParams(getFullListOfParamsNoParent_1.getFullListOfParamsNoParent(op.type.name, allInterfaces));
        var methodName = "fetch" + (op.type.array ? 'Array' : '') + op.type.name;
        output += "" + ____ + methodName + ": async (" + params + "): Promise<" + getPromiseTypeString(op.type) + "> => {";
        output += ______ + "const response = await graphQlRequests.query<" + responseType + ">(";
        output += ________ + "q." + entriesPath.join('_') + "_" + op.type.name + "_fields(" + joinedAllParams + ")";
        output += ______ + ");";
        output += ______ + "console.log(response);";
        output += ______ + "return response." + entriesPath.join('.') + ";";
        output += ____ + "},";
    };
    var nodeHolder = transformDataForGeneration(allInterfaces, globalInterfaceName);
    var handle = function (node) {
        entriesPath.push(node.name);
        var ___ = '\n' + tab_space.repeat(entriesPath.length);
        var ______ = '\n' + tab_space.repeat(entriesPath.length + 1);
        var _________ = '\n' + tab_space.repeat(entriesPath.length + 2);
        var params = genMethodParams_1.genMethodParamsWithPrefix(node.ownParams);
        output += "" + ___ + node.name + ": (" + params + ") => ({";
        node.variants.map(function (v) {
            genFunction(node.name, v.ownParams, v.op);
        });
        Object.keys(node.children).map(function (key) {
            handle(node.children[key]);
        });
        output += ___ + "}),";
        entriesPath.pop();
    };
    Object.keys(nodeHolder.node.children).map(function (key) {
        handle(nodeHolder.node.children[key]);
    });
    output += '\n};\n';
    return output;
};
var tab_space = '   ';
exports.generateRequestsFile = function (globalInterfaceName, allInterfaces) {
    var output = genTransformedData(allInterfaces, globalInterfaceName);
    fs_1.default.writeFile(settings_1.options.clientOutDir.get() + "/query.requests.ts", output, function (err) {
        if (err) {
            return console.error(err);
        }
    });
};
