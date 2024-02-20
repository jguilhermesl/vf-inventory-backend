var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/auth/login.ts
var login_exports = {};
__export(login_exports, {
  login: () => login
});
module.exports = __toCommonJS(login_exports);

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  PORT: import_zod.z.coerce.number().default(3333),
  JWT_SECRET: import_zod.z.string()
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid environment variables.", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/errors/internal-server-error.ts
var InternalServerError = class extends Error {
  constructor() {
    super("Internal server error.");
  }
};

// src/errors/invalid-credentials-error.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid credentials.");
  }
};

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/http/auth/login.ts
var import_bcryptjs = require("bcryptjs");
var import_jsonwebtoken = require("jsonwebtoken");
var import_zod2 = require("zod");
var login = async (req, res, next) => {
  try {
    const loginBodySchema = import_zod2.z.object({
      email: import_zod2.z.string().email(),
      password: import_zod2.z.string()
    });
    const { email, password } = loginBodySchema.parse(req.body);
    const user = await prisma_default.user.findFirst({
      where: {
        email
      },
      select: {
        passwordHash: true,
        name: true,
        email: true,
        role: true,
        id: true
      }
    });
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const passwordMatch = await (0, import_bcryptjs.compare)(password, user.passwordHash);
    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }
    const token = (0, import_jsonwebtoken.sign)(
      {
        name: user == null ? void 0 : user.name,
        email: user == null ? void 0 : user.email,
        role: user == null ? void 0 : user.role
      },
      "" + env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "30d"
      }
    );
    const refreshToken = (0, import_jsonwebtoken.sign)(
      {
        name: user == null ? void 0 : user.name,
        email: user == null ? void 0 : user.email
      },
      "" + env.JWT_SECRET,
      {
        subject: user == null ? void 0 : user.id,
        expiresIn: "7d"
      }
    );
    return res.cookie("refreshToken", refreshToken, {
      secure: true,
      // HTTPs,
      sameSite: true,
      httpOnly: true,
      path: "/"
    }).status(201).json({
      token,
      refreshToken
    });
  } catch (err) {
    const error = new InternalServerError();
    return next(err != null ? err : error);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  login
});
