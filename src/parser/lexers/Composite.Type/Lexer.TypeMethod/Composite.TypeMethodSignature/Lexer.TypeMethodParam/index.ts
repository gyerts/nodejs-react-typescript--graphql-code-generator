import {ILexer} from '../../../../../interfaces/ILexer';
import {IMethod} from '../../../../../interfaces/IMethod';
import {IMethodParam} from '../../../../../interfaces/IMethodParam';
import {ctrl} from '../../../../../../main';
import {regexPatterns} from '../../../../../classes/RegexPatterns';

/**
 * this lexer can read next pattern
 * ===================================================================
 * account: (token: string, name: string, age: number) => IAccount;
 * ===================================================================
 */
export class LexerTypeMethodParam extends ILexer {
   param: IMethodParam = {
      name: '',
      type: {
         name: '',
         array: false,
         nullable: false,
      }
   };

   constructor (public readonly parentMethod: IMethod) {
      super(
         LexerTypeMethodParam.name,
         [
            {
               validator: /^,$/g,
               required: false,
               action: (symbol: string) => {
               }
            },
            {
               validator: regexPatterns.nameConventions.anyName,
               required: true,
               action: (symbol: string) => {
                  this.param.name = symbol;
               }
            },
            {
               validator: /^\?$/g,
               required: false,
               action: (symbol: string) => {
                  this.param.type.nullable = true;
               }
            },
            {
               validator: /^:$/g,
               required: true,
               action: (symbol: string) => {
               }
            },
            {
               validator: regexPatterns.types.object,
               required: false,
               action: (symbol: string) => {
                  this.param.type = {
                     name: symbol,
                     array: false,
                     nullable: false,
                  };
                  this.exit();
               }
            },
            {
               validator: regexPatterns.types.array,
               required: false,
               action: (symbol: string) => {
                  this.param.type = {
                     name: symbol.replace('[]', ''),
                     array: true,
                     nullable: false,
                  };
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
      if (this.param.name && this.param.type.name) {
         this.parentMethod.params.push(this.param);
      } else {
         this.throwException(`invalid param body: ${JSON.stringify(this.param)}`);
      }
   };
}
