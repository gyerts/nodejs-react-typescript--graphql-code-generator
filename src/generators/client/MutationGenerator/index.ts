import { generateInterfacesFile } from './generateInterfacesFile';
import { generateQueriesFile } from './generateQueriesFile';
import { generateRequestsFile } from './generateRequestsFile';

export namespace client_mutation {
   export const genInterfacesFile = generateInterfacesFile;
   export const genQueriesFile = generateQueriesFile;
   export const genRequestsFile = generateRequestsFile;
}
