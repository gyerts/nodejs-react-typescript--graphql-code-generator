import {IMethodParam} from './IMethodParam';
import {IType} from './IType';

export interface IMethod {
   name: string;
   params: IMethodParam[];
   returnValues: IType[];
}
