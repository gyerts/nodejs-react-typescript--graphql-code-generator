import {ITypeToTypescriptString} from '../../../helpers/ITypeToTypescriptString';
import {IMethodParam} from '../../../../parser/interfaces/IMethodParam';
import {IObjectPath} from '../../../../classes/GQLObjectPath';
import {getRouteContextName} from '../genNames';

const _ = `\n`;
const ___ = `\n   `;
const ______ = `\n      `;

export const genRouteContext = (
   name: string,
   ownParams: IMethodParam[],
   isArray: boolean,
   breadcrumbsPath: string,
   allOps: IObjectPath[],
) => {
   let output = ``;

   let currentObjectPath: IObjectPath|null = null;
   let parentObjectPath: IObjectPath|null = null;

   const parentOpBreadcrumbsPath = breadcrumbsPath.split('.').slice(0, -1).join('.');

   allOps.map(op => {
      const path = op.breadcrumbs.map(b => b.name).join('.');
      if (path === breadcrumbsPath) {
         currentObjectPath = op;
      } else if (path === parentOpBreadcrumbsPath) {
         parentObjectPath = op;
      }
   });

   // if (!isArray) {
      if (currentObjectPath && parentObjectPath) {
         output += `export type ${getRouteContextName(currentObjectPath)} = ${getRouteContextName(parentObjectPath)} & {`;
      } else if (currentObjectPath) {
         output += `export type ${getRouteContextName(currentObjectPath)} = {`;
      }
      ownParams.map((p: IMethodParam) => {
         output += `${___}${name}_${ITypeToTypescriptString(p.name, p.type)}`;
      });
      output += `${_}};`;
      output += `${_}`;
   // }

   return output;
};
