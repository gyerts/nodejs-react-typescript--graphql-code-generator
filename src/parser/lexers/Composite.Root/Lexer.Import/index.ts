import {ILexer} from '../../../interfaces/ILexer';
import {ctrl} from '../../../../main';
import {regexPatterns} from '../../../classes/RegexPatterns';
import {CompositeImportMixedImportNames} from './Composite.ImportMixedImportNames';

/**
 * this lexer can read next pattern
 * ===================================================================
 * import DefaultModule, { Module1, Module2 } from '../path';
 * ===================================================================
 */
export class LexerImport extends ILexer {
   constructor () {
      super(
         LexerImport.name,
         [
            {
               validator: /^import$/g,
               required: true,
               action: (symbol: string, lexer: ILexer) => {
                  ctrl.addLexer(new CompositeImportMixedImportNames());
               }
            },
            {
               validator: /^from$/g,
               required: true,
               action: (symbol: string, lexer: ILexer) => {
               }
            },
            {
               validator: regexPatterns.import.path,
               required: true,
               action: (symbol: string, lexer: ILexer) => {
               }
            },
            {
               validator: /^;$/g,
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
