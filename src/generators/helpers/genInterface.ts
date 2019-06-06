import {getInterface} from './getInterface';
import {IInterface} from '../../parser/interfaces/IInterface';
import {IType} from '../../parser/interfaces/IType';
import {typeToGQLString} from '../../helpers';
import {ITypeToTypescriptString} from './ITypeToTypescriptString';

export const genInterface = (type: IType, allInterfaces: IInterface[], tab: string) => {
   let output = '';
   const currentInterface = getInterface(type.name, allInterfaces);

   currentInterface.members.map(m => {
      output += `${tab}${ITypeToTypescriptString(m.name, m.type)}`;
      output += '\n';
   });
   currentInterface.methods.map(m => {
      output += `${tab}${ITypeToTypescriptString(m.name, m.returnValues[0])}`;
      output += '\n';
   });
   return output;
};

export const genInterfaceForGQLSchema = (type: IType, allInterfaces: IInterface[], ___: string) => {
   let output = '';
   const currentInterface = getInterface(type.name, allInterfaces);

   currentInterface.members.map(m => {
      output += `${___}${m.name}: ${typeToGQLString(m.type)}`;
   });
   currentInterface.methods.map(m => {
      output += `${___}${m.name}`;
      if (m.params.length) {
         output += '(';
         output += m.params.map(p => `${p.name}: ${typeToGQLString(p.type)}`).join(', ');
         output += ')';
      } else {
      }
      output += `: ${typeToGQLString(m.returnValues[0])}`;
   });
   return output;
};
