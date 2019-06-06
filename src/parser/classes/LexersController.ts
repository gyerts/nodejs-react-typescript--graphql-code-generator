import {ILexer} from '../interfaces/ILexer';
import {IEnvironment} from '../interfaces/IEnvironment';

export class LexersController {
   private lexers: ILexer[] = [];

   env: IEnvironment = {
      interfaces: []
   };

   public addLexer = (lexer: ILexer) => {
      this.lexers.push(lexer);
      this.peekLexer().lexerDidAddedToStack();
   };

   public popLexer = (): ILexer | undefined => {
      this.peekLexer().lexerWillRemoveFromStack();
      const deletedLexer = this.lexers.pop();
      deletedLexer && deletedLexer.lexerDidRemovedFromStack();
      return deletedLexer;
   };

   public peekLexer = (): ILexer => {
      return this.lexers[this.lexers.length - 1];
   };

   public handleSymbol = (symbol: string) => {
      try {
         this.peekLexer().handle(symbol);
      } catch (e) {
         console.error(e);
         const callStack = this.lexers.map(l => `[${l.name}]\n`).reverse().reduce((str, call) => str += call);
         throw `${e.toString()}\n==== call stack ====\n${callStack}`;
      }
   };
}
