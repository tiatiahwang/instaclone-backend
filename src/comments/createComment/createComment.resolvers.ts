import { Resolvers } from '../../typed';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(
      async (_, { photoId, payload }, { loggedInUser, client }) => {
        const exist = await client.photo.findUnique({
          where: { id: photoId },
          select: { id: true },
        });
        if (!exist) {
          return {
            ok: false,
            error: 'photo does not exist',
          };
        }
        const newComment = await client.comment.create({
          data: {
            payload,
            photo: { connect: { id: photoId } },
            user: { connect: { id: loggedInUser.id } },
          },
        });
        return {
          ok: true,
          id: newComment.id,
        };
      },
    ),
  },
};

export default resolvers;
