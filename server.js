require("dotenv").config();

import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const app = express();
const PORT = process.env.PORT;

const startServer = async () => {
    // context: 모든 resolver에서 접근 가능한 정보를 넣을 수 있는 object
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            return {
                loggedInUser: await getUser(req.headers.token),
            };
        },
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await server.start();

    app.use(graphqlUploadExpress());
    app.use(logger("tiny"));
    server.applyMiddleware({ app });
    app.use("/static", express.static("uploads"));

    await new Promise((r) => app.listen({ port: PORT }, r));

    console.log(`Server is Running on http://localhost:${PORT}${server.graphqlPath}`);
};

startServer();
