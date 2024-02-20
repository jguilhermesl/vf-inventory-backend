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

// src/http/inventory/edit-inventory.ts
var edit_inventory_exports = {};
__export(edit_inventory_exports, {
  editInventory: () => editInventory
});
module.exports = __toCommonJS(edit_inventory_exports);

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/http/inventory/edit-inventory.ts
var import_zod = require("zod");
var editInventory = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const createInventoryBodySchema = import_zod.z.object({
      lot: import_zod.z.string(),
      price: import_zod.z.number(),
      quantity: import_zod.z.number(),
      validity: import_zod.z.string()
    });
    const { lot, price, quantity, validity } = createInventoryBodySchema.parse(
      req.body
    );
    await prisma_default.inventory.update({
      where: {
        id: productId
      },
      data: {
        ...lot && { lot },
        ...price && { price },
        ...quantity && { quantity },
        ...validity && { validity: new Date(validity) },
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return res.json({ message: "Estoque editado com sucesso." }).status(201);
  } catch (err) {
    console.log(err);
    return res.json({ message: "Algo aconteceu de errado." }).status(500);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  editInventory
});
