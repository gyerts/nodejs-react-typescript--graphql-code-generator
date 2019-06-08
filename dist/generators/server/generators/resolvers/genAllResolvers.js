"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var breadcrumbsToCapitalName_1 = require("../../../helpers/breadcrumbsToCapitalName");
var genRequestType_1 = require("./genRequestType");
var InterfacesWalker_1 = require("../../../../classes/InterfacesWalker");
var genInterfaceImplCallback_1 = require("./genInterfaceImplCallback");
var ArrayContainer_1 = require("../../../helpers/ArrayContainer");
var genRouteContext_1 = require("./genRouteContext");
var getInterface_1 = require("../../../helpers/getInterface");
var genRoute_1 = require("./genRoute");
var genDelegates_1 = require("./genDelegates");
var _ = "\n";
var ___ = "\n   ";
var ______ = "\n      ";
exports.genResolver = function (queryType, allInterfaces, mainInterfaceName) {
    var output = 'import {external, internal} from \'./interfaces\';';
    output += "" + _;
    output += "" + _;
    output += "/**\n";
    output += " * this is internal interfaces, wrappers for each node call,\n";
    output += " * each node call comes with context (_ctx_) with all params from all parents\n";
    output += " * */\n";
    // generate ${interface name}RequestType
    {
        var handledInterfaceNames_1 = [];
        // const arrayContainer = new ArrayContainer();
        var handler = function (breadcrumbName, ownParams, op, forClientOnly) {
            if (!forClientOnly) {
                var interfaceName = "I" + breadcrumbsToCapitalName_1.breadcrumbsToCapitalName(op.breadcrumbs) + "RequestType";
                if (!handledInterfaceNames_1.includes(interfaceName)) {
                    handledInterfaceNames_1.push(interfaceName);
                    var parentInterface = op.breadcrumbs[op.breadcrumbs.length - 2];
                    var parentInterfaceName = mainInterfaceName;
                    if (parentInterface) {
                        parentInterfaceName = parentInterface.interfaceName;
                    }
                    var queryIType = 'IQuery';
                    switch (queryType) {
                        case 'query': {
                            queryIType = 'IQuery';
                            break;
                        }
                        case 'mutation': {
                            queryIType = 'IMutation';
                            break;
                        }
                        case 'subscription': {
                            queryIType = 'ISubscription';
                            break;
                        }
                    }
                    output += genRequestType_1.genRequestType(queryIType, interfaceName, parentInterfaceName, ownParams, op);
                }
            }
        };
        var walker = new InterfacesWalker_1.InterfacesWalker(mainInterfaceName, allInterfaces, handler);
        walker.run();
    }
    output += "" + _;
    output += "" + _;
    output += "/**\n";
    output += " * this is internal interfaces, contains all self types, and types from parent calls\n";
    output += " * this props can by used in the middleware calls for checking some sort of restrictions, etc...\n";
    output += " * also this props can by used for fetching proper data from DB or rest\n";
    output += " * */\n";
    // generate ${interface name}RouteContext
    {
        var handledInterfaceNames_2 = [];
        var allOps_1 = [];
        var handler = function (breadcrumbName, ownParams, op, forClientOnly) {
            if (!forClientOnly) {
                allOps_1.push(op);
                var interfaceNameToCheck = op.breadcrumbs.map(function (b) { return b.name; }).join('.');
                if (!handledInterfaceNames_2.includes(interfaceNameToCheck)) {
                    handledInterfaceNames_2.push(interfaceNameToCheck);
                    var currentInterface = op.breadcrumbs[op.breadcrumbs.length - 1];
                    output += genRouteContext_1.genRouteContext(currentInterface.name, ownParams, op.type.array, op.breadcrumbs.map(function (b) { return b.name; }).join('.'), allOps_1);
                }
            }
        };
        // output += genRouteContext();
        var walker = new InterfacesWalker_1.InterfacesWalker(mainInterfaceName, allInterfaces, handler);
        walker.run();
    }
    output += "" + _;
    output += "" + _;
    output += "/**\n";
    output += " * this is public interfaces for correct overriding of node calls\n";
    output += " * you can write own callback, specify this interface, and put this callback into correct file\n";
    output += " * file should be named as GQL calls, like => account.project.user.story.event.ts\n";
    output += " * */\n";
    // generate ${interface name}ImplCallback
    {
        var arrayContainer = new ArrayContainer_1.ArrayContainer();
        var alreadyAddedCallbacks_1 = [];
        var handler = function (breadcrumbName, ownParams, op, forClientOnly) {
            if (!forClientOnly) {
                var interfaceName = breadcrumbsToCapitalName_1.breadcrumbsToCapitalName(op.breadcrumbs);
                if (!alreadyAddedCallbacks_1.includes(interfaceName) /*&& arrayContainer.allowed(op)*/) {
                    alreadyAddedCallbacks_1.push(interfaceName);
                    var currentInterfaceName = op.breadcrumbs[op.breadcrumbs.length - 1].type.name;
                    output += genInterfaceImplCallback_1.genInterfaceImplCallback(interfaceName, currentInterfaceName, op.type.array);
                }
            }
        };
        var walker = new InterfacesWalker_1.InterfacesWalker(mainInterfaceName, allInterfaces, handler);
        walker.run();
    }
    output += "" + _;
    output += "" + _;
    output += "/**\n";
    output += " * here your application on startup try to define is any real implementation exists\n";
    output += " * if not real implementation exists, will be connected dummy implementation\n";
    output += " * */\n";
    // generate ${breadcrumbs} delegates
    {
        var alreadyAddedDelegates_1 = [];
        var handler = function (breadcrumbName, ownParams, op, forClientOnly) {
            if (!forClientOnly) {
                var breadcrumbNames = op.breadcrumbs.map(function (b) { return b.name; }).join('.');
                if (!alreadyAddedDelegates_1.includes(breadcrumbNames)) {
                    alreadyAddedDelegates_1.push(breadcrumbNames);
                    output += genDelegates_1.genDelegates(queryType, op, allInterfaces);
                }
            }
        };
        var walker = new InterfacesWalker_1.InterfacesWalker(mainInterfaceName, allInterfaces, handler);
        walker.run();
    }
    output += "" + _;
    output += "" + _;
    output += "/**\n";
    output += " * here all nodes resolvers\n";
    output += " * this place decides to delegate call to real impl, and then forward to the next calls\n";
    output += " * */\n";
    // generate ${breadcrumbs} routes (resolvers)
    {
        var alreadyAddedRoutes_1 = [];
        var arrayContainer = new ArrayContainer_1.ArrayContainer();
        var handler = function (breadcrumbName, ownParams, op, forClientOnly) {
            if (!forClientOnly /*&& arrayContainer.allowed(op)*/) {
                var interfaceName = op.type.name === mainInterfaceName ? op.type.name.slice(1) : op.type.name;
                var breadcrumbNames = op.breadcrumbs.map(function (b) { return b.name; });
                if (!alreadyAddedRoutes_1.includes(breadcrumbNames.join('.'))) {
                    alreadyAddedRoutes_1.push(breadcrumbNames.join('.'));
                    switch (queryType) {
                        case 'query': {
                            output += genRoute_1.genQueryRoute(op, getInterface_1.getInterface(interfaceName, allInterfaces));
                            break;
                        }
                        case 'mutation': {
                            output += genRoute_1.genMutationRoute(op, getInterface_1.getInterface(interfaceName, allInterfaces));
                            break;
                        }
                        case 'subscription': {
                            output += genRoute_1.genSubscriptionRoute(op, getInterface_1.getInterface(interfaceName, allInterfaces));
                            break;
                        }
                    }
                }
            }
        };
        var walker = new InterfacesWalker_1.InterfacesWalker(mainInterfaceName, allInterfaces, handler);
        walker.run();
    }
    return output;
};
