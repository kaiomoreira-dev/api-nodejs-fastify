"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// node_modules/fastify-plugin/lib/getPluginName.js
var require_getPluginName = __commonJS({
  "node_modules/fastify-plugin/lib/getPluginName.js"(exports, module2) {
    "use strict";
    var fpStackTracePattern = /at\s{1}(?:.*\.)?plugin\s{1}.*\n\s*(.*)/;
    var fileNamePattern = /(\w*(\.\w*)*)\..*/;
    module2.exports = function getPluginName(fn) {
      if (fn.name.length > 0)
        return fn.name;
      const stackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 10;
      try {
        throw new Error("anonymous function");
      } catch (e) {
        Error.stackTraceLimit = stackTraceLimit;
        return extractPluginName(e.stack);
      }
    };
    function extractPluginName(stack) {
      const m = stack.match(fpStackTracePattern);
      return m ? m[1].split(/[/\\]/).slice(-1)[0].match(fileNamePattern)[1] : "anonymous";
    }
    module2.exports.extractPluginName = extractPluginName;
  }
});

// node_modules/fastify-plugin/lib/toCamelCase.js
var require_toCamelCase = __commonJS({
  "node_modules/fastify-plugin/lib/toCamelCase.js"(exports, module2) {
    "use strict";
    module2.exports = function toCamelCase(name) {
      if (name[0] === "@") {
        name = name.slice(1).replace("/", "-");
      }
      const newName = name.replace(/-(.)/g, function(match, g1) {
        return g1.toUpperCase();
      });
      return newName;
    };
  }
});

// node_modules/fastify-plugin/plugin.js
var require_plugin = __commonJS({
  "node_modules/fastify-plugin/plugin.js"(exports, module2) {
    "use strict";
    var getPluginName = require_getPluginName();
    var toCamelCase = require_toCamelCase();
    var count = 0;
    function plugin(fn, options = {}) {
      let autoName = false;
      if (typeof fn.default !== "undefined") {
        fn = fn.default;
      }
      if (typeof fn !== "function") {
        throw new TypeError(
          `fastify-plugin expects a function, instead got a '${typeof fn}'`
        );
      }
      if (typeof options === "string") {
        options = {
          fastify: options
        };
      }
      if (typeof options !== "object" || Array.isArray(options) || options === null) {
        throw new TypeError("The options object should be an object");
      }
      if (options.fastify !== void 0 && typeof options.fastify !== "string") {
        throw new TypeError(`fastify-plugin expects a version string, instead got '${typeof options.fastify}'`);
      }
      if (!options.name) {
        autoName = true;
        options.name = getPluginName(fn) + "-auto-" + count++;
      }
      fn[Symbol.for("skip-override")] = options.encapsulate !== true;
      fn[Symbol.for("fastify.display-name")] = options.name;
      fn[Symbol.for("plugin-meta")] = options;
      if (!fn.default) {
        fn.default = fn;
      }
      const camelCase = toCamelCase(options.name);
      if (!autoName && !fn[camelCase]) {
        fn[camelCase] = fn;
      }
      return fn;
    }
    module2.exports = plugin;
    module2.exports.default = plugin;
    module2.exports.fastifyPlugin = plugin;
  }
});

// node_modules/cookie/index.js
var require_cookie = __commonJS({
  "node_modules/cookie/index.js"(exports) {
    "use strict";
    exports.parse = parse;
    exports.serialize = serialize;
    var __toString = Object.prototype.toString;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse(str, options) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options || {};
      var dec = opt.decode || decode;
      var index = 0;
      while (index < str.length) {
        var eqIdx = str.indexOf("=", index);
        if (eqIdx === -1) {
          break;
        }
        var endIdx = str.indexOf(";", index);
        if (endIdx === -1) {
          endIdx = str.length;
        } else if (endIdx < eqIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        var key = str.slice(index, eqIdx).trim();
        if (void 0 === obj[key]) {
          var val = str.slice(eqIdx + 1, endIdx).trim();
          if (val.charCodeAt(0) === 34) {
            val = val.slice(1, -1);
          }
          obj[key] = tryDecode(val, dec);
        }
        index = endIdx + 1;
      }
      return obj;
    }
    function serialize(name, val, options) {
      var opt = options || {};
      var enc = opt.encode || encode;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError("option priority is invalid");
        }
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function decode(str) {
      return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
    }
    function encode(val) {
      return encodeURIComponent(val);
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]" || val instanceof Date;
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e) {
        return str;
      }
    }
  }
});

// node_modules/@fastify/cookie/signer.js
var require_signer = __commonJS({
  "node_modules/@fastify/cookie/signer.js"(exports, module2) {
    "use strict";
    var crypto = require("crypto");
    var base64PaddingRE = /=/g;
    function Signer(secrets, algorithm = "sha256") {
      if (!(this instanceof Signer)) {
        return new Signer(secrets, algorithm);
      }
      this.secrets = Array.isArray(secrets) ? secrets : [secrets];
      this.signingKey = this.secrets[0];
      this.algorithm = algorithm;
      validateSecrets(this.secrets);
      validateAlgorithm(this.algorithm);
    }
    function validateSecrets(secrets) {
      for (const secret of secrets) {
        if (typeof secret !== "string" && Buffer.isBuffer(secret) === false) {
          throw new TypeError("Secret key must be a string or Buffer.");
        }
      }
    }
    function validateAlgorithm(algorithm) {
      try {
        crypto.createHmac(algorithm, crypto.randomBytes(16));
      } catch (e) {
        throw new TypeError(`Algorithm ${algorithm} not supported.`);
      }
    }
    function _sign(value, secret, algorithm) {
      if (typeof value !== "string") {
        throw new TypeError("Cookie value must be provided as a string.");
      }
      return value + "." + crypto.createHmac(algorithm, secret).update(value).digest("base64").replace(base64PaddingRE, "");
    }
    function _unsign(signedValue, secrets, algorithm) {
      if (typeof signedValue !== "string") {
        throw new TypeError("Signed cookie string must be provided.");
      }
      const value = signedValue.slice(0, signedValue.lastIndexOf("."));
      const actual = Buffer.from(signedValue.slice(signedValue.lastIndexOf(".") + 1));
      for (const secret of secrets) {
        const expected = Buffer.from(crypto.createHmac(algorithm, secret).update(value).digest("base64").replace(base64PaddingRE, ""));
        if (expected.length === actual.length && crypto.timingSafeEqual(expected, actual)) {
          return {
            valid: true,
            renew: secret !== secrets[0],
            value
          };
        }
      }
      return {
        valid: false,
        renew: false,
        value: null
      };
    }
    Signer.prototype.sign = function(value) {
      return _sign(value, this.signingKey, this.algorithm);
    };
    Signer.prototype.unsign = function(signedValue) {
      return _unsign(signedValue, this.secrets, this.algorithm);
    };
    function sign(value, secret, algorithm = "sha256") {
      const secrets = Array.isArray(secret) ? secret : [secret];
      validateSecrets(secrets);
      return _sign(value, secrets[0], algorithm);
    }
    function unsign(signedValue, secret, algorithm = "sha256") {
      const secrets = Array.isArray(secret) ? secret : [secret];
      validateSecrets(secrets);
      return _unsign(signedValue, secrets, algorithm);
    }
    module2.exports = Signer;
    module2.exports.signerFactory = Signer;
    module2.exports.Signer = Signer;
    module2.exports.sign = sign;
    module2.exports.unsign = unsign;
  }
});

// node_modules/@fastify/cookie/plugin.js
var require_plugin2 = __commonJS({
  "node_modules/@fastify/cookie/plugin.js"(exports, module2) {
    "use strict";
    var fp = require_plugin();
    var cookie2 = require_cookie();
    var { Signer, sign, unsign } = require_signer();
    function fastifyCookieSetCookie(reply, name, value, options, signer) {
      const opts = Object.assign({}, options);
      if (opts.expires && Number.isInteger(opts.expires)) {
        opts.expires = new Date(opts.expires);
      }
      if (opts.signed) {
        value = signer.sign(value);
      }
      if (opts.secure === "auto") {
        if (isConnectionSecure(reply.request)) {
          opts.secure = true;
        } else {
          opts.sameSite = "lax";
          opts.secure = false;
        }
      }
      const serialized = cookie2.serialize(name, value, opts);
      let setCookie = reply.getHeader("Set-Cookie");
      if (!setCookie) {
        reply.header("Set-Cookie", serialized);
        return reply;
      }
      if (typeof setCookie === "string") {
        setCookie = [setCookie];
      }
      setCookie.push(serialized);
      reply.removeHeader("Set-Cookie");
      reply.header("Set-Cookie", setCookie);
      return reply;
    }
    function fastifyCookieClearCookie(reply, name, options) {
      const opts = Object.assign({ path: "/" }, options, {
        expires: /* @__PURE__ */ new Date(1),
        signed: void 0,
        maxAge: void 0
      });
      return fastifyCookieSetCookie(reply, name, "", opts);
    }
    function onReqHandlerWrapper(fastify2, hook) {
      return hook === "preParsing" ? function fastifyCookieHandler(fastifyReq, fastifyRes, payload, done) {
        fastifyReq.cookies = {};
        const cookieHeader = fastifyReq.raw.headers.cookie;
        if (cookieHeader) {
          fastifyReq.cookies = fastify2.parseCookie(cookieHeader);
        }
        done();
      } : function fastifyCookieHandler(fastifyReq, fastifyRes, done) {
        fastifyReq.cookies = {};
        const cookieHeader = fastifyReq.raw.headers.cookie;
        if (cookieHeader) {
          fastifyReq.cookies = fastify2.parseCookie(cookieHeader);
        }
        done();
      };
    }
    function getHook(hook = "onRequest") {
      const hooks = {
        onRequest: "onRequest",
        preParsing: "preParsing",
        preValidation: "preValidation",
        preHandler: "preHandler",
        [false]: false
      };
      return hooks[hook];
    }
    function plugin(fastify2, options, next) {
      const secret = options.secret;
      const hook = getHook(options.hook);
      if (hook === void 0) {
        return next(new Error("@fastify/cookie: Invalid value provided for the hook-option. You can set the hook-option only to false, 'onRequest' , 'preParsing' , 'preValidation' or 'preHandler'"));
      }
      const isSigner = !secret || typeof secret.sign === "function" && typeof secret.unsign === "function";
      const algorithm = options.algorithm || "sha256";
      const signer = isSigner ? secret : new Signer(secret, algorithm);
      fastify2.decorate("parseCookie", parseCookie);
      if (typeof secret !== "undefined") {
        fastify2.decorate("signCookie", signCookie);
        fastify2.decorate("unsignCookie", unsignCookie);
        fastify2.decorateRequest("signCookie", signCookie);
        fastify2.decorateRequest("unsignCookie", unsignCookie);
        fastify2.decorateReply("signCookie", signCookie);
        fastify2.decorateReply("unsignCookie", unsignCookie);
      }
      fastify2.decorateRequest("cookies", null);
      fastify2.decorateReply("cookie", setCookie);
      fastify2.decorateReply("setCookie", setCookie);
      fastify2.decorateReply("clearCookie", clearCookie);
      if (hook) {
        fastify2.addHook(hook, onReqHandlerWrapper(fastify2, hook));
      }
      next();
      function parseCookie(cookieHeader) {
        return cookie2.parse(cookieHeader, options.parseOptions);
      }
      function signCookie(value) {
        return signer.sign(value);
      }
      function unsignCookie(value) {
        return signer.unsign(value);
      }
      function setCookie(name, value, cookieOptions) {
        const opts = Object.assign({}, options.parseOptions, cookieOptions);
        return fastifyCookieSetCookie(this, name, value, opts, signer);
      }
      function clearCookie(name, cookieOptions) {
        const opts = Object.assign({}, options.parseOptions, cookieOptions);
        return fastifyCookieClearCookie(this, name, opts);
      }
    }
    function isConnectionSecure(request) {
      return request.raw.socket?.encrypted === true || request.headers["x-forwarded-proto"] === "https";
    }
    var fastifyCookie = fp(plugin, {
      fastify: "4.x",
      name: "@fastify/cookie"
    });
    fastifyCookie.signerFactory = Signer;
    fastifyCookie.fastifyCookie = fastifyCookie;
    fastifyCookie.default = fastifyCookie;
    module2.exports = fastifyCookie;
    fastifyCookie.fastifyCookie.signerFactory = Signer;
    fastifyCookie.fastifyCookie.Signer = Signer;
    fastifyCookie.fastifyCookie.sign = sign;
    fastifyCookie.fastifyCookie.unsign = unsign;
    module2.exports.signerFactory = Signer;
    module2.exports.Signer = Signer;
    module2.exports.sign = sign;
    module2.exports.unsign = unsign;
  }
});

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
var import_cookie = __toESM(require_plugin2());
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.register(transactionsRoutes, {
  prefix: "api/transactions"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
