import {ILexer} from '../../../../../interfaces/ILexer';
import {IMethod} from '../../../../../interfaces/IMethod';
import {ctrl} from '../../../../../..';
import {regexPatterns} from '../../../../../classes/RegexPatterns';
import {IType} from '../../../../../interfaces/IType';

/**
 * this lexer can read next pattern
 * ===================================================================
 * |IType3;
 * ===================================================================
 */
export class TypeMethodReturnTypeLexer extends ILexer {
   constructor (public readonly parentMethod: IMethod) {
      super(
         TypeMethodReturnTypeLexer.name,
         [
            {
               validator: /^\|$/g,
               required: false,
               action: (symbol: string) => {
               }
            },
            {
               validator: regexPatterns.types.array,
               required: false,
               action: (symbol: string) => {
                  parentMethod.returnValues.push({
                     name: symbol.replace('[]', ''),
                     array: true,
                     nullable: false,
                  });
                  this.exit();
               }
            },
            {
               validator: regexPatterns.types.object,
               required: true,
               action: (symbol: string) => {
                  parentMethod.returnValues.push({
                     name: symbol,
                     array: false,
                     nullable: false,
                  });
                  this.exit();
               }
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
