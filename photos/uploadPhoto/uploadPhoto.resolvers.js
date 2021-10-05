import { protectedResolver } from "../../users/users.utils";
import client from "../../client";
import { processHasstags } from "../photos.utils";

export default {
    Mutation: {
        uploadPhoto: protectedResolver(async (_, { file, caption }, { loggedInUser }) => {
            let hashtagObj = [];
            if (caption) {
                hashtagObj = processHasstags(caption);
            }
            return client.photo.create({
                data: {
                    file,
                    caption,
                    user: {
                        connect: {
                            id: loggedInUser.id,
                        },
                    },
                    ...(hashtagObj.length > 0 && {
                        hashtags: {
                            connectOrCreate: hashtagObj,
                        },
                    }),
                },
            });
        }),
    },
};
