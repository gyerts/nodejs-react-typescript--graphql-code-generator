/**
 * this lexer contains only other lexers, this lexer delegates recognition to the other lexers
 */
import {ICompositeLexer} from '../../../../../../interfaces/ILexer';
import {LexerListedName} from './Lexer.ListedName';

export class CompositeListedNames extends ICompositeLexer {
   constructor () {
      super(
         CompositeListedNames.name,
         [
            () => new LexerListedName()
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
