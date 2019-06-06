import {IObjectPath} from '../../../../classes/GQLObjectPath';
import {IInterface} from '../../../../parser/interfaces/IInterface';
import {getInterface} from '../../../helpers/getInterface';
import {primitiveTypes} from '../../../../helpers';
import {breadcrumbsToCapitalName} from '../../../helpers/breadcrumbsToCapitalName';

const _ = `\n`;
const ___ = `\n   `;
const ______ = `\n      `;

export const genDelegates = (queryType: 'query'|'mutation'|'subscription', op: IObjectPath, allInterfaces: IInterface[]) => {
   let output = ``;

   const bName = op.breadcrumbs.map(b => b.name).join('_') + '_delegate';
   const bPath = op.breadcrumbs.map(b => b.name).join('.');
   const lastB = op.breadcrumbs[op.breadcrumbs.length - 1];

   const i = getInterface(lastB.interfaceName, allInterfaces);
   const primitiveMembers = i.members.filter(m => primitiveTypes.includes(m.type.name));

   if (primitiveMembers.length || lastB.params.length || queryType === 'query') {
      output += `${_}let ${bName}: { ${lastB.name}Impl: I${breadcrumbsToCapitalName(op.breadcrumbs)}ImplCallback };`;
      output += `${_}try {`;
      output += `${___}${bName} = require('../generatedImpl/${queryType}.${bPath}');`;
      output += `${_}} catch (e) {`;
      output += `${___}console.warn('will be used dummy impl of "dummy/${queryType}.${bPath}" resolver');`;
      output += `${___}${bName} = require('./dummy/${queryType}.${bPath}');`;
      output += `${_}}`;
      output += `${_}`;
   }

   return output;
};
