import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
    Mutation: {
        login: async (_, { userName, password }) => {
            // userName을 이용해 user 찾기
            const user = await client.user.findUnique({ where: { userName } });
            if (!user) {
                return {
                    ok: false,
                    error: "User not found.",
                };
            }
            // password 확인
            const passwordOk = await bcrypt.compare(password, user.password);
            if (!passwordOk) {
                return {
                    ok: false,
                    error: "Incorrect password.",
                };
            }
            // token 발행 후 해당 user에게 전송
            const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
            return {
                ok: true,
                token,
            };
        },
    },
};
