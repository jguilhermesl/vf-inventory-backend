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

// src/http/users/create-user.ts
var create_user_exports = {};
__export(create_user_exports, {
  createUser: () => createUser
});
module.exports = __toCommonJS(create_user_exports);

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/http/users/create-user.ts
var import_zod = require("zod");
var import_bcryptjs = require("bcryptjs");

// src/errors/email-already-exists-error.ts
var EmailAlreadyExistsError = class extends Error {
  constructor() {
    super("Email j\xE1 existe.");
  }
};

// src/errors/internal-server-error.ts
var InternalServerError = class extends Error {
  constructor() {
    super("Internal server error.");
  }
};

// src/http/users/create-user.ts
var createUser = async (req, res, next) => {
  try {
    const createUserBodySchema = import_zod.z.object({
      name: import_zod.z.string(),
      role: import_zod.z.enum(["admin", "member"]),
      email: import_zod.z.string().email(),
      password: import_zod.z.string()
    });
    const { name, role, email, password } = createUserBodySchema.parse(
      req.body
    );
    const user = await prisma_default.user.findUnique({
      where: {
        email
      }
    });
    if (user) {
      throw new EmailAlreadyExistsError();
    }
    await prisma_default.user.create({
      data: {
        name,
        role,
        email,
        passwordHash: await (0, import_bcryptjs.hash)(password, 6)
      }
    });
    return res.json({ message: "Usu\xE1rio criado com sucesso." }).status(201);
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUser
});
