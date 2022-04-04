import { Resolvers } from '../../typed';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, payload }, { loggedInUser, client }) => {
        const comment = await client.comment.findUnique({
          where: { id },
          select: { userId: true },
        });
        if (!comment) {
          return {
            ok: false,
            error: 'comment does not exist',
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: 'not authorized',
          };
        } else {
          await client.comment.update({
            where: { id },
            data: { payload },
          });
        }
        return {
          ok: true,
        };
      },
    ),
  },
};

export default resolvers;
