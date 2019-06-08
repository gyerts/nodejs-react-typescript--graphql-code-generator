"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tag_1 = __importDefault(require("graphql-tag"));
var apollo_boost_1 = require("apollo-boost");
var apollo_link_ws_1 = require("apollo-link-ws");
var apollo_link_error_1 = require("apollo-link-error");
var apollo_utilities_1 = require("apollo-utilities");
var errorLink = apollo_link_error_1.onError(function (_a) {
    var graphQLErrors = _a.graphQLErrors, networkError = _a.networkError;
    if (graphQLErrors) {
        graphQLErrors.map(function (_a) {
            var message = _a.message, locations = _a.locations, path = _a.path;
            return console.error("[GraphQL error]: Message: " + message + ", Location: " + locations + ", Path: " + path);
        });
    }
    if (networkError) {
        console.error("[Network error]: " + networkError);
    }
});
var links = [];
links.push(errorLink);
var headers = {};
var wsLink = new apollo_link_ws_1.WebSocketLink({
    uri: "ws://127.0.0.1:4001/graphql",
    options: {
        reconnect: true
    }
});
var httpLink = new apollo_boost_1.HttpLink({
    uri: 'http://127.0.0.1:4001/graphql',
    headers: headers,
});
var link = apollo_boost_1.split(function (_a) {
    var query = _a.query;
    var _b = apollo_utilities_1.getMainDefinition(query), kind = _b.kind, operation = _b.operation;
    return kind === 'OperationDefinition' && operation === 'subscription';
}, wsLink, httpLink);
exports.apolloClient = new apollo_boost_1.ApolloClient({
    link: link,
    cache: new apollo_boost_1.InMemoryCache(),
});
exports.graphQlRequests = {
    /**
     * Make request with query to graphQL endpoint
     * Body of query you should crete manually
     * @param stringBody only query body without keyword 'query'
     * @param fetchPolicy one of FetchPolicy type
     * @returns {Promise<any>}
     */
    query: function (stringBody, fetchPolicy) {
        if (fetchPolicy === void 0) { fetchPolicy = 'no-cache'; }
        return __awaiter(_this, void 0, void 0, function () {
            var query, req;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "query {\n   " + stringBody.trim() + "\n}";
                        console.debug(query);
                        return [4 /*yield*/, exports.apolloClient
                                .query({
                                query: graphql_tag_1.default(query),
                                fetchPolicy: fetchPolicy,
                            })
                                .catch(function () {
                                console.log('GRAPHQL error');
                                return undefined;
                            })];
                    case 1:
                        req = _a.sent();
                        return [2 /*return*/, req ? req.data : undefined];
                }
            });
        });
    },
    /**
     * Make request with mutation to graphQL endpoint
     * Body of mutation you should crete manually
     * @param stringBody only mutation body without keyword 'mutation'
     * @returns {Promise<any>}
     */
    mutate: function (stringBody) { return __awaiter(_this, void 0, void 0, function () {
        var mutation, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mutation = "mutation {\n            " + stringBody + "\n         }";
                    console.debug(mutation);
                    return [4 /*yield*/, exports.apolloClient.mutate({ mutation: graphql_tag_1.default(mutation) })];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    }); },
    /**
     * Make subscription at graphQL endpoint
     * Body of subscription you should crete manually
     * @param stringBody only subscription body without keyword 'subscription'
     * @param next callback for each message
     * @returns {ZenObservable.Subscription | null}
     */
    subscribe: function (stringBody, next) {
        var subscription = "subscription {\n            " + stringBody + "\n         }";
        console.debug(subscription);
        var sub = exports.apolloClient.subscribe({
            query: graphql_tag_1.default(subscription),
            variables: {},
        });
        return sub.subscribe(next) ? sub : null;
    },
};
