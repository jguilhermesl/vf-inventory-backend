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

// src/http/products/delete-product.ts
var delete_product_exports = {};
__export(delete_product_exports, {
  deleteProduct: () => deleteProduct
});
module.exports = __toCommonJS(delete_product_exports);

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

// src/http/products/delete-product.ts
var deleteProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    await prisma_default.product.update({
      where: {
        id: productId
      },
      data: {
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    return res.json({ message: "Produto deletado com sucesso." }).status(200 /* Success */);
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteProduct
});
