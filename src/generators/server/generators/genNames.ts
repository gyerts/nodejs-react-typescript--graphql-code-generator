import {IObjectPath} from '../../../classes/GQLObjectPath';

export const getRouteName = (queryType: 'query'|'mutation'|'subscription', op: IObjectPath, name?: string) => {
   return `${queryType}_` + op.breadcrumbs.map(b => b.name).join('_') + (name ? `_${name}` : '') + '_route';
};
export const getRouteContextName = (op: IObjectPath) => {
   return op.breadcrumbs.map(b => b.name[0].toUpperCase() + b.name.slice(1)).join('') + 'RouteContext';
};
export const getPrimitiveName = (iName: string) => {
   return `external.${iName}Primitives`;
};
export const getNamespaceName = (op: IObjectPath) => {
   return `${op.breadcrumbs.map(b => b.name).join('_')}`;
};
