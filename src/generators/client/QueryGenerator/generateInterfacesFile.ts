import {IInterface} from '../../../parser/interfaces/IInterface';
import fs from 'fs';
import {options} from '../../../settings';
import {InterfacesWalker} from '../../../classes/InterfacesWalker';
import {IObjectPath} from '../../../classes/GQLObjectPath';
import {genResponseInterface} from '../../helpers/genResponseInterface';
import {genInterface} from '../../helpers/genInterface';
import {IMethodParam} from '../../../parser/interfaces/IMethodParam';
import {getNamespaceName} from '../../server/generators/genNames';

const renderInterface = (op: IObjectPath, allInterfaces: IInterface[]) => `
export interface ${op.type.name} {
   ${genInterface(op.type, allInterfaces, '   ')}\
}
`;
const renderResponseInterface = (op: IObjectPath, allInterfaces: IInterface[]) => `
export namespace ${getNamespaceName(op)} {
   export interface ${op.type.name}Response {
      ${genResponseInterface(op)}
   }
}
`;

export const generateInterfacesFile = (allInterfaces: IInterface[], globalInterfaceName: string) => {
   let output = '';

   const handledInterfaceNames: string[] = [];

   const handler = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath) => {
      if (!handledInterfaceNames.includes(op.type.name)) {
         handledInterfaceNames.push(op.type.name);
         output += renderInterface(op, allInterfaces);
      }
      output += renderResponseInterface(op, allInterfaces);
   };

   const walker = new InterfacesWalker(globalInterfaceName, allInterfaces, handler);
   walker.run();

   fs.writeFile(options.clientOutDir + '/' + `query.interfaces.ts`, output, (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
