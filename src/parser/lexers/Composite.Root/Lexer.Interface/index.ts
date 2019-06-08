import {ILexer} from '../../../interfaces/ILexer';
import {ctrl} from '../../../..';
import {IInterface} from '../../../interfaces/IInterface';
import {regexPatterns} from '../../../classes/RegexPatterns';
import {CompositeType} from '../../Composite.Type';

/**
 * this lexer can read next pattern
 * ===================================================================
 * export interface Foo { <Composite.Type> }
 * ===================================================================
 */
export class LexerInterface extends ILexer {
   interface: IInterface = {
      name: '',
      members: [],
      methods: [],
   };

   constructor () {
      super(
         LexerInterface.name,
         [
            {
               validator: /^export$/g,
               required: false,
               action: (symbol: string, lexer: ILexer) => {
               }
            },
            {
               validator: /^interface$/g,
               required: true,
               action: (symbol: string, lexer: ILexer) => {
               }
            },
            {
               validator: regexPatterns.nameConventions.InterfaceName,
               required: true,
               action: (symbol: string, lexer: ILexer) => {
                  this.interface.name = symbol;
               }
            },
            {
               validator: /{/g,
               required: true,
               action: (symbol: string, lexer: ILexer) => {
                  ctrl.addLexer(new CompositeType(this.interface));
               }
            },
            {
               validator: /}/g,
               required: true,
               action: (symbol: string, lexer: ILexer) => {
                  ctrl.env.interfaces.push(this.interface);
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
