import bcrypt from "bcrypt";
import client from "../../client";

export default {
    Mutation: {
        createAccount: async (_, { firstName, lastName, userName, email, password }) => {
            try {
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
                if (existingUser) {
                    throw new Error("This username/email is already taken.");
                }
                // hash password
                const uglyPassword = await bcrypt.hash(password, 10);
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
            } catch (e) {
                return e;
            }
        },
    },
};
