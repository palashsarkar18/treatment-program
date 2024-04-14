import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// const client = new ApolloClient({
//   link: new HttpLink({
//     uri: "http://localhost:3000/graphql", // Replace with your actual GraphQL endpoint
//   }),
//   cache: new InMemoryCache(),
// });

const client = new ApolloClient({
  uri: "http://localhost:3000",
  cache: new InMemoryCache(),
});

export default client;
