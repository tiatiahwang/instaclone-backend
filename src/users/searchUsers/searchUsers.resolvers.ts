import { Resolvers } from '../../typed';

const resolvers: Resolvers = {
  Query: {
    searchUsers: async (_, { keyword, page }, { client }) =>
      await client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
        take: 5,
        skip: (page - 1) * 5,
      }),
  },
};

export default resolvers;
