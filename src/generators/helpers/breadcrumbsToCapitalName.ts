import {IBreadcrumb} from '../../classes/GQLObjectPath';

export const breadcrumbsToCapitalName = (breadcrumbs: IBreadcrumb[]) => {
   return breadcrumbs.map(b => b.name[0].toUpperCase() + b.name.slice(1)).join('');
};
