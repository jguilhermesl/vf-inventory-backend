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

// src/http/inventory/action-inventoy.ts
var action_inventoy_exports = {};
__export(action_inventoy_exports, {
  createActionInventory: () => createActionInventory
});
module.exports = __toCommonJS(action_inventoy_exports);

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

// src/http/inventory/action-inventoy.ts
var import_zod = require("zod");
var createActionInventory = async (req, res, next) => {
  try {
    const { id: inventoryId } = req.params;
    const userId = req.userState.sub;
    const createActionInventoryBodySchema = import_zod.z.object({
      type: import_zod.z.enum(["input", "output"]),
      quantity: import_zod.z.number(),
      customerName: import_zod.z.string().optional(),
      customerPaymentType: import_zod.z.enum(["pix", "cash", "credit-card", "deb"]).optional()
    });
    const {
      type,
      quantity,
      customerName,
      customerPaymentType
    } = createActionInventoryBodySchema.parse(req.body);
    await prisma_default.history.create({
      data: {
        type,
        inventory: {
          connect: {
            id: inventoryId
          }
        },
        quantity,
        customerName,
        customerPaymentType,
        createdBy: {
          connect: {
            id: userId
          }
        }
      }
    });
    const updateData = {
      ...type === "input" ? { quantity: { increment: quantity } } : type === "output" ? { quantity: { decrement: quantity } } : {},
      updatedAt: /* @__PURE__ */ new Date()
    };
    await prisma_default.inventory.update({
      where: {
        id: inventoryId
      },
      data: updateData
    });
    return res.status(201 /* Created */).json({ message: "A\xE7\xE3o enviada com sucesso e estoque atualizado." });
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createActionInventory
});
