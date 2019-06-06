import {IBreadcrumb, IObjectPath} from '../../../../classes/GQLObjectPath';
import {IInterface} from '../../../../parser/interfaces/IInterface';
import {primitiveTypes} from '../../../../helpers';
import {breadcrumbsToCapitalName} from '../../../helpers/breadcrumbsToCapitalName';
import {getPrimitiveName, getRouteContextName, getRouteName} from '../genNames';

const _ = `\n`;
const ___ = `\n   `;
const ______ = `\n      `;

const genRouteWithDelegateCall = (
   queryType: 'query'|'mutation'|'subscription',
   op: IObjectPath,
   i: IInterface,
   lastB: IBreadcrumb,
   bName: string,
   primitiveResponse: string,
   isFirst: boolean,
) => {
   let output = '';
   output += `${___}const context: ${getRouteContextName(op)} = {`;
   !isFirst && (output += `${______}...req._ctx_,`);
   lastB.params.map(p => {
      output += `${______}${p.name}: req.${p.name.slice(lastB.name.length + 1)},`;
   });
   output += `${___}};`;

   output += `${___}let ${primitiveResponse}: ${getPrimitiveName(lastB.type.name)};`;

   output += `${___}const node: internal.${i.name} = {`;
   i.members.map(m => {
      if (!primitiveTypes.includes(m.type.name)) {
         const routeName = getRouteName(queryType, op, m.name);
         output += `${______}${m.name}: () => ${routeName}({ _ctx_: context, _parent_: ${primitiveResponse} }),`;
      }
   });
   i.methods.map(m => {
      if (!primitiveTypes.includes(m.returnValues[0].name)) {
         const routeName = getRouteName(queryType, op, m.name);
         output += `${______}${m.name}: (req: any) => ${routeName}({ _ctx_: context, _parent_: ${primitiveResponse}, ...req }),`;
      }
   });
   output += `${___}};`;

   !isFirst && (output += `${___}req._ctx_ = context;`);
   output += `${___}${primitiveResponse} = await ${bName}_delegate.${lastB.name}Impl(req, node);`;
   output += `${___}return { ...${primitiveResponse}, ...node };`;
   return output;
};

const genOnlyRoute = (
   queryType: 'query'|'mutation'|'subscription',
   op: IObjectPath,
   i: IInterface,
   lastB: IBreadcrumb,
   bName: string,
   primitiveResponse: string,
   isFirst: boolean,
) => {
   let output = '';
   output += `${___}const context: ${getRouteContextName(op)} = {`;
   !isFirst && (output += `${______}...req._ctx_,`);
   lastB.params.map(p => {
      output += `${______}${p.name}: req.${p.name.slice(lastB.name.length + 1)},`;
   });
   output += `${___}};`;

   output += `${___}const node: internal.${i.name} = {`;
   i.members.map(m => {
      if (!primitiveTypes.includes(m.type.name)) {
         const routeName = getRouteName(queryType, op, m.name);
         output += `${______}${m.name}: () => ${routeName}({ _ctx_: context, _parent_: {} }),`;
      }
   });
   i.methods.map(m => {
      if (!primitiveTypes.includes(m.returnValues[0].name)) {
         const routeName = getRouteName(queryType, op, m.name);
         output += `${______}${m.name}: (req: any) => ${routeName}({ _ctx_: context, _parent_: {}, ...req }),`;
      }
   });
   output += `${___}};`;

   !isFirst && (output += `${___}req._ctx_ = context;`);
   output += `${___}return { ...node };`;
   return output;
};

const genRouteForArray = (
   queryType: 'query'|'mutation'|'subscription',
   op: IObjectPath,
   i: IInterface,
   lastB: IBreadcrumb,
   bName: string,
   primitiveResponse: string,
   isFirst: boolean,
) => {
   let output = '';
   output += `${___}const response = await ${bName}_delegate.${lastB.name}Impl(req);`;

   {
      output += `${___}response.map((_parent_: any) => {`;
      i.members.map(m => {
         if (!primitiveTypes.includes(m.type.name)) {
            const routeName = getRouteName(queryType, op, m.name);
            output += `${______}_parent_['${m.name}'] = () => ${routeName}({ _ctx_: req._ctx_, _parent_ });`;
         }
      });
      i.methods.map(m => {
         if (!primitiveTypes.includes(m.returnValues[0].name)) {
            const routeName = getRouteName(queryType, op, m.name);
            output += `${______}_parent_['${m.name}'] = (r: any) => ${routeName}({ _ctx_: { ...req._ctx_, ...r._ctx_ }, _parent_, ...r });`;
         }
      });
      output += `${___}});`;
   }

   output += `${___}return response;`;
   return output;
};




export const genMutationRoute = (op: IObjectPath, i: IInterface) => {
   let output = ``;

   const bName = op.breadcrumbs.map(b => b.name).join('_');
   const lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
   const primitiveResponse = `${lastB.name}Primitives`;
   const routeName = getRouteName('mutation', op);
   const primitiveMembers = i.members.filter(m => primitiveTypes.includes(m.type.name));
   const isFirst = op.breadcrumbs.length === 1;

   output += `${_}export const ${routeName}: any = async (req: I${breadcrumbsToCapitalName(op.breadcrumbs)}RequestType) => {`;

   if (lastB.type.array) {
      output += genRouteForArray('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
   } else if (lastB.params.length) {
      output += genRouteWithDelegateCall('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
   } else if (!primitiveMembers.length) {
      output += genOnlyRoute('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
   } else {
      output += genRouteWithDelegateCall('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
   }

   output += `${_}};`;
   output += `${_}`;

   return output;
};

export const genSubscriptionRoute = (op: IObjectPath, i: IInterface) => {
   let output = ``;

   const bName = op.breadcrumbs.map(b => b.name).join('_');
   const lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
   const primitiveResponse = `${lastB.name}Primitives`;
   const routeName = getRouteName('subscription', op);
   const primitiveMembers = i.members.filter(m => primitiveTypes.includes(m.type.name));
   const isFirst = op.breadcrumbs.length === 1;

   output += `${_}export const ${routeName}: any = async (req: I${breadcrumbsToCapitalName(op.breadcrumbs)}RequestType) => {`;

   if (lastB.type.array) {
      output += genRouteForArray('subscription', op, i, lastB, bName, primitiveResponse, isFirst);
   } else if (lastB.params.length) {
      output += genRouteWithDelegateCall('subscription', op, i, lastB, bName, primitiveResponse, isFirst);
   } else if (!primitiveMembers.length) {
      output += genOnlyRoute('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
   } else {
      output += genRouteWithDelegateCall('mutation', op, i, lastB, bName, primitiveResponse, isFirst);
   }

   output += `${_}};`;
   output += `${_}`;

   return output;
};

export const genQueryRoute = (op: IObjectPath, i: IInterface) => {
   let output = ``;

   const bName = op.breadcrumbs.map(b => b.name).join('_');
   const lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
   const primitiveResponse = `${lastB.name}Primitives`;
   const routeName = getRouteName('query', op);
   const isFirst = op.breadcrumbs.length === 1;

   output += `${_}export const ${routeName}: any = async (req: I${breadcrumbsToCapitalName(op.breadcrumbs)}RequestType) => {`;

   if (lastB.type.array) {
      output += genRouteForArray('query', op, i, lastB, bName, primitiveResponse, isFirst);
   } else {
      output += genRouteWithDelegateCall('query', op, i, lastB, bName, primitiveResponse, isFirst);
   }

   output += `${_}};`;
   output += `${_}`;

   return output;
};
