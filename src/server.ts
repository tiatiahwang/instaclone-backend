require('dotenv').config();

import * as express from 'express';
import * as logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/users.utils';
import client from './client';

const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      client,
      introspection: true,
      playground: true,
    };
  },
});

const PORT = process.env.PORT;

const app = express();

app.use(logger('tiny'));

apollo.applyMiddleware({ app });
app.use('/static', express.static('uploads'));
app.listen({ port: PORT }, () =>
  console.log(`Server Running http://localhost:${PORT}/graphql`),
);
