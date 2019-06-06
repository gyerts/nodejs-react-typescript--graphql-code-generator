import {IInterface} from '../parser/interfaces/IInterface';
import {IType} from '../parser/interfaces/IType';
import {primitiveTypes} from '../helpers';
import {IMethodParam} from '../parser/interfaces/IMethodParam';
import {getFullListOfParamsNoParent} from '../generators/helpers/getFullListOfParamsNoParent';
import {getInterface} from '../generators/helpers/getInterface';


export interface IBreadcrumb {
   name: string;
   interfaceName: string;
   type: IType;
   params: { name: string, param: IMethodParam }[];
}
export interface IObjectPath {
   type: IType;
   breadcrumbs: IBreadcrumb[];
   signatureParams: IMethodParam[];
}
export class GQLObjectPath {
   public readonly objectPaths: IObjectPath[] = [];

   constructor (
      public readonly globalInterfaceName: string,
      public readonly allInterfaces: IInterface[],
   ) {
      this.readObjectPaths([], getInterface(globalInterfaceName, allInterfaces));
      console.log(JSON.stringify(this.objectPaths, null, 3));
      this.addParamsToAllObjects(getInterface(globalInterfaceName, allInterfaces));
   }

   readObjectPaths = (parentBreadcrumbs: IBreadcrumb[], currentInterface: IInterface) => {
      currentInterface.members.map(m => {
         const breadcrumbs = [...parentBreadcrumbs];
         if (!primitiveTypes.includes(m.type.name)) {
            breadcrumbs.push({
               name: m.name,
               interfaceName: m.type.name,
               type: m.type,
               params: [],
            });
            this.objectPaths.push({
               type: m.type,
               breadcrumbs: breadcrumbs,
               signatureParams: [], // will be filled here addParamsToAllObjects()
            });
            this.readObjectPaths(
               breadcrumbs,
               getInterface(m.type.name, this.allInterfaces));
         }
      });
      currentInterface.methods.map(m => {
         m.returnValues.map((rv: IType) => {
            const breadcrumbs = [...parentBreadcrumbs];
            breadcrumbs.push({
               name: m.name,
               interfaceName: rv.name,
               type: rv,
               params: m.params.map(p => ({ name: `${m.name}_${p.name}`, param: p })),
            });
            this.objectPaths.push({
               type: rv,
               breadcrumbs: breadcrumbs,
               signatureParams: [], // will be filled here addParamsToAllObjects()
            });
            this.readObjectPaths(
               breadcrumbs,
               getInterface(rv.name, this.allInterfaces));
         });
      });
   };

   addParamsToAllObjects = (globalInterface: IInterface) => {
      const handleObjectPath = (objectPath: IObjectPath) => {
         let nextInterface = globalInterface;
         objectPath.breadcrumbs.map((breadcrumb: IBreadcrumb) => {
            console.log('----------------');
            console.log(breadcrumb);
            const foundMethod = nextInterface.methods.find(m => m.name === breadcrumb.name);
            const foundMember = nextInterface.members.find(m => m.name === breadcrumb.name);
            if (foundMethod) {
               foundMethod.params.map(param => {
                  objectPath.signatureParams.push({ ...param, name: `${foundMethod.name}_${param.name}` });
               });
               nextInterface = getInterface(breadcrumb.interfaceName, this.allInterfaces);
            } else if (foundMember) {
               nextInterface = getInterface(breadcrumb.interfaceName, this.allInterfaces);
            } else {
               throw `[${nextInterface.name}][${nextInterface.methods.map(m => m.name)}] do not includes "${breadcrumb.name}"`;
            }
         });
         const params = getFullListOfParamsNoParent(
            objectPath.breadcrumbs[objectPath.breadcrumbs.length - 1].interfaceName,
            this.allInterfaces,
         );
         objectPath.signatureParams = objectPath.signatureParams.concat(params);
      };

      this.objectPaths.map((objectPath: IObjectPath) => {
         console.log('======================================================');
         console.log('next breadcrumb ======================================');
         console.log('======================================================');
         handleObjectPath(objectPath);
         console.log('******************************************************');
         console.log(JSON.stringify(objectPath, null, 3));
      });
   };
}
