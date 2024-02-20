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

// src/http/users/edit-user.ts
var edit_user_exports = {};
__export(edit_user_exports, {
  editUser: () => editUser
});
module.exports = __toCommonJS(edit_user_exports);

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/http/users/edit-user.ts
var import_zod = require("zod");
var import_bcryptjs = require("bcryptjs");

// src/errors/internal-server-error.ts
var InternalServerError = class extends Error {
  constructor() {
    super("Internal server error.");
  }
};

// src/http/users/edit-user.ts
var editUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const editUserBodySchema = import_zod.z.object({
      name: import_zod.z.string().optional(),
      role: import_zod.z.enum(["admin", "member"]).optional(),
      email: import_zod.z.string().email().optional(),
      password: import_zod.z.string().optional()
    });
    const { name, role, email, password } = editUserBodySchema.parse(req.body);
    await prisma_default.user.update({
      where: {
        id: userId
      },
      data: {
        ...name && { name },
        ...role && { role },
        ...email && { email },
        ...password && { passwordHash: await (0, import_bcryptjs.hash)(password, 6) },
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return res.json({ message: "Usu\xE1rio editado com sucesso." }).status(201);
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  editUser
});
