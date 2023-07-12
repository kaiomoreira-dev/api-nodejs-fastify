"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));

// src/routes/transactions.ts
var import_crypto = require("crypto");

// src/database.ts
var import_knex = require("knex");

// src/env/index.ts
var import_zod = require("zod");
var import_config = require("dotenv/config");
var import_dotenv = require("dotenv");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test", override: true });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: import_zod.z.string().nonempty(),
  DATABASE_CLIENT: import_zod.z.enum(["sqlite", "pg"]).default("sqlite"),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.log("Failed to parse environment", _env.error.format());
  throw new Error("Failed to parse environmentt");
}
var env = _env.data;

// src/database.ts
var config2 = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === "sqlite" ? {
    filename: env.DATABASE_URL
  } : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/routes/transactions.ts
var import_zod2 = require("zod");

// src/middlewares/check-session-id-transaction.ts
async function checkSessionIdTransaction(request, reply) {
  const sessionId = request.cookies.sessionId;
  if (!sessionId) {
    return reply.status(401).send({ error: "Session unathorized" });
  }
}

// src/middlewares/log-acess.transaction.ts
async function logAcessTransaction(request) {
  console.log(`[${request.method}] - ${request.url}`);
}

// src/routes/transactions.ts
async function transactionsRoutes(app2) {
  app2.addHook("preHandler", logAcessTransaction);
  app2.post("/", async (request, reply) => {
    const createTransactionSchema = import_zod2.z.object({
      description: import_zod2.z.string(),
      amount: import_zod2.z.number(),
      type: import_zod2.z.enum(["debit", "credit"])
    });
    const { amount, description, type } = createTransactionSchema.parse(
      request.body
    );
    let sessionId = request.cookies.sessionId;
    if (!sessionId) {
      sessionId = (0, import_crypto.randomUUID)();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1e3 * 60 * 60 * 24 * 7
        // 7days
      });
    }
    await knex("transaction").insert({
      id: (0, import_crypto.randomUUID)(),
      description,
      amount: type === "credit" ? amount : amount * -1,
      sessionId
    });
    return reply.status(201).send();
  });
  app2.get(
    "/",
    {
      preHandler: [checkSessionIdTransaction]
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId;
      const transactions = await knex("transaction").where({
        sessionId
      }).select();
      return reply.status(200).send({ transactions });
    }
  );
  app2.get(
    "/:id",
    {
      preHandler: [checkSessionIdTransaction]
    },
    async (request, reply) => {
      const idTransactionParams = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = idTransactionParams.parse(request.params);
      const sessionId = request.cookies.sessionId;
      const transaction = await knex("transaction").where({
        id,
        sessionId
      }).select().first();
      return reply.status(200).send({ transaction });
    }
  );
  app2.get(
    "/summary",
    {
      preHandler: [checkSessionIdTransaction]
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId;
      const summary = await knex("transaction").where({
        sessionId
      }).sum("amount", {
        as: "amount"
      }).first();
      return reply.status(200).send({ summary });
    }
  );
}

// src/app.ts
var import_cookie = __toESM(require("@fastify/cookie"));
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.register(transactionsRoutes, {
  prefix: "api/transactions"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
