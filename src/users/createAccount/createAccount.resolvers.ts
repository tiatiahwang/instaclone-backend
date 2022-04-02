import bcrypt from 'bcrypt';
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
        if (isExist) throw new Error('This username/email is already taken.');
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
          error: 'cannot create account.',
        };
      }
    },
  },
};

export default resolvers;
