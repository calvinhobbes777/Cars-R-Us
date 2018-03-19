import React from "react";

import { ApolloProvider } from "react-apollo";
import {
  concat,
  HttpLink,
  ApolloLink,
  ApolloClient,
  InMemoryCache
} from "apollo-boost";

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: localStorage.getItem("token") || null
    }
  });

  return forward(operation);
});

const httpLink = new HttpLink({ uri: "http://localhost:4000" });

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache()
});

const ApolloProviderComponent = props => {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

export default ApolloProviderComponent;
