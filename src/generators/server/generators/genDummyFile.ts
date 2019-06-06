import {IObjectPath} from '../../../classes/GQLObjectPath';
import {IInterface} from '../../../parser/interfaces/IInterface';
import {breadcrumbsToCapitalName} from '../../helpers/breadcrumbsToCapitalName';
import {getInterfacePrimitiveTypes} from '../../helpers/genInterfacePrimitiveTypes';

export const genDummyFile = (queryType: 'query'|'mutation'|'subscription', op: IObjectPath, allInterfaces: IInterface[]) => {
   const __ = `\n   `;
   const ____ = `\n      `;
   let output = ``;

   const bName = op.breadcrumbs.map(b => b.name).join('_') + '_delegate';
   const bPath = op.breadcrumbs.map(b => b.name);
   const lastB = op.breadcrumbs[op.breadcrumbs.length - 1];
   const isArray = lastB.type.array;
   const interfaceType = lastB.type.name;
   const returnType = `Promise< external.${interfaceType}Primitives${isArray ? '[]' : ''} >`;
   const requestType = `I${breadcrumbsToCapitalName(op.breadcrumbs)}RequestType`;

   output += `import {external, internal} from '../interfaces';`;
   output += `\nimport { ${requestType} } from '../${queryType}.routes';`;

   output += `\n\n/**\n`;
   output += ` * this is dummy implementation of node, you need to place this file\n`;
   output += ` * to the dir with all file-impls, and add your own implementation\n`;
   output += ` * */\n`;

   output += `\nexport const ${lastB.name}Impl = async (req: ${requestType}, overrides: internal.${interfaceType}): ${returnType} => {`;
   // output += `${__}console.warn('dummy impl of "${lastB.name}Impl" resolver');`;
   output += `${__}console.log('${lastB.name}Impl =====================================');`;
   output += `${__}console.log(JSON.stringify(req, null, 3));`;
   output += `${__}console.log(overrides);`;
   output += `${__}return Promise.resolve(${isArray ? '[{' : '{'}`;

   getInterfacePrimitiveTypes(interfaceType, allInterfaces).map(p => {
      output += `${____}${p.name}: `;
      if (p.type.array) {
         switch (p.type.name) {
            case 'string': {
               output += '[\'some string 1\', \'some string 2\'],';
               break;
            }
            case 'number': {
               output += '[0, 1, 2, 3, 4],';
               break;
            }
            case 'boolean': {
               output += '[true, false, true, false, true],';
               break;
            }
            default: {
               output += p.type.name;
            }
         }
      } else {
         switch (p.type.name) {
            case 'string': {
               output += '\'some string 1\',';
               break;
            }
            case 'number': {
               output += '0,';
               break;
            }
            case 'boolean': {
               output += 'true,';
               break;
            }
            default: {
               output += p.type.name;
            }
         }
      }
   });

   isArray ? (output += `${__}}]);`) : (output += `${__}});`);
   output += `\n};\n`;

   return output;
};
