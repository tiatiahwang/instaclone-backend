import { Resolvers } from '../../typed';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(
      async (_, { id }, { loggedInUser, client }) => {
        const photo = await client.photo.findUnique({
          where: { id },
          select: { userId: true },
        });
        if (!photo) {
          return {
            ok: false,
            error: 'photo does not exist',
          };
        } else if (photo.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: 'not authorized',
          };
        } else {
          await client.photo.delete({ where: { id } });
        }
        return {
          ok: true,
        };
      },
    ),
  },
};

export default resolvers;
