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

// src/http/users/get-user.ts
var get_user_exports = {};
__export(get_user_exports, {
  getUserProfile: () => getUserProfile
});
module.exports = __toCommonJS(get_user_exports);

// src/errors/internal-server-error.ts
var InternalServerError = class extends Error {
  constructor() {
    super("Internal server error.");
  }
};

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/http/users/get-user.ts
var getUserProfile = async (req, res, next) => {
  try {
    const id = req.userState.sub;
    const user = await prisma_default.user.findUnique({
      where: {
        id
      }
    });
    return res.json({ user }).status(201);
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUserProfile
});
