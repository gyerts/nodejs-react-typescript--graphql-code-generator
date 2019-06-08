import {options} from '../../../settings';
import fs from 'fs';
import {IInterface} from '../../../parser/interfaces/IInterface';
import {IMethodParam} from '../../../parser/interfaces/IMethodParam';
import {IObjectPath} from '../../../classes/GQLObjectPath';
import {breadcrumbsToCapitalName} from '../../helpers/breadcrumbsToCapitalName';
import {InterfacesWalker} from '../../../classes/InterfacesWalker';
import {getInterface} from '../../helpers/getInterface';
import {genMethodParams} from '../../helpers/genMethodParams';
import {primitiveTypes} from '../../../helpers';

const _ = `\n`;
const ___ = `\n   `;
const ______ = `\n      `;

const gen = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean, allInterfaces: IInterface[]) => {
   let output = '';
   const lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
   const i = getInterface(lastB.interfaceName, allInterfaces);

   const primitiveMembers = i.members.filter(m => primitiveTypes.includes(m.type.name));
   const complexMembers = i.members.filter(m => !primitiveTypes.includes(m.type.name));


   output += `${_}export namespace internal {`;
   output += `${___}export type ${lastB.interfaceName} = {`;
   i.methods.map(m => {
      output += `${______}${m.name}?: (req: any, ${genMethodParams(m.params)}) => internal.${m.returnValues[0].name}${m.returnValues[0].array ? '[]' : ''}`;
   });
   complexMembers.map(m => {
      output += `${______}${m.name}?: (req: any) => internal.${m.type.name}${m.type.array ? '[]' : ''}`;
   });
   output += `${___}};`;
   output += `${_}}`;


   output += `${_}export namespace external {`;
   output += `${___}export type ${lastB.interfaceName}Primitives = {`;
   primitiveMembers.map(m => {
      output += `${______}${m.name}: ${m.type.name}${m.type.array ? '[]' : ''}`;
   });
   output += `${___}};`;
   output += `${_}}`;

   return output;
};

export const generateInterfacesFile = (allInterfaces: IInterface[]) => {
   const requestFilePath = `${options.serverOutDir.get()}/interfaces.ts`;
   let output = '';
   const handledInterfaceNames: string[] = [];

   const handler = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean) => {
      if (!forClientOnly) {
         const lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
         if (!handledInterfaceNames.includes(lastB.interfaceName)) {
            handledInterfaceNames.push(lastB.interfaceName);
            output += gen(breadcrumbName, ownParams, op, forClientOnly, allInterfaces);
         }
      }
   };
   {
      const walker = new InterfacesWalker('IQuery', allInterfaces, handler);
      walker.run();
   }
   {
      const walker = new InterfacesWalker('IMutation', allInterfaces, handler);
      walker.run();
   }
   {
      const walker = new InterfacesWalker('ISubscription', allInterfaces, handler);
      walker.run();
   }

   fs.writeFile(requestFilePath, output, (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
