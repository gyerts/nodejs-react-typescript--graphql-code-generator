import {IMethodParam} from '../../../../parser/interfaces/IMethodParam';
import {IObjectPath} from '../../../../classes/GQLObjectPath';
import {ITypeToTypescriptString} from '../../../helpers/ITypeToTypescriptString';
import {getPrimitiveName, getRouteContextName} from '../genNames';

const _ = `\n`;
const ___ = `\n   `;
const ______ = `\n      `;

export const genRequestType = (queryType: 'IQuery'|'IMutation'|'ISubscription', interfaceName: string, parentInterfaceName: string, ownParams: IMethodParam[], op: IObjectPath) => {
   let output = '';

   output = `export type ${interfaceName} = {`;
   output += `${___}_ctx_: ${getRouteContextName(op)};`;
   if (parentInterfaceName !== queryType) {
      output += `${___}_parent_: ${getPrimitiveName(parentInterfaceName)};`;
   }
   ownParams.map((p: IMethodParam) => {
      output += `${___}${ITypeToTypescriptString(p.name, p.type)}`;
   });
   output += `${_}};`;
   output += `${_}`;
   return output;
};
