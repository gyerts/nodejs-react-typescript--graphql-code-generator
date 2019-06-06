import {ILexer} from '../../../../../../../interfaces/ILexer';
import {IInterface} from '../../../../../../../interfaces/IInterface';
import {regexPatterns} from '../../../../../../../classes/RegexPatterns';

/**
 * this lexer can read next pattern
 * ===================================================================
 * export interface Foo { <Composite.Type> }
 * ===================================================================
 */
export class LexerListedName extends ILexer {
   interface: IInterface = {
      name: '',
      members: [],
      methods: [],
   };

   constructor () {
      super(
         LexerListedName.name,
         [
            {
               validator: /,/g,
               required: false,
               action: (symbol: string, lexer: ILexer) => {
               }
            },
            {
               validator: regexPatterns.nameConventions.anyName,
               required: true,
               action: (symbol: string, lexer: ILexer) => {
                  this.exit();
               }
            }
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
