import {IInterface} from '../../../parser/interfaces/IInterface';
import {options} from '../../../settings';
import fs from 'fs';
import {genSchema} from '../generators/genSchema';

export const generateGQLSchemaFile = (mainInterfaceName: string, allInterfaces: IInterface[]) => {
   const output = genSchema('query', mainInterfaceName, allInterfaces);

   const requestFilePath = `${options.serverOutDir}/query.graphql`;
   fs.writeFile(requestFilePath, output, (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
