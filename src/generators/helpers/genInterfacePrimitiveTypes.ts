import {getInterface} from './getInterface';
import {IInterface} from '../../parser/interfaces/IInterface';
import {primitiveTypes} from '../../helpers';
import {IMethodParam} from '../../parser/interfaces/IMethodParam';

export const getInterfacePrimitiveTypes = (interfaceName: string, allInterfaces: IInterface[]): IMethodParam[] => {
   const currentInterface = getInterface(interfaceName, allInterfaces);
   const allPrimitiveInterfaceTypes: IMethodParam[] = [];

   currentInterface.members.map(m => {
      if (primitiveTypes.includes(m.type.name)) {
         allPrimitiveInterfaceTypes.push(m);
      }
   });
   return allPrimitiveInterfaceTypes;
};
