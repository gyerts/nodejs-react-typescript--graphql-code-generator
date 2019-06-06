import {options} from '../../../settings';
import fs from 'fs';

const output = `\
import { mergeTypes } from 'merge-graphql-schemas';
const fs = require('fs');
const path = require('path');

const dirname = __dirname.replace('/dist', '/src');

const querySchema = fs.readFileSync(path.join(dirname, 'query.graphql'), 'utf8');
const mutationSchema = fs.readFileSync(path.join(dirname, 'mutation.graphql'), 'utf8');
const subscriptionSchema = fs.readFileSync(path.join(dirname, 'subscription.graphql'), 'utf8');

export const typeDefs = mergeTypes([subscriptionSchema, mutationSchema, querySchema], { all: true });
`;

export const generateMergeTypesFile = () => {
   const requestFilePath = `${options.serverOutDir}/mergedGQLSchemas.ts`;
   fs.writeFile(requestFilePath, output, (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
