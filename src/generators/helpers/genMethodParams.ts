import {IMethodParam} from '../../parser/interfaces/IMethodParam';

/**
 * @return ("${param1}", "${param2}")
 * */
export const genMethodParams = (params: IMethodParam[]) => {
   let output = '';
   params.map(p => {
      output += `${p.name}${p.type.nullable ? '?' : ''}: ${p.type.name}${p.type.array ? '[]' : ''}, `;
   });
   return output.slice(0, output.length - 2);
};

export const genMethodParamsWithPrefix = (params: { name: string, param: IMethodParam }[]) => {
   let output = '';
   params.map(p => {
      output += `${p.name}${p.param.type.nullable ? '?' : ''}: ${p.param.type.name}${p.param.type.array ? '[]' : ''}, `;
   });
   return output.slice(0, output.length - 2);
};
