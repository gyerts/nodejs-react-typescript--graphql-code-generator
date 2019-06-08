# Setup server side
___
#### add gen script to your `package.json` file
___

```json
{
   "scripts": {
      "gen": "node ./node_modules/nodejs-react-typescript--graphql-code-generator --server --dist='./src/generated' --if='../interface'",
   },
}
```
where:
`--server` - means generate server code;
`--dist` - where generated code will be located;
`--if` - path to folder with your interfaces `IQuery.ts` `IMutation.ts` `ISubscription.ts`;


___
#### add `server.ts` file
___
```typescript
import {resolvers} from './generated/resolvers';
import {typeDefs} from './generated/mergedGQLSchemas';
import http from 'http';

const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const PORT = 4001;

const app = express();

const server = new ApolloServer({
   typeDefs,
   resolvers,
});

server.applyMiddleware({
   app
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
```
___
THAN RUN NEXT USUAL COMMANDS
```bash
npm run gen
npm run build
npm run start
```
___

# Setup client side
#### add gen script to your `package.json` file
___

```json
{
   "scripts": {
      "gen": "node ./node_modules/nodejs-react-typescript--graphql-code-generator --client --dist='./src/generated' --if='../interface'",
   },
}
```
where:
`--client` - means generate client code;
`--dist` - where generated code will be located;
`--if` - path to folder with your interfaces `IQuery.ts` `IMutation.ts` `ISubscription.ts`;

___
THAN RUN NEXT USUAL COMMANDS
```bash
npm run gen
npm run build
npm run start
```
___

# Simple usage use-case `IQuery`
This code generator generates all server and client side code. 
You need just to specify interface for communication in typescript style.
Create file `IQuery.ts` in `interfaces folder` with the following content:
```typescript
interface IUser {
   id: string;
   name: string;
   age: number;
}
interface IShortProject {
   id: string;
   name: string;
}
interface IProject {
   id: string;
   name: string;
   users: IUser[];
   user: (id: string) => IUser;
}
interface IAccount {
   project: (id: string) => IProject|IShortProject;
   projects: IShortProject[];
}
interface IQuery {
   account: (token: string) => IAccount;
}
```
Run code generation
```bash
npm run gen
```

Than you will have next requests to use
```typescript
// all generated code will be here in the generated folder
import {query} from "./generated/query.requests";
import {IAccount, IUser} from "./generated/query.interfaces";
import {IProject} from "./generated/query.interfaces";
import {IShortProject} from "./generated/query.interfaces";

class SomeComponent extends React.Component<any, any> {
```
```typescript
   // this method shows that not all generated requests you will want to use
   fetchWholeAccount = async () => {
      const accountToken = 'some token';
      const projectId = 'some id';
      const userId = 'some id';

      // I see no one case where you will need to fetch all account data, 
      // but anywhere this function will be available in the generated code

      const account: IAccount = await query.account(accountToken).fetchIAccount(projectId, userId);
      console.log(account.project);
      console.log(account.project.user.id);
      console.log(account.project.user.name);
      console.log(account.project.user.age);

      account.project.users.map((user: IUser) => {
         console.log(`here will be available all IUser fields ${user.id} ${user.name} ${user.age}`);
      });

      account.projects.map((prj: IShortProject) => {
         console.log(`here will be available only two fields from IShortProject interfaces ${prj.id} ${prj.name}`);
      });
   };
```
```typescript
   // this method shows that you can define short interfaces if you want fetch not all data from node
   fetchShortProject = async () => {
      const accountToken = 'some token';
      const projectId = 'some id';

      const shortProject: IShortProject = await query.account(accountToken).project(projectId).fetchIShortProject();
      console.log(shortProject.id);
      console.log(shortProject.name);
   };
```
```typescript
   // this method shows that not all generated requests you will want to use
   fetchProject = async () => {
      const accountToken = 'some token';
      const projectId = 'some id';
      const userId = 'some id';

      // this call also not useful, because it is same situation with fetching all account data
      // too math data will be fetched and then available
      const project: IProject = await query.account(accountToken).project(projectId).fetchIProject(userId);
      console.log(project);
      console.log(project.user.id);
      console.log(project.user.name);
      console.log(project.user.age);

      project.users.map((user: IUser) => {
         console.log(`here will be available all IUser fields ${user.id} ${user.name} ${user.age}`);
      });
   };
```
```typescript
   // this method shows how to fetch concrete user data
   fetchShortProjects = async () => {
      const accountToken = 'some token';

      const projects: IShortProject[] = await query.account(accountToken).projects().fetchArrayIShortProject();
      projects.map((prj: IShortProject) => {
         console.log(`here will be available only two fields from IShortProject interfaces ${prj.id} ${prj.name}`);
      });
   };
```
```typescript
   // this method shows how to fetch concrete user data
   fetchUser = async () => {
      const accountToken = 'some token';
      const projectId = 'some id';
      const userId = 'some id';

      const user: IUser = await query.account(accountToken).project(projectId).user(userId).fetchIUser();
      console.log(user.id);
      console.log(user.name);
      console.log(user.age);
   };
```
```typescript
   // this method shows how to fetch all users
   fetchUsers = async () => {
      const accountToken = 'some token';
      const projectId = 'some id';
      const userId = 'some id';

      const users: IUser[] = await query.account(accountToken).project(projectId).users().fetchArrayIUser();
      users.map((user: IUser) => {
         console.log(`here will be available all IUser fields ${user.id} ${user.name} ${user.age}`);
      });
   };
}
```
