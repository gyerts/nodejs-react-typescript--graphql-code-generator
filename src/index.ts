import {announceNextSymbol} from './helpers';
import {LexersController} from './parser/classes/LexersController';
import {regexPatterns} from './parser/classes/RegexPatterns';
import {CompositeRoot} from './parser/lexers/Composite.Root';
import recursive from 'recursive-readdir';
import fs from 'fs';
import {IInterface} from './parser/interfaces/IInterface';
import {client_query} from './generators/client/QueryGenerator';
import {client_mutation} from './generators/client/MutationGenerator';
import {client_common} from './generators/client/CommonGenerator';
import {server_query} from './generators/server/QueryGenerator';
import {server_mutation} from './generators/server/MutationGenerator';
import {server_subscription} from './generators/server/SubscriptionGenerator';
import {server_common} from './generators/server/Common';
import {readScriptParams} from './readScriptParams';
import {options} from './settings';

/***********************************************************************
 * INIT LEXER CONTROLLER
 ***********************************************************************/
export const ctrl = new LexersController();
ctrl.addLexer(new CompositeRoot());

/***********************************************************************
 * READ SYMBOLS
 ***********************************************************************/
const readSymbols = (text: string, ctrl: LexersController) => {
   const replacements = [
      [/\n/g, ' \n '],
      [/,/g, ' , '],
      [/;/g, ' ; '],
      [/:/g, ' : '],
      [/{/g, ' { '],
      [/}/g, ' } '],
      [/\(/g, ' ( '],
      [/\)/g, ' ) '],
      [/=>/g, ' => '],
      [/\|/g, ' | '],
      [/\?/g, ' ? '],
   ];

   replacements.map(replacement => {
      const [regex, symbol] = replacement;
      text = text.replace(regex, ` ${symbol} `);
   });

   let symbols = text.split(' ');
   symbols = symbols.filter(symbol => Boolean(symbol));

   // Анулируем все символы '\n' если они стоят не перед словом, а перед спец символом к примеру
   symbols.map((w, i) => {
      if (w === '\n') {
         if (symbols[i - 1] && symbols[i - 1].match(regexPatterns.nameConventions.anyName)) {
            symbols[i] = ';';
         } else if (symbols[i - 1] && symbols[i - 1].match(regexPatterns.import.path)) {
            symbols[i] = ';';
         } else {
            symbols[i] = '';
         }
      }
   });
   symbols = symbols.filter(symbol => Boolean(symbol));

   console.log(symbols);

   symbols.map(symbol => {
      announceNextSymbol(symbol);
      ctrl.handleSymbol(symbol);
   });
};

export function generateClient (dest: string, interfacesPath: string) {
   options.clientOutDir.set(dest);
   options.interfacesPath.set(interfacesPath);

   recursive(options.interfacesPath.get(), (err, files) => {
      files.map((filePath) => {
         const text = fs.readFileSync(filePath, 'utf8');
         readSymbols(text, ctrl);
      });

      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

      const allInterfaces: IInterface[] = ctrl.env.interfaces;

      client_common.cpyLibraryFiles();

      client_query.genInterfacesFile(allInterfaces, 'IQuery');
      client_query.genRequestsFile('IQuery', allInterfaces);
      client_query.genQueriesFile('IQuery', allInterfaces);

      client_mutation.genInterfacesFile(allInterfaces, 'IMutation');
      client_mutation.genRequestsFile('IMutation', allInterfaces);
      client_mutation.genQueriesFile('IMutation', allInterfaces);
   });
}

export function generateServer (dest: string, interfacesPath: string) {
   options.serverOutDir.set(dest);
   options.interfacesPath.set(interfacesPath);

   recursive(options.interfacesPath.get(), (err, files) => {
      files.map((filePath) => {
         const text = fs.readFileSync(filePath, 'utf8');
         readSymbols(text, ctrl);
      });

      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

      const allInterfaces: IInterface[] = ctrl.env.interfaces;

      server_query.genGQLSchemaFile('IQuery', allInterfaces);
      server_query.genResolversFile('IQuery', allInterfaces);
      server_query.genDummyFiles('IQuery', allInterfaces);

      server_mutation.genGQLSchemaFile('IMutation', allInterfaces);
      server_mutation.genResolversFile('IMutation', allInterfaces);
      server_mutation.genDummyFiles('IMutation', allInterfaces);

      server_subscription.genGQLSchemaFile('ISubscription', allInterfaces);
      server_subscription.genResolversFile('ISubscription', allInterfaces);
      server_subscription.genDummyFiles('ISubscription', allInterfaces);

      server_common.genMergeTypesFile();
      server_common.genResolversIndexFile(allInterfaces);
      server_common.genInterfacesFile(allInterfaces);
   });
}

readScriptParams();
