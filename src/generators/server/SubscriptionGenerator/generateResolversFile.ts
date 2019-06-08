import {IInterface} from '../../../parser/interfaces/IInterface';
import {options} from '../../../settings';
import fs from 'fs';
import {genResolver} from '../generators/resolvers/genAllResolvers';

const _ = `\n`;
const ___ = `\n   `;
const ______ = `\n      `;

export const generateResolversFile = (
   globalInterfaceName: string,
   allInterfaces: IInterface[],
) => {
   const output = genResolver('subscription', allInterfaces, globalInterfaceName);

   fs.writeFile(`${options.serverOutDir.get()}/subscription.routes.ts`, output, (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
