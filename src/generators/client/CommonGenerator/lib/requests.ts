import gql from 'graphql-tag';
import { ApolloClient, HttpLink, InMemoryCache, FetchPolicy, split } from 'apollo-boost';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import { getMainDefinition } from 'apollo-utilities';
import { Observable } from 'subscriptions-transport-ws';

const errorLink = onError(({ graphQLErrors, networkError }) => {
   if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
         console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
         ),
      );
   }
   if (networkError) {
      console.error(`[Network error]: ${networkError}`);
   }
});

const links: any = [];
links.push(errorLink);

let headers = {};

const wsLink = new WebSocketLink({
   uri: `ws://127.0.0.1:4001/graphql`,
   options: {
      reconnect: true
   }
});


const httpLink = new HttpLink({
   uri: 'http://127.0.0.1:4001/graphql',
   headers,
});

const link = split(
   ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
   },
   wsLink,
   httpLink,
);


export const apolloClient = new ApolloClient({
   link,
   cache: new InMemoryCache(),
});

export const graphQlRequests = {
   /**
    * Make request with query to graphQL endpoint
    * Body of query you should crete manually
    * @param stringBody only query body without keyword 'query'
    * @param fetchPolicy one of FetchPolicy type
    * @returns {Promise<any>}
    */
   query: async <T>(stringBody: string, fetchPolicy: FetchPolicy = 'no-cache'): Promise<T> => {
      const query = `query {\n   ${stringBody.trim()}\n}`;
      console.debug(query);

      const req = await apolloClient
         .query({
            query: gql(query),
            fetchPolicy: fetchPolicy,
         })
         .catch(() => {
            console.log('GRAPHQL error');
            return undefined;
         });
      return req ? req.data : undefined;
   },
   /**
    * Make request with mutation to graphQL endpoint
    * Body of mutation you should crete manually
    * @param stringBody only mutation body without keyword 'mutation'
    * @returns {Promise<any>}
    */
   mutate: async <T>(stringBody: string): Promise<T> => {
      const mutation = `mutation {
            ${stringBody}
         }`;
      console.debug(mutation);
      const { data } = await apolloClient.mutate({ mutation: gql(mutation) });
      return data;
   },
   /**
    * Make subscription at graphQL endpoint
    * Body of subscription you should crete manually
    * @param stringBody only subscription body without keyword 'subscription'
    * @param next callback for each message
    * @returns {ZenObservable.Subscription | null}
    */
   subscribe: (stringBody: string, next: (data: any) => void): Observable<any> | null => {
      const subscription = `subscription {
            ${stringBody}
         }`;
      console.debug(subscription);
      const sub = apolloClient.subscribe({
         query: gql(subscription),
         variables: {},
      });
      return sub.subscribe(next) ? sub : null;
   },
};
