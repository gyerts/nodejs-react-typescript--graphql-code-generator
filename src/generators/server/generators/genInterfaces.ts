import {IInterface} from '../../../parser/interfaces/IInterface';
import {InterfacesWalker} from '../../../classes/InterfacesWalker';
import {IObjectPath} from '../../../classes/GQLObjectPath';
import {genInterface} from '../../helpers/genInterface';
import {IMethodParam} from '../../../parser/interfaces/IMethodParam';

const renderInterface = (op: IObjectPath, allInterfaces: IInterface[]) => `
export interface ${op.type.name} {
   ${genInterface(op.type, allInterfaces, '   ')}\
}
`;

const tab_space = '   ';

export const genInterfaces = (allInterfaces: IInterface[], globalInterfaceName: string) => {
   let output = '';

   const handledInterfaceNames: string[] = [];

   const handler = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath) => {
      const __ = '\n' + tab_space.repeat(op.breadcrumbs.length);
      const ____ = '\n' + tab_space.repeat(op.breadcrumbs.length + 1);

      if (!handledInterfaceNames.includes(op.type.name)) {
         handledInterfaceNames.push(op.type.name);
         output += renderInterface(op, allInterfaces);
      }
   };

   const walker = new InterfacesWalker(globalInterfaceName, allInterfaces, handler);
   walker.run();

   return output;
};
