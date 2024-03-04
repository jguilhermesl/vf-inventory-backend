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

// src/routes/routes.ts
var routes_exports = {};
__export(routes_exports, {
  router: () => router
});
module.exports = __toCommonJS(routes_exports);
var import_express = require("express");

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/http/inventory/fetch-inventory.ts
var fetchInventory = async (req, res, next) => {
  try {
    const itemsPerPage = 20;
    const { search, page = 1 } = req.query;
    const quantityItems = await prisma_default.inventory.count({
      where: {
        deletedAt: { equals: null }
      }
    });
    const data = await prisma_default.inventory.findMany({
      where: {
        deletedAt: { equals: null },
        ...search && {
          OR: [
            {
              product: {
                OR: [
                  { name: { contains: search.toString(), mode: "insensitive" } },
                  { sigla: { contains: search.toString(), mode: "insensitive" } },
                  { code: { contains: search.toString(), mode: "insensitive" } }
                ]
              }
            },
            { lot: { contains: search.toString(), mode: "insensitive" } }
          ]
        }
      },
      skip: itemsPerPage * (page - 1),
      take: itemsPerPage,
      select: {
        product: true,
        lot: true,
        price: true,
        createdBy: true,
        quantity: true,
        validity: true,
        id: true,
        deletedAt: true
      }
    });
    const inventory = data.map((item) => {
      return {
        id: item.id,
        lot: item.lot,
        price: item.price,
        quantity: item.quantity,
        validity: item.validity,
        productName: item.product.name
      };
    });
    const totalItemsPerPageSize = quantityItems / 20;
    const totalPages = totalItemsPerPageSize < 1 ? 1 : Math.ceil(totalItemsPerPageSize);
    return res.json({ inventory, page, totalItems: quantityItems, totalPages }).status(200 /* Success */);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

// src/http/inventory/action-inventoy.ts
var import_zod = require("zod");
var createActionInventory = async (req, res, next) => {
  try {
    const { id: inventoryId } = req.params;
    const userId = req.userState.sub;
    const createActionInventoryBodySchema = import_zod.z.object({
      type: import_zod.z.enum(["input", "output"]),
      quantity: import_zod.z.number(),
      price: import_zod.z.number().nullable().optional(),
      customerName: import_zod.z.string().optional().nullable(),
      customerPaymentType: import_zod.z.enum(["pix", "cash", "credit-card", "deb"]).optional().nullable()
    });
    const {
      type,
      quantity,
      price,
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
        price,
        customerName,
        customerPaymentType,
        createdBy: {
          connect: {
            id: userId
          }
        }
      }
    });
    const inventory = await prisma_default.inventory.findUnique({
      where: {
        id: inventoryId
      }
    });
    if (type === "output") {
      const finalValue = inventory.quantity - quantity;
      if (finalValue < 0) {
        return res.status(409 /* Conflict */).send({ error: "Estoque n\xE3o pode ficar negativo." });
      }
    }
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
    return res.status(500).send({ error: "Algo aconteceu de errado.", message: err });
  }
};

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod2 = require("zod");
var envSchema = import_zod2.z.object({
  NODE_ENV: import_zod2.z.enum(["dev", "test", "production"]).default("dev"),
  PORT: import_zod2.z.coerce.number().default(3333),
  JWT_SECRET: import_zod2.z.string()
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid environment variables.", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/http/auth/login.ts
var import_bcryptjs = require("bcryptjs");
var import_jsonwebtoken = require("jsonwebtoken");
var import_zod3 = require("zod");
var login = async (req, res, next) => {
  try {
    const loginBodySchema = import_zod3.z.object({
      email: import_zod3.z.string().email(),
      password: import_zod3.z.string()
    });
    const { email, password } = loginBodySchema.parse(req.body);
    const user = await prisma_default.user.findFirst({
      where: {
        email
      },
      select: {
        passwordHash: true,
        name: true,
        email: true,
        role: true,
        id: true
      }
    });
    if (!user) {
      return res.status(401 /* Unauthorized */).send({ error: "Credenciais inv\xE1lidas." });
    }
    const passwordMatch = await (0, import_bcryptjs.compare)(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401 /* Unauthorized */).send({ error: "Credenciais inv\xE1lidas." });
    }
    const token = (0, import_jsonwebtoken.sign)(
      {
        name: user == null ? void 0 : user.name,
        email: user == null ? void 0 : user.email,
        role: user == null ? void 0 : user.role
      },
      "" + env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "30d"
      }
    );
    const refreshToken = (0, import_jsonwebtoken.sign)(
      {
        name: user == null ? void 0 : user.name,
        email: user == null ? void 0 : user.email
      },
      "" + env.JWT_SECRET,
      {
        subject: user == null ? void 0 : user.id,
        expiresIn: "7d"
      }
    );
    return res.cookie("refreshToken", refreshToken, {
      secure: true,
      // HTTPs,
      sameSite: true,
      httpOnly: true,
      path: "/"
    }).status(201).json({
      token,
      refreshToken
    });
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

// src/http/users/create-user.ts
var import_zod4 = require("zod");
var import_bcryptjs2 = require("bcryptjs");
var createUser = async (req, res, next) => {
  try {
    const createUserBodySchema = import_zod4.z.object({
      name: import_zod4.z.string(),
      role: import_zod4.z.enum(["admin", "member"]),
      email: import_zod4.z.string().email(),
      password: import_zod4.z.string()
    });
    const { name, role, email, password } = createUserBodySchema.parse(
      req.body
    );
    const user = await prisma_default.user.findUnique({
      where: {
        email
      }
    });
    if (user) {
      return res.json({ error: "Email j\xE1 existente." }).status(409 /* Conflict */);
    }
    await prisma_default.user.create({
      data: {
        name,
        role,
        email,
        passwordHash: await (0, import_bcryptjs2.hash)(password, 6)
      }
    });
    return res.json({ message: "Usu\xE1rio criado com sucesso." }).status(201);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

// src/http/users/delete-user.ts
var deleteUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    await prisma_default.user.delete({
      where: {
        id: userId
      }
    });
    return res.json({ message: "Usu\xE1rio deletado com sucesso." }).status(201);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

// src/http/users/edit-user.ts
var import_zod5 = require("zod");
var import_bcryptjs3 = require("bcryptjs");
var editUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const editUserBodySchema = import_zod5.z.object({
      name: import_zod5.z.string().optional(),
      role: import_zod5.z.enum(["admin", "member"]).optional(),
      email: import_zod5.z.string().email().optional(),
      password: import_zod5.z.string().optional()
    });
    const { name, role, email, password } = editUserBodySchema.parse(req.body);
    await prisma_default.user.update({
      where: {
        id: userId
      },
      data: {
        ...name && { name },
        ...role && { role },
        ...email && { email },
        ...password && { passwordHash: await (0, import_bcryptjs3.hash)(password, 6) },
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return res.json({ message: "Usu\xE1rio editado com sucesso." }).status(201);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

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
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

// src/middlewares/auth-middleware.ts
var import_jsonwebtoken2 = require("jsonwebtoken");
function isAuthenticated(req, res, next) {
  const authToken = req.headers.authorization;
  if (!authToken)
    return res.status(401).json({
      error: "Unauthorized."
    });
  const [, token] = authToken.split(" ");
  (0, import_jsonwebtoken2.verify)(token, env.JWT_SECRET, (error, decoded) => {
    if (error)
      return res.status(401).json({ error });
    req.userState = decoded;
    return next();
  });
}

// src/utils/generateProductCode.ts
var generateProductCode = (name) => {
  const parts = name.split(" ");
  const code = parts[0].slice(0, 3).toUpperCase() + parts[1].slice(0, 3).toUpperCase() + parts[parts.length - 1].slice(parts[parts.length - 1].length - 3, parts[parts.length - 1].length).toUpperCase();
  return code;
};

// src/http/products/create-product.ts
var import_zod6 = require("zod");
var createProduct = async (req, res, next) => {
  try {
    const createProductBodySchema = import_zod6.z.object({
      sigla: import_zod6.z.string(),
      name: import_zod6.z.string()
    });
    const { sigla, name } = createProductBodySchema.parse(req.body);
    const existingProduct = await prisma_default.product.findUnique({
      where: { name, sigla }
    });
    if (existingProduct) {
      return res.json({ error: "Produto j\xE1 existente." }).status(409 /* Conflict */);
    }
    const code = generateProductCode(name);
    await prisma_default.product.create({
      data: { code, name, sigla }
    });
    return res.json({ message: "Produto cadastrado com sucesso." }).status(201 /* Created */);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

// src/http/products/delete-product.ts
var deleteProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    console.log("productId ==> ", productId);
    await prisma_default.product.updateMany({
      where: {
        id: productId
      },
      data: {
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    return res.json({ message: "Produto deletado com sucesso." }).status(200 /* Success */);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

// src/http/products/edit-product.ts
var import_zod7 = require("zod");
var editProduct = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const editProductBodySchema = import_zod7.z.object({
      sigla: import_zod7.z.string().optional(),
      name: import_zod7.z.string().optional()
    });
    const { sigla, name } = editProductBodySchema.parse(req.body);
    await prisma_default.product.update({
      where: {
        id: userId
      },
      data: {
        ...name && { name },
        ...sigla && { sigla },
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return res.json({ message: "Produto editado com sucesso." }).status(200 /* Success */);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

// src/http/inventory/edit-inventory.ts
var import_zod8 = require("zod");
var editInventory = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const createInventoryBodySchema = import_zod8.z.object({
      lot: import_zod8.z.string(),
      price: import_zod8.z.number(),
      quantity: import_zod8.z.number(),
      validity: import_zod8.z.string()
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
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

// src/http/inventory/create-inventory.ts
var import_zod9 = require("zod");
var createInventory = async (req, res, next) => {
  try {
    const userId = req.userState.sub;
    const createInventoryBodySchema = import_zod9.z.object({
      lot: import_zod9.z.string(),
      price: import_zod9.z.number(),
      quantity: import_zod9.z.number(),
      validity: import_zod9.z.string(),
      productId: import_zod9.z.string()
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

// src/http/products/get-product.ts
var getProduct = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const user = await prisma_default.product.findUnique({
      where: {
        id: userId
      }
    });
    return res.json({ user }).status(200 /* Success */);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

// src/http/products/fetch-products.ts
var fetchProducts = async (req, res, next) => {
  try {
    const itemsPerPage = 20;
    const { search, page = 1 } = req.query;
    const quantityItems = await prisma_default.product.count({
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
    const totalItemsPerPageSize = quantityItems / 20;
    const totalPages = totalItemsPerPageSize < 1 ? 1 : Math.ceil(totalItemsPerPageSize);
    return res.json({ products, page, totalItems: quantityItems, totalPages }).status(200 /* Success */);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err });
  }
};

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

// src/routes/routes.ts
var router = (0, import_express.Router)();
router.post("/users/signin", login);
router.post("/users", createUser);
router.delete("/users/:id", isAuthenticated, deleteUser);
router.put("/users/:id", isAuthenticated, editUser);
router.get("/me", isAuthenticated, getUserProfile);
router.get("/users", isAuthenticated, fetchUsers);
router.post("/products", isAuthenticated, createProduct);
router.delete("/products/:id", isAuthenticated, deleteProduct);
router.put("/products/:id", isAuthenticated, editProduct);
router.get("/products/:id", isAuthenticated, getProduct);
router.get("/products", isAuthenticated, fetchProducts);
router.post("/inventory", isAuthenticated, createInventory);
router.put("/inventory/:id", isAuthenticated, editInventory);
router.post("/inventory/action/:id", isAuthenticated, createActionInventory);
router.get("/inventory", isAuthenticated, fetchInventory);
router.delete("/inventory/:id", isAuthenticated, deleteInventory);
router.get("/history", isAuthenticated, fetchHistory);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  router
});
