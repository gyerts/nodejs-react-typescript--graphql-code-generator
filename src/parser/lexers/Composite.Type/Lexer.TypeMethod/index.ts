import {ILexer} from '../../../interfaces/ILexer';
import {IMethod} from '../../../interfaces/IMethod';
import {IInterface} from '../../../interfaces/IInterface';
import {ctrl} from '../../../../main';
import {regexPatterns} from '../../../classes/RegexPatterns';
import {CompositeTypeMethodManyReturnType} from './Composite.TypeMethodManyReturnType';
import {CompositeTypeMethodSignature} from './Composite.TypeMethodSignature';

/**
 * this lexer can read next pattern
 * ===================================================================
 * account: (token: string, name: string, age?: number) => IAccount;
 * ===================================================================
 */
export class LexerTypeMethod extends ILexer {
   method: IMethod = {
      name: '',
      params: [],
      returnValues: [],
   };

   constructor (public readonly parentInterface: IInterface) {
      super(
         LexerTypeMethod.name,
         [
            {
               validator: regexPatterns.nameConventions.anyName,
               required: true,
               action: (symbol: string) => {
                  this.method.name = symbol;
               }
            },
            {
               validator: /^:$/g,
               required: true,
               action: (symbol: string) => {
               }
            },
            {
               validator: /^\($/g,
               required: true,
               action: (symbol: string) => {
                  ctrl.addLexer(new CompositeTypeMethodSignature(this.method));
               }
            },
            {
               validator: /^\)$/g,
               required: true,
               action: (symbol: string) => {
               }
            },
            {
               validator: /^=>$/g,
               required: true,
               action: (symbol: string) => {
                  ctrl.addLexer(new CompositeTypeMethodManyReturnType(this.method));
               }
            },
            {
               validator: /^;$/g,
               required: true,
               action: (symbol: string) => {
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
      if (!this.method.name) {
         this.throwException(`invalid method body: ${JSON.stringify(this.method)}`);
      }
      this.parentInterface.methods.push(this.method);
   };
}

