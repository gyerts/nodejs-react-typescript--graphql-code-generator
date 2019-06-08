import {generateClient, generateServer} from './index';

function getArgs () {
   const args: any = {};
   process.argv
      .slice(2, process.argv.length)
      .forEach( arg => {
         // long arg
         if (arg.slice(0, 2) === '--') {
            const longArg = arg.split('=');
            const longArgFlag = longArg[0].slice(2, longArg[0].length);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
         }
         // flags
         else if (arg[0] === '-') {
            const flags = arg.slice(1, arg.length).split('');
            flags.forEach(flag => {
               args[flag] = true;
            });
         }
      });
   return args;
}

export const readScriptParams = () => {
   const args = getArgs();
   console.log(args);

   if (args.client) {
      generateClient(args.dist, args.if);
   } else if (args.server) {
      generateServer(args.dist, args.if);
   } else {
      throw 'You need to specify --client or --server ' +
      '\n        with --dist param where all files will be generated' +
      '\n        with --if param which means path to the interfaces IQuery.ts & IMutation.ts & ISubscription.ts';
   }
};
