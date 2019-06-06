import {IInterface} from '../../parser/interfaces/IInterface';
import {IMethodParam} from '../../parser/interfaces/IMethodParam';
import {primitiveTypes} from '../../helpers';
import {getInterface} from './getInterface';

export const getFullListOfParamsNoParent = (interfaceName: string, allInterfaces: IInterface[]) => {
   const recursivelyFindAllParamsInInterface = (params: IMethodParam[], interfaceName: string) => {
      const currentInterface = getInterface(interfaceName, allInterfaces);
      currentInterface.members.map(m => {
         if (!primitiveTypes.includes(m.type.name)) {
            recursivelyFindAllParamsInInterface(params, m.type.name);
         }
      });
      currentInterface.methods.map(m => {
         if (m.params.length) {
            m.params.map(param => {
               const name = `${m.name}_${param.name}`;
               if (!params.filter(p => p.name === name).length) {
                  params.push({ ...param, name: `${m.name}_${param.name}` });
               } else {
                  console.warn(`met double name: '${name}' while gen of all params for interface: '${interfaceName}'`);
               }
            });
         }
         m.returnValues.map(rv => {
            recursivelyFindAllParamsInInterface(params, rv.name);
         });
      });
   };
   const params: IMethodParam[] = [];
   recursivelyFindAllParamsInInterface(params, interfaceName);
   return params;
};
