import {ILexer} from './ILexer';

export interface IValidator {
   validator: RegExp;
   required: boolean;
   action: (symbol: string, activeLexer: ILexer) => void;
}
