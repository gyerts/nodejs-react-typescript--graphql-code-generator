import {ICompositeLexer} from '../../../../interfaces/ILexer';
import {IMethod} from '../../../../interfaces/IMethod';
import {TypeMethodReturnTypeLexer} from './TypeMethodReturnTypeLexer';

/**
 * this lexer contains only other lexers, this lexer delegates recognition to the other lexers
 */
export class CompositeTypeMethodManyReturnType extends ICompositeLexer {
   constructor (public readonly parentMethod: IMethod) {
      super(
         CompositeTypeMethodManyReturnType.name,
         [
            () => new TypeMethodReturnTypeLexer(parentMethod)
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
