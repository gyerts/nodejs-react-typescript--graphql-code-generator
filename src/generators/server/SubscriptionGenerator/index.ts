import { generateGQLSchemaFile } from './generateGQLSchemaFile';
import { generateResolversFile } from './generateResolversFile';
import { generateDummyFiles } from './generateDummyFiles';

export namespace server_subscription {
   export const genGQLSchemaFile = generateGQLSchemaFile;
   export const genResolversFile = generateResolversFile;
   export const genDummyFiles = generateDummyFiles;
}
