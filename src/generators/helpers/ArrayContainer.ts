import {IObjectPath} from '../../classes/GQLObjectPath';

export class ArrayContainer {
   prohibitedPaths: string[] = [];

   allowed = (op: IObjectPath) => {
      let allowed = true;
      const path = op.breadcrumbs.map(b => b.name).join('.');
      const prohibited = this.prohibitedPaths.find(p => path.indexOf(p) !== -1);

      if (prohibited && prohibited.length !== path.length) {
         allowed = false;
      }
      if (op.type.array) {
         this.prohibitedPaths.push(path);
      }
      return allowed;
   };
}
