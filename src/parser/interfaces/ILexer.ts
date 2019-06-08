import {IValidator} from './IValidator';
import {ctrl} from '../..';

export abstract class ILexer {
   currentValidatorIndex: number = 0;

   protected constructor (
      public readonly name: string,
      public readonly validators: IValidator[],
   ) {}

   /**
    * This method checks - can this lexer handle set of passed symbols in args
    * @warning Be aware that this method call resets this lexer state to initial
    * @warning Even more this method call requires initial state of lexer
    */
   canHandleSymbols = (symbols: string[]): boolean => {
      if (this.currentValidatorIndex !== 0) {
         this.throwException(`
            canHandleSymbols(...) -> this method call requires initial state, \
            \n  but ${this.currentValidatorIndex} steps passed`
         );
      }

      let retVal: boolean = true;
      if (this.validators.length < symbols.length) {
         retVal = false;
      } else {
         const handle = (symbol: string): boolean => {
            const currentValidator = this.next();
            const valid = Boolean(symbol.match(currentValidator.validator));
            if (!valid && !currentValidator.required) {
               return handle(symbol);
            } else {
               return valid;
            }
         };

         symbols.map((symbol: string) => {
            retVal = retVal && handle(symbol);
         });
      }
      this.reset();
      return retVal;
   };

   handle = (symbol: string): void => {
      const currentValidator = this.next();
      console.log(`${this.name}.validate(${JSON.stringify(symbol)}, "${currentValidator.validator}")`);
      const valid = Boolean(symbol.match(currentValidator.validator));

      if (!valid && !currentValidator.required) {
         this.handle(symbol);
      } else if (!valid) {
         this.throwException(`Unexpected symbol: ${JSON.stringify(symbol)}`);
      } else {
         currentValidator.action(symbol, this);
      }
   };

   next = (): IValidator => {
      const validator = this.validators[this.currentValidatorIndex++];

      if (!validator) {
         console.log(`[${this.name}] pass symbol to parent validator, exit`);

         ctrl.popLexer();
         return ctrl.peekLexer().next();
      }
      return validator;
   };

   reset = (): void => {
      this.currentValidatorIndex = 0;
   };

   exit = (): void => {
      ctrl.popLexer();
   };

   throwException = (msg: string) => {
      throw `[${this.name}][${this.currentValidatorIndex - 1}] ${msg}`;
   };

   /**
    * this method will be called when the lexer did added to the stack
    * */
   lexerDidAddedToStack = (): void => {};

   /**
    * this method will be called when the lexer will going to get removed from the stack
    * */
   lexerWillRemoveFromStack = (): void => {};

   /**
    * this method will be called when the lexer was removed from stack
    * */
   lexerDidRemovedFromStack = (): void => {};
}


export abstract class ICompositeLexer extends ILexer {
   symbols: string[] = [];

   protected constructor (
      public readonly name: string,
      public lexers: {(): ILexer}[]
   ) {
      super(name, []);
   }

   handle = (symbol: string): void => {
      const lexersReadyToHandleSymbol: ILexer[] = [];
      this.symbols.push(symbol);

      this.lexers.map((lexer: () => ILexer) => {
         lexer().canHandleSymbols(this.symbols) && lexersReadyToHandleSymbol.push(lexer());
      });

      if (lexersReadyToHandleSymbol.length === 1) {
         ctrl.addLexer(lexersReadyToHandleSymbol[0]);
         this.symbols.map((symbol: string) => {
            ctrl.handleSymbol(symbol);
         });
         this.symbols = [];
      }
      if (lexersReadyToHandleSymbol.length === 0) {
         this.handleNoLexerFound(symbol);
      }
   };

   removeComposedLexer = (index: number) => {
      this.lexers = this.lexers.slice(0, index).concat(this.lexers.slice(index + 1, this.lexers.length));
   };

   handleNoLexerFound = (symbol: string) => {
      ctrl.popLexer();
      ctrl.peekLexer().handle(symbol);
      // this.throwException(`
      //    Unexpected symbol: ${JSON.stringify(symbol)}, \
      //    \n  no one lexer: ${JSON.stringify(this.lexers.map(l => l().name))} \
      //    \n  cannot parse this combination: ${JSON.stringify(this.symbols)}`);
   };
}
