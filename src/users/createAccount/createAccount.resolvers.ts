import * as bcrypt from 'bcrypt';
import { Resolvers } from '../../typed';

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
      { client },
    ) => {
      try {
        const isExist = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });
        if (isExist) {
          return {
            ok: false,
            error: '이미 가입된 이메일/사용자이름 입니다',
          };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: hashedPassword,
          },
        });
        return {
          ok: true,
        };
      } catch {
        return {
          ok: false,
          error: '계정을 만들 수 없습니다',
        };
      }
    },
  },
};

export default resolvers;
