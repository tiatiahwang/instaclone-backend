import client from "../client";

export default {
    User: {
        totalFollowing: async ({ id }) =>
            await client.user.count({
                where: {
                    following: {
                        some: {
                            id,
                        },
                    },
                },
            }),
        totalFollowers: async ({ id }) =>
            await client.user.count({
                where: {
                    followers: {
                        some: {
                            id,
                        },
                    },
                },
            }),
        isMe: ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
            }
            return id == loggedInUser.id;
        },
        isFollowing: async ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
            }
            const exists = await client.user.count({
                where: {
                    userName: loggedInUser.userName,
                    following: {
                        some: {
                            id,
                        },
                    },
                },
            });
            return Boolean(exists);
        },
    },
};
