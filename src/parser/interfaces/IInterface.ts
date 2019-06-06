import {IMethod} from './IMethod';
import {IMember} from './IMember';

export interface IInterface {
   name: string;
   methods: IMethod[];
   members: IMember[];
}
