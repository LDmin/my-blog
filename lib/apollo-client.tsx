import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://my-blog-wine-nine.vercel.app/api/graphql",
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export default client;
