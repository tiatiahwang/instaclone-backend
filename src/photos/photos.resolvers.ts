import client from '../client';

export default {
  Photo: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({
        where: {
          photos: { some: { id } },
        },
      }),
  },
  Hashtag: {
    photos: ({ id }, { page }, { client }) =>
      client.hashtag.findUnique({ where: { id } }).photos(),
    totalPhotos: ({ id }, _, { client }) =>
      client.photo.count({
        where: { hashtags: { some: { id } } },
      }),
  },
};
