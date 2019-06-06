import {ICompositeLexer, ILexer} from '../../../../interfaces/ILexer';
import {IMethod} from '../../../../interfaces/IMethod';
import {LexerTypeMethodParam} from './Lexer.TypeMethodParam';

/**
 * this lexer contains only other lexers, this lexer delegates recognition to the other lexers
 */
export class CompositeTypeMethodSignature extends ICompositeLexer {
   constructor (public readonly parentMethod: IMethod) {
      super(
         CompositeTypeMethodSignature.name,
         [
            () => new LexerTypeMethodParam(parentMethod)
         ]
      );
   }
   lexerDidAddedToStack = () => {
      console.log(`[${this.name}][lexerDidAddedToStack] lifecycle method call`);
   };
   lexerWillRemoveFromStack = () => {
      console.log(`[${this.name}][lexerWillRemoveFromStack] lifecycle method call`);
   };
}
