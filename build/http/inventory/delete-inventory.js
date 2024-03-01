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

// src/http/inventory/delete-inventory.ts
var delete_inventory_exports = {};
__export(delete_inventory_exports, {
  deleteInventory: () => deleteInventory
});
module.exports = __toCommonJS(delete_inventory_exports);

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/http/inventory/delete-inventory.ts
var deleteInventory = async (req, res, next) => {
  try {
    const { id: inventoryId } = req.params;
    await prisma_default.inventory.updateMany({
      where: {
        id: inventoryId
      },
      data: {
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    return res.json({ message: "Estoque deletado com sucesso." }).status(200 /* Success */);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteInventory
});
