import fs from 'fs';
import {options} from '../../../settings';

export const copyLibraryFiles = () => {
   fs.copyFile(
      `${__dirname}/lib/requests.ts`.replace('/dist/', '/src/'),
      `${options.clientOutDir}/requests.ts`,
      (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
