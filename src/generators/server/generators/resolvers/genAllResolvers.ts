import {IInterface} from '../../../../parser/interfaces/IInterface';
import {IMethodParam} from '../../../../parser/interfaces/IMethodParam';
import {IObjectPath} from '../../../../classes/GQLObjectPath';
import {breadcrumbsToCapitalName} from '../../../helpers/breadcrumbsToCapitalName';
import {genRequestType} from './genRequestType';
import {InterfacesWalker} from '../../../../classes/InterfacesWalker';
import {genInterfaceImplCallback} from './genInterfaceImplCallback';
import {ArrayContainer} from '../../../helpers/ArrayContainer';
import {genRouteContext} from './genRouteContext';
import {getInterface} from '../../../helpers/getInterface';
import {genMutationRoute, genQueryRoute, genSubscriptionRoute} from './genRoute';
import {genDelegates} from './genDelegates';

const _ = `\n`;
const ___ = `\n   `;
const ______ = `\n      `;

export const genResolver = (queryType: 'query'|'mutation'|'subscription', allInterfaces: IInterface[], mainInterfaceName: string) => {
   let output = 'import {external, internal} from \'./interfaces\';';
   output += `${_}`;
   output += `${_}`;

   output += `/**\n`;
   output += ` * this is internal interfaces, wrappers for each node call,\n`;
   output += ` * each node call comes with context (_ctx_) with all params from all parents\n`;
   output += ` * */\n`;


   // generate ${interface name}RequestType
   {
      const handledInterfaceNames: string[] = [];
      // const arrayContainer = new ArrayContainer();
      const handler = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean) => {
         if (!forClientOnly) {
            const interfaceName = `I${breadcrumbsToCapitalName(op.breadcrumbs)}RequestType`;
            if (!handledInterfaceNames.includes(interfaceName)) {
               handledInterfaceNames.push(interfaceName);

               const parentInterface = op.breadcrumbs[op.breadcrumbs.length - 2];
               let parentInterfaceName = mainInterfaceName;
               if (parentInterface) {
                  parentInterfaceName = parentInterface.interfaceName;
               }

               let queryIType: 'IQuery'|'IMutation'|'ISubscription' = 'IQuery';

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

               output += genRequestType(queryIType, interfaceName, parentInterfaceName, ownParams, op);
            }
         }
      };
      const walker = new InterfacesWalker(mainInterfaceName, allInterfaces, handler);
      walker.run();
   }

   output += `${_}`;
   output += `${_}`;
   output += `/**\n`;
   output += ` * this is internal interfaces, contains all self types, and types from parent calls\n`;
   output += ` * this props can by used in the middleware calls for checking some sort of restrictions, etc...\n`;
   output += ` * also this props can by used for fetching proper data from DB or rest\n`;
   output += ` * */\n`;

   // generate ${interface name}RouteContext
   {
      const handledInterfaceNames: string[] = [];
      const allOps: IObjectPath[] = [];
      const handler = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean) => {
         if (!forClientOnly) {
            allOps.push(op);
            const interfaceNameToCheck = op.breadcrumbs.map(b => b.name).join('.');

            if (!handledInterfaceNames.includes(interfaceNameToCheck)) {
               handledInterfaceNames.push(interfaceNameToCheck);

               const currentInterface = op.breadcrumbs[op.breadcrumbs.length - 1];
               output += genRouteContext(
                  currentInterface.name,
                  ownParams,
                  op.type.array,
                  op.breadcrumbs.map(b => b.name).join('.'),
                  allOps,
               );
            }
         }
      };
      // output += genRouteContext();
      const walker = new InterfacesWalker(mainInterfaceName, allInterfaces, handler);
      walker.run();
   }

   output += `${_}`;
   output += `${_}`;
   output += `/**\n`;
   output += ` * this is public interfaces for correct overriding of node calls\n`;
   output += ` * you can write own callback, specify this interface, and put this callback into correct file\n`;
   output += ` * file should be named as GQL calls, like => account.project.user.story.event.ts\n`;
   output += ` * */\n`;

   // generate ${interface name}ImplCallback
   {
      const arrayContainer = new ArrayContainer();
      const alreadyAddedCallbacks: string[] = [];
      const handler = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean) => {
         if (!forClientOnly) {
            const interfaceName = breadcrumbsToCapitalName(op.breadcrumbs);
            if (!alreadyAddedCallbacks.includes(interfaceName) /*&& arrayContainer.allowed(op)*/) {
               alreadyAddedCallbacks.push(interfaceName);
               const currentInterfaceName = op.breadcrumbs[op.breadcrumbs.length - 1].type.name;
               output += genInterfaceImplCallback(
                  interfaceName,
                  currentInterfaceName,
                  op.type.array
               );
            }
         }
      };
      const walker = new InterfacesWalker(mainInterfaceName, allInterfaces, handler);
      walker.run();
   }

   output += `${_}`;
   output += `${_}`;
   output += `/**\n`;
   output += ` * here your application on startup try to define is any real implementation exists\n`;
   output += ` * if not real implementation exists, will be connected dummy implementation\n`;
   output += ` * */\n`;

   // generate ${breadcrumbs} delegates
   {
      const alreadyAddedDelegates: string[] = [];
      const handler = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean) => {
         if (!forClientOnly) {
            const breadcrumbNames = op.breadcrumbs.map(b => b.name).join('.');

            if (!alreadyAddedDelegates.includes(breadcrumbNames)) {
               alreadyAddedDelegates.push(breadcrumbNames);
               output += genDelegates(queryType, op, allInterfaces);
            }
         }
      };
      const walker = new InterfacesWalker(mainInterfaceName, allInterfaces, handler);
      walker.run();
   }

   output += `${_}`;
   output += `${_}`;
   output += `/**\n`;
   output += ` * here all nodes resolvers\n`;
   output += ` * this place decides to delegate call to real impl, and then forward to the next calls\n`;
   output += ` * */\n`;

   // generate ${breadcrumbs} routes (resolvers)
   {
      const alreadyAddedRoutes: string[] = [];
      const arrayContainer = new ArrayContainer();
      const handler = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean) => {
         if (!forClientOnly /*&& arrayContainer.allowed(op)*/) {
            const interfaceName = op.type.name === mainInterfaceName ? op.type.name.slice(1) : op.type.name;
            const breadcrumbNames = op.breadcrumbs.map(b => b.name);

            if (!alreadyAddedRoutes.includes(breadcrumbNames.join('.'))) {
               alreadyAddedRoutes.push(breadcrumbNames.join('.'));
               switch (queryType) {
                  case 'query': {
                     output += genQueryRoute(op, getInterface(interfaceName, allInterfaces));
                     break;
                  }
                  case 'mutation': {
                     output += genMutationRoute(op, getInterface(interfaceName, allInterfaces));
                     break;
                  }
                  case 'subscription': {
                     output += genSubscriptionRoute(op, getInterface(interfaceName, allInterfaces));
                     break;
                  }
               }
            }
         }
      };
      const walker = new InterfacesWalker(mainInterfaceName, allInterfaces, handler);
      walker.run();
   }

   return output;
};
