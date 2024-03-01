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

// src/http/users/fetch-users.ts
var fetch_users_exports = {};
__export(fetch_users_exports, {
  fetchUsers: () => fetchUsers
});
module.exports = __toCommonJS(fetch_users_exports);

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/http/users/fetch-users.ts
var fetchUsers = async (req, res, next) => {
  try {
    const itemsPerPage = 20;
    const { search, page = 1 } = req.query;
    const quantityItems = await prisma_default.user.count({
      where: {
        deletedAt: { equals: null }
      }
    });
    const users = await prisma_default.user.findMany({
      where: {
        deletedAt: { equals: null },
        ...search && {
          OR: [
            { name: { contains: search.toString(), mode: "insensitive" } },
            { email: { contains: search.toString(), mode: "insensitive" } }
          ]
        }
      },
      skip: itemsPerPage * (page - 1),
      take: itemsPerPage,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: false
      }
    });
    const totalItemsPerPageSize = quantityItems / 20;
    const totalPages = totalItemsPerPageSize < 1 ? 1 : Math.ceil(totalItemsPerPageSize);
    return res.json({ users, page, totalItems: quantityItems, totalPages }).status(200 /* Success */);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchUsers
});
