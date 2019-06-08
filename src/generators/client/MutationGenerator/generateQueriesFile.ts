import {IInterface} from '../../../parser/interfaces/IInterface';
import {IType} from '../../../parser/interfaces/IType';
import {options} from '../../../settings';
import fs from 'fs';
import {primitiveTypes} from '../../../helpers';
import {GQLObjectPath, IBreadcrumb, IObjectPath} from '../../../classes/GQLObjectPath';
import {genMethodParams} from '../../helpers/genMethodParams';
import {getInterface} from '../../helpers/getInterface';

const tab = '   ';

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

const getFileContent = (objectPath: IObjectPath, allInterfaces: IInterface[]) => {
   const full_breadcrumb_name = objectPath.breadcrumbs.map(b => b.name).join('_');

   const genGQLMethodParams = (breadcrumb: IBreadcrumb, objectPath: IObjectPath) => {
      let output = '';
      if (breadcrumb.params.length) {
         output += '(';
         breadcrumb.params.map(p => {
            const foundParam = objectPath.signatureParams.find(sp => sp.name === p.name);
            output += `${p.name.replace(`${breadcrumb.name}_`, '')}: `;
            if (foundParam && foundParam.type.array) {
               output += `\${JSON.stringify(${p.name})}, `;
            } else if (foundParam && foundParam.type.name === 'string') {
               output += `"\${${p.name}}", `;
            } else {
               output += `\${${p.name}}, `;
            }
         });
         output = output.slice(0, output.length - 2) + ')';
      }
      return output;
   };

   const genGQLRequestString = (objectPath: IObjectPath, shift: number = 0) => {

      const genBreadcrumbs = (bcs: IBreadcrumb[], i: number, shift: number): string => {
         let output = '';
         const space = tab.repeat(shift);

         output += `${space}${bcs[i].name} ${genGQLMethodParams(bcs[i], objectPath)} {\n`;
         if (bcs[i + 1]) {
            output += genBreadcrumbs(bcs, i + 1, shift + 1);
         } else {
            const genInterface = (interfaceName: string, shift: number) => {
               const space = tab.repeat(shift);
               const currentInterface = getInterface(interfaceName, allInterfaces);
               currentInterface.members.map(m => {
                  if (!primitiveTypes.includes(m.type.name)) {
                     output += `\n${space}${m.name} {`;
                     genInterface(m.type.name, shift + 1);
                     output += `\n${space}}`;
                  } else {
                     output += `\n${space}${m.name}`;
                  }
               });
               currentInterface.methods.map(m => {
                  output += `\n${space}${m.name}`;
                  output += genGQLMethodParams(
                     {
                        name: m.name,
                        params: m.params.map(p => ({ name: `${m.name}_${p.name}`, param: p })),
                        interfaceName: '',
                        type: m.returnValues[0]
                     },
                     {
                        type: m.returnValues[0],
                        breadcrumbs: [],
                        signatureParams: m.params.map(p => ({name: `${m.name}_${p.name}`, type: p.type}))
                     }
                  );
                  output += ` {`;
                  genInterface(m.returnValues[0].name, shift + 1);
                  output += `\n${space}}`;
               });
            };
            genInterface(objectPath.type.name, shift + 1);
         }
         output += `\n${space}}`;
         return output;
      };

      let output = '';
      output += genBreadcrumbs(objectPath.breadcrumbs, 0, shift + 1);
      return output.trim();
   };

   return `
export const ${full_breadcrumb_name}_${objectPath.type.name}_fields = (${genMethodParams(objectPath.signatureParams)}) => \`
   ${genGQLRequestString(objectPath)}
\`;
`.replace(/(^[ \t]*\n)/gm, '');
};

export const generateQueriesFile = (mainInterfaceName: string, allInterfaces: IInterface[]) => {
   let output = '';
   new GQLObjectPath(mainInterfaceName, allInterfaces).objectPaths.map(objectPath => {
      const query = getFileContent(objectPath, allInterfaces);
      if (!output.includes(query)) {
         output += query;
      }
   });

   const requestFilePath = `${options.clientOutDir.get()}/mutation.queries.ts`;
   fs.writeFile(requestFilePath, output, (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
