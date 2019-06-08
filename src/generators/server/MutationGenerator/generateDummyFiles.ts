import {IInterface} from '../../../parser/interfaces/IInterface';
import {options} from '../../../settings';
import fs from 'fs';
import {IMethodParam} from '../../../parser/interfaces/IMethodParam';
import {IObjectPath} from '../../../classes/GQLObjectPath';
import {InterfacesWalker} from '../../../classes/InterfacesWalker';
import {ArrayContainer} from '../../helpers/ArrayContainer';
import {getInterface} from '../../helpers/getInterface';
import {genDummyFile} from '../generators/genDummyFile';

export const generateDummyFiles = (
   mainInterfaceName: string,
   allInterfaces: IInterface[],
) => {
   const outputDir = `${options.serverOutDir.get()}/dummy`;

   if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
   }

   const handler = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean) => {
      let output = '';
      const arrayContainer = new ArrayContainer();

      if (!forClientOnly && arrayContainer.allowed(op)) {
         output += genDummyFile('mutation', op, allInterfaces);

         const bPath = op.breadcrumbs.map(b => b.name);
         const lastB = op.breadcrumbs[op.breadcrumbs.length - 1];

         const i = getInterface(lastB.type.name, allInterfaces);

         if (!i.methods.length || i.members.length) {
            fs.writeFile(`${outputDir}/mutation.${bPath.join('.')}.ts`, output, (err) => {
               if (err) {
                  return console.error(err);
               }
            });
         }
      }
   };

   const walker = new InterfacesWalker(mainInterfaceName, allInterfaces, handler);
   walker.run();
};
