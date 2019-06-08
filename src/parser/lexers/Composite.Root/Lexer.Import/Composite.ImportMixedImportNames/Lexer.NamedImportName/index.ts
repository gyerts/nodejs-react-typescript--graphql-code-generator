/**
 * this lexer can read next pattern
 * ===================================================================
 * DefaultModule, { Module1, Module2 }
 * ===================================================================
 */
import {ILexer} from '../../../../../interfaces/ILexer';
import {ctrl} from '../../../../../..';
import {CompositeListedNames} from './Composite.ListedNames';

export class LexerNamedImportName extends ILexer {
   constructor () {
      super(
         LexerNamedImportName.name,
         [
            {
               validator: /,/g,
               required: false,
               action: (symbol: string, lexer: ILexer) => {
               }
            },
            {
               validator: /{/g,
               required: true,
               action: (symbol: string, lexer: ILexer) => {
                  ctrl.addLexer(new CompositeListedNames());
               }
            },
            {
               validator: /}/g,
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
