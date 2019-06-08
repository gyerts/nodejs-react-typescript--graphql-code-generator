import {IInterface} from '../../../parser/interfaces/IInterface';
import {options} from '../../../settings';
import fs from 'fs';
import {genResolver} from '../generators/resolvers/genAllResolvers';

export const generateResolversFile = (
   globalInterfaceName: string,
   allInterfaces: IInterface[],
) => {
   const output = genResolver('query', allInterfaces, globalInterfaceName);

   fs.writeFile(`${options.serverOutDir.get()}/query.routes.ts`, output, (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
