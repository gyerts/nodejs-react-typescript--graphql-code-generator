import {ICompositeLexer} from '../../interfaces/ILexer';
import {LexerInterface} from './Lexer.Interface';
import {LexerImport} from './Lexer.Import';

/**
 * this lexer contains only other lexers, this lexer delegates recognition to the other lexers
 */
export class CompositeRoot extends ICompositeLexer {
   constructor () {
      super(
         CompositeRoot.name,
         [
            () => new LexerInterface(),
            () => new LexerImport(),
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
