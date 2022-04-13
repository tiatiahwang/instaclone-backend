import client from '../../client';
import { Resolvers } from '../../typed';
import { protectedResolver } from '../users.utils';

const resolvers: Resolvers = {
  Query: {
    me: protectedResolver((_, __, { loggedInUser }) =>
      client.user.findUnique({ where: { id: loggedInUser.id } }),
    ),
  },
};

export default resolvers;
