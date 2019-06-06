import { generateGQLSchemaFile } from './generateGQLSchemaFile';
import { generateResolversFile } from './generateResolversFile';
import { generateDummyFiles } from './generateDummyFiles';

export namespace server_mutation {
   export const genGQLSchemaFile = generateGQLSchemaFile;
   export const genResolversFile = generateResolversFile;
   export const genDummyFiles = generateDummyFiles;
}
