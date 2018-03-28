import React from "react";

import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloLink, concat } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";

// Create an http link:
const httpLink = new HttpLink({
  uri: "https://server-cxjgizmubt.now.sh/"
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `wss://server-cxjgizmubt.now.sh/`,
  options: { reconnect: true }
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: localStorage.getItem("token") || null
    }
  });

  return forward(operation);
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  concat(authMiddleware, httpLink)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const ApolloProviderComponent = props => {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

export default ApolloProviderComponent;
