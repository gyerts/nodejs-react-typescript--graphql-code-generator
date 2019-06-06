import {IInterface} from '../../parser/interfaces/IInterface';

export const getInterface = (interfaceName: string, allInterfaces: IInterface[]): IInterface => {
   const foundInterface = allInterfaces.find(i => i.name === interfaceName);
   if (!foundInterface) {
      console.trace();
      throw `'${interfaceName}' not found in list of interfaces: [${allInterfaces.map(i => i.name)}]`;
   }
   return foundInterface;
};
