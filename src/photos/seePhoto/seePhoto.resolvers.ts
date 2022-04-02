import { Resolvers } from '../../typed';

const resolver: Resolvers = {
  Query: {
    seePhoto: async (_, { id }, { client }) =>
      await client.photo.findUnique({
        where: { id },
      }),
  },
};

export default resolver;
