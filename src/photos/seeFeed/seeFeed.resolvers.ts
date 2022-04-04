import { Resolvers } from '../../typed';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(
      async (_, __, { loggedInUser, client }) =>
        await client.photo.findMany({
          where: {
            OR: [
              { user: { followers: { some: { id: loggedInUser.id } } } },
              { userId: loggedInUser.id },
            ],
          },
          orderBy: { createdAt: 'desc' },
        }),
    ),
  },
};

export default resolvers;
