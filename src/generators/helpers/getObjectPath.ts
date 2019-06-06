import {IObjectPath} from '../../classes/GQLObjectPath';

export const getObjectPath = (entriesPath: string[], allObjectPaths: IObjectPath[]): IObjectPath => {
   let foundObjectPath: IObjectPath|undefined = undefined;
   allObjectPaths.map(op => {
      if (op.breadcrumbs.length === entriesPath.length) {
         let equal = true;
         op.breadcrumbs.map((bc, index) => {
            equal = equal && bc.name === entriesPath[index];
         });
         if (equal) {
            foundObjectPath = op;
         }
      }
   });

   if (!foundObjectPath) {
      console.trace();
      throw `'${entriesPath}' not found in list of object paths`;
   }
   return foundObjectPath;
};
