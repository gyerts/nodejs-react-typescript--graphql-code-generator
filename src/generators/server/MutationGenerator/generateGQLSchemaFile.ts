import {IInterface} from '../../../parser/interfaces/IInterface';
import {options} from '../../../settings';
import fs from 'fs';
import {genSchema} from '../generators/genSchema';

export const generateGQLSchemaFile = (mainInterfaceName: string, allInterfaces: IInterface[]) => {
   const output = genSchema('mutation', mainInterfaceName, allInterfaces);

   const requestFilePath = `${options.serverOutDir.get()}/mutation.graphql`;
   fs.writeFile(requestFilePath, output, (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
