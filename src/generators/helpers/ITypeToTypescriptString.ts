import {IType} from '../../parser/interfaces/IType';

export const ITypeToTypescriptString = (name: string, t: IType) => {
   return `${name}${t.nullable ? '?' : ''}: ${t.name}${t.array ? '[]' : ''};`;
};
