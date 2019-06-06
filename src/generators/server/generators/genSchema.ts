import {IInterface} from '../../../parser/interfaces/IInterface';
import {IType} from '../../../parser/interfaces/IType';
import {IObjectPath} from '../../../classes/GQLObjectPath';
import {IMethodParam} from '../../../parser/interfaces/IMethodParam';
import {InterfacesWalker} from '../../../classes/InterfacesWalker';
import {genInterfaceForGQLSchema} from '../../helpers/genInterface';

const tab = '   ';
const _ = '\n';
const __ = '\n' + tab.repeat(1);
const ____ = '\n' + tab.repeat(2);

interface IParam {
   name: string;
   type: IType;
}
interface IObject {
   name: string;
   variants: {
      params: IParam[];
      returns_primitives: IParam[];
      returns_objects: IObject[];
   }[];
}

const addInterfaceToSchema = (
   interfaceName: string,
   allInterfaces: IInterface[],
   type: IType,
) => {
   let output = '';

   if (['IQuery', 'IMutation', 'ISubscription'].includes(interfaceName)) {
      output += `${_}type ${interfaceName.slice(1)} {`;
   } else {
      output += `${_}type ${interfaceName} {`;
   }
   output += `${genInterfaceForGQLSchema(type, allInterfaces, __)}`;
   output += `${_}}`;

   return output;
};

export const genSchema = (queryType: 'query'|'mutation'|'subscription', mainInterfaceName: string, allInterfaces: IInterface[]) => {
   let output = '';

   const handledInterfaceNames: string[] = [];

   output += addInterfaceToSchema(
      mainInterfaceName,
      allInterfaces,
      { name: mainInterfaceName, array: false, nullable: false },
   );

   const handler = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean) => {
      if (!forClientOnly) {
         const interfaceName = op.type.name === mainInterfaceName ? op.type.name.slice(1) : op.type.name;

         if (!handledInterfaceNames.includes(interfaceName)) {
            handledInterfaceNames.push(interfaceName);
            output += addInterfaceToSchema(interfaceName, allInterfaces, op.type);
         }
      }
   };
   const walker = new InterfacesWalker(mainInterfaceName, allInterfaces, handler);
   walker.run();

   return output.trim();
};
