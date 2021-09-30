require("dotenv").config();

import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { getUser } from "./users/users.utils";

// context: 모든 resolver에서 접근 가능한 정보를 넣을 수 있는 object
const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
        return {
            loggedInUser: await getUser(req.headers.token),
        };
    },
});

const PORT = process.env.PORT;

server.listen(PORT).then(() => console.log(`Server is Running on http://localhost:${PORT}`));
