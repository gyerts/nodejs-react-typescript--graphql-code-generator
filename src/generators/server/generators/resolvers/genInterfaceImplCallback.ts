import {getPrimitiveName} from '../genNames';

const _ = `\n`;
const ___ = `\n   `;
const ______ = `\n      `;

export const genInterfaceImplCallback = (name: string, returnInterfaceName: string, isArray: boolean) => {
   let output = ``;

   if (isArray) {
      output += `${_}export type I${name}ImplCallback = (`;
      output += `${___}req: I${name}RequestType,`;
      output += `${_}) => ${getPrimitiveName(returnInterfaceName)}[];`;
      output += `${_}`;
   } else {
      output += `${_}export type I${name}ImplCallback = (`;
      output += `${___}req: I${name}RequestType,`;
      output += `${___}overrides: internal.${returnInterfaceName}`;
      output += `${_}) => ${getPrimitiveName(returnInterfaceName)};`;
      output += `${_}`;
   }

   return output;
};
