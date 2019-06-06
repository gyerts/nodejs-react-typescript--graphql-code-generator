import {ILexer} from '../../../interfaces/ILexer';
import {IInterface} from '../../../interfaces/IInterface';
import {regexPatterns} from '../../../classes/RegexPatterns';
import {IMember} from '../../../interfaces/IMember';

/**
 * this lexer can read next pattern
 * ===================================================================
 * account: IAccount;
 * ===================================================================
 */
export class LexerTypeMember extends ILexer {
   member: IMember = {
      name: '',
      type: {
         name: '',
         nullable: false,
         array: false,
      }
   };

   constructor (public readonly parentInterface: IInterface) {
      super(
         LexerTypeMember.name,
         [
            {
               validator: regexPatterns.nameConventions.anyName,
               required: true,
               action: (symbol: string) => {
                  this.member.name = symbol;
               }
            },
            {
               validator: /^:$/g,
               required: true,
               action: (symbol: string) => {
               }
            },
            {
               validator: regexPatterns.types.array,
               required: false,
               action: (symbol: string) => {
                  this.member.type.name = symbol.replace('[]', '');
                  this.member.type.array = true;
               }
            },
            {
               validator: regexPatterns.types.object,
               required: false,
               action: (symbol: string) => {
                  this.member.type.name = symbol;
                  this.member.type.array = false;
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
      if (!this.member.name || !this.member.type.name) {
         this.throwException(`invalid member body: ${JSON.stringify(this.member)}`);
      }
      this.parentInterface.members.push(this.member);
   };
}
