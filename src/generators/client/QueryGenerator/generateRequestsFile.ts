import {IInterface} from '../../../parser/interfaces/IInterface';
import {options} from '../../../settings';
import fs from 'fs';
import {genMethodParams, genMethodParamsWithPrefix} from '../../helpers/genMethodParams';
import {getFullListOfParamsNoParent} from '../../helpers/getFullListOfParamsNoParent';
import {IBreadcrumb, IObjectPath} from '../../../classes/GQLObjectPath';
import {IType} from '../../../parser/interfaces/IType';
import {InterfacesWalker} from '../../../classes/InterfacesWalker';
import {IMethodParam} from '../../../parser/interfaces/IMethodParam';
import {getNamespaceName} from '../../server/generators/genNames';


class Node {
   children: { [breadcrumbName: string]: Node } = {};
   variants: { ownParams: IMethodParam[], op: IObjectPath }[] = [];

   constructor(
      public readonly name: string,
      public readonly ownParams: { name: string, param: IMethodParam }[],
   ) {}

   add = (ownParams: IMethodParam[], op: IObjectPath) => {
      if (!this.variants.find(v => v.op.type.name === op.type.name)) {
         this.variants.push({ownParams, op});
      }
   };
}
class NodeHolder {
   node: Node = new Node('query', []);
   entries: string[] = [];

   initStructure = (breadcrumbs: IBreadcrumb[]) => {
      let currentNode = this.node;
      breadcrumbs.map(b => {
         if (!currentNode.children[b.name]) {
            currentNode.children[b.name] = new Node(b.name, b.params);
         }
         currentNode = currentNode.children[b.name];
      });
   };

   getNode = (breadcrumbs: IBreadcrumb[]) => {
      let currentNode = this.node;
      breadcrumbs.map(b => {
         currentNode = currentNode.children[b.name];
      });
      return currentNode;
   };

   add = (ownParams: IMethodParam[], op: IObjectPath) => {
      this.initStructure(op.breadcrumbs);

      let currentNode: Node = this.getNode(op.breadcrumbs);
      currentNode.add(ownParams, op);
   };
}

const transformDataForGeneration = (allInterfaces: IInterface[], globalInterfaceName: string) => {
   const nodeHolder = new NodeHolder();

   const prohibitedPaths: string[] = [];
   const handlerInDataTransform = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath) => {
      const objectPath = op.breadcrumbs.map(b => b.name).join('.');
      const prohibited = prohibitedPaths.find(p => objectPath.indexOf(p) !== -1);
      let allowed = true;
      if (prohibited && prohibited.length !== objectPath.length) {
         allowed = false;
      }
      if (op.type.array) {
         prohibitedPaths.push(objectPath);
      }
      if (allowed) {
         nodeHolder.add(ownParams, op);
      }
   };

   const walkerDataTransform = new InterfacesWalker(
      globalInterfaceName,
      allInterfaces,
      handlerInDataTransform,
   );
   walkerDataTransform.run();

   return nodeHolder;
};

const genTransformedData = (allInterfaces: IInterface[], globalInterfaceName: string) => {
   let output = 'import { graphQlRequests } from \'./requests\';\n';
   output += 'import * as i from \'./query.interfaces\';\n';
   output += 'import * as q from \'./query.queries\';\n\n';
   output += 'export const query = {';

   const entriesPath: string[] = [];

   const getPromiseTypeString = (type: IType) => {
      return 'i.' + type.name + (type.array ? '[]' : '');
   };
   const genFunction = (breadcrumbName: string, ownParams: IMethodParam[], op: IObjectPath) => {
      const __ = '\n' + tab_space.repeat(op.breadcrumbs.length);
      const ____ = '\n' + tab_space.repeat(op.breadcrumbs.length + 1);
      const ______ = '\n' + tab_space.repeat(op.breadcrumbs.length + 2);
      const ________ = '\n' + tab_space.repeat(op.breadcrumbs.length + 3);
      const responseType = `i.${getNamespaceName(op)}.${op.type.name}Response`;
      const joinedAllParams = op.signatureParams.map(p => p.name).join(', ');
      const params = genMethodParams(getFullListOfParamsNoParent(op.type.name, allInterfaces));
      const methodName = `fetch${op.type.array ? 'Array' : ''}${op.type.name}`;

      output += `${____}${methodName}: async (${params}): Promise<${getPromiseTypeString(op.type)}> => {`;
      output += `${______}const response = await graphQlRequests.query<${responseType}>(`;
      output += `${________}q.${entriesPath.join('_')}_${op.type.name}_fields(${joinedAllParams})`;
      output += `${______});`;
      output += `${______}console.log(response);`;
      output += `${______}return response.${entriesPath.join('.')};`;
      output += `${____}},`;
   };
   const nodeHolder = transformDataForGeneration(allInterfaces, globalInterfaceName);

   const handle = (node: Node) => {
      entriesPath.push(node.name);
      const ___ = '\n' + tab_space.repeat(entriesPath.length);
      const ______ = '\n' + tab_space.repeat(entriesPath.length + 1);
      const _________ = '\n' + tab_space.repeat(entriesPath.length + 2);
      const params = genMethodParamsWithPrefix(node.ownParams);

      output += `${___}${node.name}: (${params}) => ({`;

      node.variants.map(v => {
         genFunction(node.name, v.ownParams, v.op);
      });

      Object.keys(node.children).map(key => {
         handle(node.children[key]);
      });

      output += `${___}}),`;
      entriesPath.pop();
   };

   Object.keys(nodeHolder.node.children).map(key => {
      handle(nodeHolder.node.children[key]);
   });

   output += '\n};\n';
   return output;
};

const tab_space = '   ';
export const generateRequestsFile = (
   globalInterfaceName: string,
   allInterfaces: IInterface[],
) => {
   const output = genTransformedData(allInterfaces, globalInterfaceName);

   fs.writeFile(`${options.clientOutDir.get()}/query.requests.ts`, output, (err) => {
      if (err) {
         return console.error(err);
      }
   });
};
