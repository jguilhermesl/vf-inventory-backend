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

// src/http/products/fetch-products.ts
var fetch_products_exports = {};
__export(fetch_products_exports, {
  fetchProducts: () => fetchProducts
});
module.exports = __toCommonJS(fetch_products_exports);

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

// src/http/products/fetch-products.ts
var fetchProducts = async (req, res, next) => {
  try {
    const itemsPerPage = 20;
    const { search, page = 1 } = req.query;
    const quantityItems = await prisma_default.inventory.count({
      where: {
        deletedAt: { equals: null }
      }
    });
    const products = await prisma_default.product.findMany({
      where: {
        deletedAt: { equals: null },
        ...search && {
          OR: [
            { name: { contains: search.toString(), mode: "insensitive" } },
            { code: { contains: search.toString(), mode: "insensitive" } },
            { sigla: { contains: search.toString(), mode: "insensitive" } }
          ]
        }
      },
      skip: itemsPerPage * (page - 1),
      take: itemsPerPage,
      select: {
        id: true,
        name: true,
        code: true,
        sigla: true
      }
    });
    return res.json({ products, page, totalItems: quantityItems, totalPages: Math.floor(quantityItems / 20) }).status(200 /* Success */);
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchProducts
});
