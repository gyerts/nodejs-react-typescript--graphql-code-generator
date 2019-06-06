import {IInterface} from '../../../parser/interfaces/IInterface';
import {options} from '../../../settings';
import fs from 'fs';
import {genSchema} from '../generators/genSchema';

export const generateGQLSchemaFile = (mainInterfaceName: string, allInterfaces: IInterface[]) => {
   const output = genSchema('subscription', mainInterfaceName, allInterfaces);

   const requestFilePath = `${options.serverOutDir}/subscription.graphql`;
   fs.writeFile(requestFilePath, output, (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
