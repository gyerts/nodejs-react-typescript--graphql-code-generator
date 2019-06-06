import { generateMergeTypesFile } from './generateMergeTypesFile';
import { generateResolversIndexFile } from './generateResolversIndexFile';
import { generateInterfacesFile } from './generateInterfacesFile';

export namespace server_common {
   export const genMergeTypesFile = generateMergeTypesFile;
   export const genInterfacesFile = generateInterfacesFile;
   export const genResolversIndexFile = generateResolversIndexFile;
}
