import { Resolvers } from '../../typed';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser, client }) => {
        let hashtagObj = [];
        if (caption) {
          const hashtags = caption.match(/#[\w]+/g);
          hashtagObj = hashtags.map((hashtag) => ({
            where: { hashtag },
            create: { hashtag },
          }));
        }
        return await client.photo.create({
          data: {
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            file,
            caption,
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
      },
    ),
  },
};

export default resolvers;
