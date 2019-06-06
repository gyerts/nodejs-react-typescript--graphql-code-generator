import {ICompositeLexer} from '../../interfaces/ILexer';
import {IInterface} from '../../interfaces/IInterface';
import {LexerTypeMethod} from './Lexer.TypeMethod';
import {LexerTypeMember} from './Lexer.TypeMember';

/**
 * this lexer contains only other lexers, this lexer delegates recognition to the other lexers
 */
export class CompositeType extends ICompositeLexer {
   constructor (parentInterface: IInterface) {
      super(
         CompositeType.name,
         [
            () => new LexerTypeMethod(parentInterface),
            () => new LexerTypeMember(parentInterface),
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
