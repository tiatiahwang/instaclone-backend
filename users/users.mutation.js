import bcrypt from "bcrypt";
import client from "../client";

export default {
    Mutation: {
        createAccount: async (_, { firstName, lastName, userName, email, password }) => {
            // username이랑 email 중복 확인

            const existingUser = await client.user.findFirst({
                where: {
                    OR: [
                        {
                            userName,
                        },
                        {
                            email,
                        },
                    ],
                },
            });
            console.log(existingUser);
            // hash password
            const uglyPassword = bcrypt.hash(password, 10);
            console.log(uglyPassword);
            // user 저장 하고 해당 user 반환
            return client.user.create({
                data: {
                    userName,
                    email,
                    firstName,
                    lastName,
                    password: uglyPassword,
                },
            });
        },
    },
};
