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

// src/http/products/create-product.ts
var create_product_exports = {};
__export(create_product_exports, {
  createProduct: () => createProduct
});
module.exports = __toCommonJS(create_product_exports);

// src/errors/internal-server-error.ts
var InternalServerError = class extends Error {
  constructor() {
    super("Internal server error.");
  }
};

// src/errors/product-already-exists-error.ts
var ProductAlreadyExistsError = class extends Error {
  constructor() {
    super("Product already exists.");
  }
};

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/http/products/create-product.ts
var import_zod = require("zod");
var createProduct = async (req, res, next) => {
  try {
    const createProductBodySchema = import_zod.z.object({
      sigla: import_zod.z.string(),
      name: import_zod.z.string()
    });
    const { sigla, name } = createProductBodySchema.parse(req.body);
    const existingProduct = await prisma_default.product.findUnique({
      where: { name, sigla }
    });
    if (existingProduct) {
      throw new ProductAlreadyExistsError();
    }
    const code = name.slice(0, 3).toUpperCase() + name.slice(name.length - 3, name.length).toUpperCase();
    await prisma_default.product.create({
      data: { code, name, sigla }
    });
    return res.json({ message: "Produto cadastrado com sucesso." }).status(201 /* Created */);
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createProduct
});
