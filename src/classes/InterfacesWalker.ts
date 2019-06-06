import {IInterface} from '../parser/interfaces/IInterface';
import {IBreadcrumb, IObjectPath} from './GQLObjectPath';
import {primitiveTypes} from '../helpers';
import {getInterface} from '../generators/helpers/getInterface';
import {IType} from '../parser/interfaces/IType';
import {getFullListOfParamsNoParent} from '../generators/helpers/getFullListOfParamsNoParent';
import {IMethodParam} from '../parser/interfaces/IMethodParam';

export class InterfacesWalker {
   constructor(
      public readonly mainInterfaceName: string,
      public readonly allInterfaces: IInterface[],
      public readonly callbackIn: (item: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean) => void,
      public readonly callbackOut?: (item: string, ownParams: IMethodParam[], op: IObjectPath, forClientOnly: boolean) => void,
   ) {}

   public run = () => {
      this.readNext([], getInterface(this.mainInterfaceName, this.allInterfaces));
   };

   private readNext = (parentBreadcrumbs: IBreadcrumb[], currentInterface: IInterface) => {
      currentInterface.members.map(m => {
         const breadcrumbs = [...parentBreadcrumbs];
         if (!primitiveTypes.includes(m.type.name)) {
            breadcrumbs.push({
               name: m.name,
               interfaceName: m.type.name,
               params: [],
               type: m.type,
            });
            const objectPath: IObjectPath = {
               type: m.type,
               breadcrumbs: breadcrumbs,
               signatureParams: [],
            };
            this.initWithSignatureParams(objectPath);
            this.callbackIn(m.name, [], objectPath, false);
            this.readNext(
               breadcrumbs,
               getInterface(m.type.name, this.allInterfaces)
            );
            this.callbackOut && this.callbackOut(m.name, [], objectPath, false);
         }
      });
      currentInterface.methods.map(m => {
         let forClientOnly = false;
         m.returnValues.map((rv: IType) => {
            const breadcrumbs = [...parentBreadcrumbs];
            breadcrumbs.push({
               name: m.name,
               interfaceName: rv.name,
               type: rv,
               params: m.params.map(p => ({ name: `${m.name}_${p.name}`, param: p })),
            });
            const objectPath: IObjectPath = {
               type: rv,
               breadcrumbs: breadcrumbs,
               signatureParams: [],
            };
            this.initWithSignatureParams(objectPath);
            this.callbackIn(m.name, m.params, objectPath, forClientOnly);
            this.readNext(
               breadcrumbs,
               getInterface(rv.name, this.allInterfaces)
            );
            this.callbackOut && this.callbackOut(m.name, m.params, objectPath, forClientOnly);
            forClientOnly = true;
         });
      });
   };

   private initWithSignatureParams = (objectPath: IObjectPath) => {
      let i = getInterface(this.mainInterfaceName, this.allInterfaces);
      objectPath.breadcrumbs.map((breadcrumb: IBreadcrumb) => {
         const foundMethod = i.methods.find(m => m.name === breadcrumb.name);
         const foundMember = i.members.find(m => m.name === breadcrumb.name);
         if (foundMethod) {
            foundMethod.params.map(param => {
               objectPath.signatureParams.push({ ...param, name: `${foundMethod.name}_${param.name}` });
            });
            i = getInterface(breadcrumb.interfaceName, this.allInterfaces);
         } else if (foundMember) {
            i = getInterface(breadcrumb.interfaceName, this.allInterfaces);
         } else {
            throw `[${i.name}][${i.methods.map(m => m.name)}] do not includes "${breadcrumb.name}"`;
         }
      });
      const params = getFullListOfParamsNoParent(
         objectPath.breadcrumbs[objectPath.breadcrumbs.length - 1].interfaceName,
         this.allInterfaces,
      );
      objectPath.signatureParams = objectPath.signatureParams.concat(params);
   };
}
