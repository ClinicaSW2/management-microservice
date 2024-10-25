import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL;

export const graphQLClient = new GraphQLClient(endpoint);

export const setGraphQLClientHeaders = (headers) => {
    graphQLClient.setHeaders(headers);
};
