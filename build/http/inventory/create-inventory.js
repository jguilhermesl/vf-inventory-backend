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

// src/http/inventory/create-inventory.ts
var create_inventory_exports = {};
__export(create_inventory_exports, {
  createInventory: () => createInventory
});
module.exports = __toCommonJS(create_inventory_exports);

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/http/inventory/create-inventory.ts
var import_zod = require("zod");
var createInventory = async (req, res, next) => {
  try {
    const userId = req.userState.sub;
    const createInventoryBodySchema = import_zod.z.object({
      lot: import_zod.z.string(),
      price: import_zod.z.number(),
      quantity: import_zod.z.number(),
      validity: import_zod.z.string(),
      productId: import_zod.z.string()
    });
    const { lot, price, quantity, validity, productId } = createInventoryBodySchema.parse(req.body);
    const inventory = await prisma_default.inventory.create({
      data: {
        lot,
        price,
        quantity,
        validity: new Date(validity),
        product: { connect: { id: productId } },
        createdBy: { connect: { id: userId } }
      }
    });
    await prisma_default.history.create({
      data: {
        quantity,
        type: "input",
        createdBy: {
          connect: {
            id: userId
          }
        },
        inventory: {
          connect: {
            id: inventory.id
          }
        }
      }
    });
    return res.json({ message: "Estoque criado com sucesso." }).status(201);
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createInventory
});
