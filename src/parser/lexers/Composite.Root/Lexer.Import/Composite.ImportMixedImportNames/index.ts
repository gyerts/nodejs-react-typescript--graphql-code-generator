import {ICompositeLexer} from '../../../../interfaces/ILexer';
import {LexerNamedImportName} from './Lexer.NamedImportName';
import {LexerDefailtImportName} from './Lexer.DefailtImportName';

/**
 * this lexer can read next pattern
 * ===================================================================
 * DefaultModule, { Module1, Module2 }
 * ===================================================================
 */
export class CompositeImportMixedImportNames extends ICompositeLexer {
   constructor () {
      super(
         CompositeImportMixedImportNames.name,
         [
            () => {
               const lexer = new LexerDefailtImportName();
               lexer.lexerDidRemovedFromStack = () => {
                  // only one default import allowed
                  this.removeComposedLexer(0);
               };
               return lexer;
            },
            () => {
               const lexer = new LexerNamedImportName();
               // no default imports allowed after named imports
               lexer.lexerDidRemovedFromStack = () => {
                  this.exit();
               };
               return lexer;
            },
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
