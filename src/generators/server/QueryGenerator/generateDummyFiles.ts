import {IInterface} from '../../../parser/interfaces/IInterface';
import {options} from '../../../settings';
import fs from 'fs';
import {IMethodParam} from '../../../parser/interfaces/IMethodParam';
import {IObjectPath} from '../../../classes/GQLObjectPath';
import {InterfacesWalker} from '../../../classes/InterfacesWalker';
import {ArrayContainer} from '../../helpers/ArrayContainer';
import {genDummyFile} from '../generators/genDummyFile';
const outputDir = `${options.serverOutDir}/dummy`;

export const generateDummyFiles = (
   mainInterfaceName: string,
   allInterfaces: IInterface[],
) => {
   if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
   }

   const handler = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean) => {
      let output = '';
      const arrayContainer = new ArrayContainer();

      if (!forClientOnly && arrayContainer.allowed(op)) {
         output += genDummyFile('query', op, allInterfaces);

         const bPath = op.breadcrumbs.map(b => b.name);
         fs.writeFile(`${outputDir}/query.${bPath.join('.')}.ts`, output, (err) => {
            if (err) {
               return console.error(err);
            }
         });
      }
   };

   const walker = new InterfacesWalker(mainInterfaceName, allInterfaces, handler);
   walker.run();
};
