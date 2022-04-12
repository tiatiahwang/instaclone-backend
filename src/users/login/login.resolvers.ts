import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Resolvers } from '../../typed';

const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { username, password }, { client }) => {
      const user = await client.user.findUnique({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return {
          ok: false,
          error: 'Incorrect Password.',
        };
      }
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};

export default resolvers;
