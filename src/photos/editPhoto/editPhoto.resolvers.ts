import { Resolvers } from '../../typed';
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from '../photos.utils';

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser, client }) => {
        const exist = await client.photo.findFirst({
          where: {
            id,
            userId: loggedInUser.id,
          },
          include: {
            hashtags: { select: { hashtag: true } },
          },
        });
        if (!exist) {
          return {
            ok: false,
            error: 'photo does not exist',
          };
        }
        await client.photo.update({
          where: { id },
          data: {
            caption,
            hashtags: {
              disconnect: exist.hashtags,
              connectOrCreate: processHashtags(caption),
            },
          },
        });
        return {
          ok: true,
        };
      },
    ),
  },
};

export default resolvers;
