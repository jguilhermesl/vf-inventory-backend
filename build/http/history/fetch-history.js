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

// src/http/history/fetch-history.ts
var fetch_history_exports = {};
__export(fetch_history_exports, {
  fetchHistory: () => fetchHistory
});
module.exports = __toCommonJS(fetch_history_exports);

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/http/history/fetch-history.ts
var fetchHistory = async (req, res, next) => {
  try {
    const itemsPerPage = 20;
    const { search, page = 1 } = req.query;
    const quantityItems = await prisma_default.history.count({
      where: {
        deletedAt: { equals: null }
      }
    });
    const data = await prisma_default.history.findMany({
      where: {
        deletedAt: { equals: null },
        ...search && {
          OR: [
            {
              inventory: {
                OR: [
                  { lot: { contains: search.toString(), mode: "insensitive" } },
                  { product: { name: { contains: search.toString(), mode: "insensitive" } } }
                ]
              }
            },
            { customerName: { contains: search.toString(), mode: "insensitive" } }
          ]
        }
      },
      skip: itemsPerPage * (page - 1),
      take: itemsPerPage,
      select: {
        createdAt: true,
        type: true,
        inventory: {
          select: {
            lot: true,
            product: {
              select: {
                name: true
              }
            }
          }
        },
        customerName: true,
        customerPaymentType: true,
        createdBy: {
          select: {
            name: true
          }
        },
        quantity: true,
        id: true,
        deletedAt: true,
        price: true
      }
    });
    const history = data.map((item) => {
      return {
        inventoryLot: item.inventory.lot,
        inventoryProduct: item.inventory.product.name,
        quantity: item.quantity,
        type: item.type,
        customerName: item.customerName,
        customerPaymentType: item.customerPaymentType,
        createdBy: item.createdBy.name,
        createdAt: item.createdAt,
        id: item.id,
        price: item.price
      };
    });
    const totalItemsPerPageSize = quantityItems / 20;
    const totalPages = totalItemsPerPageSize < 1 ? 1 : Math.ceil(totalItemsPerPageSize);
    return res.json({ history, page, totalItems: quantityItems, totalPages }).status(200 /* Success */);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchHistory
});
