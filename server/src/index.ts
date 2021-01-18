import "dotenv/config";
import "reflect-metadata";
import * as express from "express";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import { graphqlUploadExpress } from "graphql-upload";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { ImageResolver } from "./resolvers/image";
import { refreshToken } from "./routes/refreshToken";
import { existsSync, mkdirSync } from "fs";

(async () => {
  const app = express();

  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.ORIGIN_LINK || "http://localhost:1234",
      credentials: true,
    })
  );

  app.use(express.static("public"));
  app.use(graphqlUploadExpress());
  existsSync(path.join(__dirname, "../public")) ||
    mkdirSync(path.join(__dirname, "../public"));
  existsSync(path.join(__dirname, "../public/images")) ||
    mkdirSync(path.join(__dirname, "../public/images"));

  app.use("/images", express.static(path.join(__dirname, "../public/images")));
  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ImageResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
    uploads: false,
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.post("/refresh_token", refreshToken);
  app.get("/", (_, res) => res.send("workinggg"));
  app.listen(process.env.PORT || 4001, () => {
    console.log("express server started");
  });
})();
