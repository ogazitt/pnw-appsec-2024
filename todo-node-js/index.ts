import express = require("express");
import cors = require("cors");
import { expressjwt as jwt, GetVerificationKey } from "express-jwt";
import jwksRsa = require("jwks-rsa");
import { Directory } from "./directory";
import { Store } from "./store";
import { Server } from "./server";
import { UserCache, User, Todo } from "./interfaces";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { Request as JWTRequest } from "express-jwt";


dotenvExpand.expand(dotenv.config());

import { jwtAuthz } from "@aserto/aserto-node";
import { getConfig } from "./config";

const authzOptions = getConfig();

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI,
  }) as GetVerificationKey,

  // Validate the audience and the issuer
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ["RS256"],
});

const app: express.Application = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

Store.open().then((store) => {
  const server = new Server(store);

  /*
  const checkAuthz: express.Handler = async (req: JWTRequest, res, next) => {
    try {
      // retrieve the user and todo from the database 
      const user = users[req.auth.sub];
      const todo = await store.get(req.params.id);
      // allow the operation if the user is an admin
      // ...or if the user is an editor and the user owns this todo
      if (user.roles.includes("admin") ||
          user.roles.includes("editor") && todo.OwnerID === user.id) {
        next()
      } else {
        res.status(403).send({ "msg": "Access denied" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
  */

  // Aserto authorizer middleware function
  const checkAuthz: express.Handler = jwtAuthz(
    authzOptions,
    undefined,
    async (req: express.Request) => {
      if (!req.params?.id) {
        return {};
      }

      const todo = await store.get(req.params.id);
      return { ownerID: todo.OwnerID, id: req.params.id };
    }
  );

  // super simple middleware - works with policy-rebac-global-appsec
  // const checkAuthz: express.Handler = jwtAuthz(authzOptions);

  const directory = new Directory({});

  // Users cache
  const users: UserCache = {};
  app.get("/users/:userID", checkJwt, checkAuthz, async (req: JWTRequest, res) => {
    const { userID } = req.params;
    let user: User = users[userID]

    if(user){
      res.json(user);
      return
    }

    if(req.auth.sub === userID) {
      user =  await directory.getUserByIdentity(userID)
    } else {
      user =  await directory.getUserById(userID)
    }

    //Fill cache
    users[userID] = user;
    res.json(user);
  });

  // authorization done using middleware (checkAuthz)
  app.get("/todos", checkJwt, checkAuthz, server.list.bind(server));
  app.post("/todos", checkJwt, checkAuthz, server.create.bind(server));
  app.delete("/todos/:id", checkJwt, checkAuthz, server.delete.bind(server));
  // app.put("/todos/:id", checkJwt, checkAuthz, server.update.bind(server)); 
  
  // authorization done with if/else spaghetti code
  app.put("/todos/:id", checkJwt, (req: JWTRequest, res) => {
    try {
      const todo: Todo = req.body;

      // retrieve the user from the database using the subject claim in the JWT
      const user = users[req.auth.sub];
      // allow the operation if the user is an admin
      // ...or if the user is an editor and the user owns this todo
      if (user.roles.includes("admin") ||
          user.roles.includes("editor") && todo.OwnerID === user.id) {
        return server.update(req, res);
      } else {
        res.status(403).send({ "msg": "Access denied" })
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
});
