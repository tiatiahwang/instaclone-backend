import { Resolvers } from '../../typed';

const resolvers: Resolvers = {
  Query: {
    searchPhotos: async (_, { keyword }, { client }) =>
      await client.photo.findMany({
        where: {
          caption: { startsWith: keyword },
        },
        take: 9,
      }),
  },
};

export default resolvers;
