import {IBreadcrumb, IObjectPath} from '../../classes/GQLObjectPath';

/**
 * @return export interface <name>Response { a: { b: c: { d: e } } }
 */
export const genResponseInterface = (objectPath: IObjectPath) => {
   const genNext = (bcs: IBreadcrumb[], i: number): string => {
      let output = '';
      output += `${bcs[i].name}: `;
      if (bcs[i + 1]) {
         if (!bcs[i].type.array) {
            output += `{ `;
            output += genNext(bcs, i + 1);
            output += ` }`;
         } else {
            output += `${bcs[i].type.name}${bcs[i].type.array ? '[]' : ''}`;
         }
      } else {
         output += `${objectPath.type.name}${objectPath.type.array ? '[]' : ''}`;
      }
      return output;
   };

   let output = '';
   output += genNext(objectPath.breadcrumbs, 0);
   output += ';';
   return output.trim();
};
