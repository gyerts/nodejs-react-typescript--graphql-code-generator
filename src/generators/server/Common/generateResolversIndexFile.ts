import {options} from '../../../settings';
import fs from 'fs';
import {IInterface} from '../../../parser/interfaces/IInterface';
import {getInterface} from '../../helpers/getInterface';
import {genMethodParams} from '../../helpers/genMethodParams';

const _ = `\n`;
const ___ = `\n   `;
const ______ = `\n      `;

const output = (allInterfaces: IInterface[]) => {
   const query = getInterface('IQuery', allInterfaces);
   const mutation = getInterface('IMutation', allInterfaces);
   const subscription = getInterface('ISubscription', allInterfaces);

   let output = '';

   const addImport = (type: string, name: string) => {
      output = `import {${type}_${name}_route} from './${type}.routes';\n` + output;
   };

   output += `${_}export const resolvers = {`;

   output += `${___}Query: {`;
   if (query) {
      query.members.map(m => {
         addImport('query', m.name);
         output += `${______}${m.name}: () => query_${m.name}_route(),`;
      });
      query.methods.map(m => {
         addImport('query', m.name);
         output += `${______}${m.name}: (root: any, ${genMethodParams(m.params)}) => query_${m.name}_route(${m.params.map(p => p.name).join(', ')}),`;
      });
   }
   output += `${___}},`;

   output += `${___}Mutation: {`;
   if (mutation) {
      mutation.members.map(m => {
         addImport('mutation', m.name);
         output += `${______}${m.name}: () => mutation_${m.name}_route(),`;
      });
      mutation.methods.map(m => {
         addImport('mutation', m.name);
         output += `${______}${m.name}: (root: any, ${genMethodParams(m.params)}) => mutation_${m.name}_route(${m.params.map(p => p.name).join(', ')}),`;
      });
   }
   output += `${___}},`;

   output += `${___}Subscription: {`;
   if (subscription) {
      subscription.members.map(m => {
         addImport('subscription', m.name);
         output += `${______}${m.name}: () => subscription_${m.name}_route(),`;
      });
      subscription.methods.map(m => {
         addImport('subscription', m.name);
         output += `${______}${m.name}: (root: any, ${genMethodParams(m.params)}) => subscription_${m.name}_route(${m.params.map(p => p.name).join(', ')}),`;
      });
   }
   output += `${___}},`;

   output += `${_}};`;

   return output;
};

export const generateResolversIndexFile = (allInterfaces: IInterface[]) => {
   const requestFilePath = `${options.serverOutDir}/resolvers.ts`;

   fs.writeFile(requestFilePath, output(allInterfaces), (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
