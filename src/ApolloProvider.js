import React from 'react'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { ApolloProvider } from '@apollo/react-hooks'
import { setContext } from 'apollo-link-context'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import App from './App'

const wsLink = new WebSocketLink({
    uri: `ws://10.10.8.26:5000/graphql`,
    options: {
        reconnect: true
    },
    lazy: true
})

wsLink.subscriptionClient.on("connecting", () => {
    console.log("connecting")
})

wsLink.subscriptionClient.on("connected", () => {
    console.log("connected");
});

const httpLink = new createHttpLink({
    uri: 'http://10.10.8.26:5000'
})

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);


const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken')
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache(),
    connectToDevTools: true
})

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)
