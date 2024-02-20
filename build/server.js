var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/errors/email-already-exists-error.ts
var EmailAlreadyExistsError = class extends Error {
  constructor() {
    super("Email j\xE1 existe.");
  }
};

// src/middlewares/error-middleware.ts
var errorMiddleware = (err, req, res, next) => {
  console.log("err ==> ", err);
  if (err instanceof EmailAlreadyExistsError) {
    return res.status(500 /* InternalServerError */).json({ err: err.message });
  }
  return res.status(500 /* InternalServerError */).json({ error: err.message });
};

// src/server.ts
var import_express2 = __toESM(require("express"));

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  PORT: import_zod.z.coerce.number().default(3333),
  JWT_SECRET: import_zod.z.string()
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid environment variables.", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/middlewares/cors-middleware.ts
function corsMiddleware(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  res.header("Access-Control-Max-Age", "86400");
  next();
}

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

// src/http/inventory/fetch-inventory.ts
var fetchInventory = async (req, res, next) => {
  try {
    const { search } = req.query;
    const data = await prisma_default.inventory.findMany({
      ...search && {
        where: {
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
      where: {
        deletedAt: { equals: null }
      },
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
    return res.json({ inventory }).status(200 /* Success */);
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};

// src/routes/routes.ts
var import_express = require("express");

// src/http/inventory/action-inventoy.ts
var import_zod2 = require("zod");
var createActionInventory = async (req, res, next) => {
  try {
    const { id: inventoryId } = req.params;
    const userId = req.userState.sub;
    const createActionInventoryBodySchema = import_zod2.z.object({
      type: import_zod2.z.enum(["input", "output"]),
      quantity: import_zod2.z.number(),
      customerName: import_zod2.z.string().optional(),
      customerPaymentType: import_zod2.z.enum(["pix", "cash", "credit-card", "deb"]).optional()
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

// src/errors/invalid-credentials-error.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid credentials.");
  }
};

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
      throw new InvalidCredentialsError();
    }
    const passwordMatch = await (0, import_bcryptjs.compare)(password, user.passwordHash);
    if (!passwordMatch) {
      throw new InvalidCredentialsError();
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
    const error = new InternalServerError();
    return next(err != null ? err : error);
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
      throw new EmailAlreadyExistsError();
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
    next(err);
    throw new InternalServerError();
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
    next(err);
    throw new InternalServerError();
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
    next(err);
    throw new InternalServerError();
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
    next(err);
    throw new InternalServerError();
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

// src/errors/product-already-exists-error.ts
var ProductAlreadyExistsError = class extends Error {
  constructor() {
    super("Product already exists.");
  }
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
    next(err);
    throw new InternalServerError();
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
    console.log(err);
    return res.json({ message: "Algo aconteceu de errado." }).status(500);
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
    await prisma_default.inventory.create({
      data: {
        lot,
        price,
        quantity,
        validity: new Date(validity),
        product: { connect: { id: productId } },
        createdBy: { connect: { id: userId } }
      }
    });
    return res.json({ message: "Estoque criado com sucesso." }).status(201);
  } catch (err) {
    next(err);
    throw new InternalServerError();
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
    next(err);
    throw new InternalServerError();
  }
};

// src/http/products/fetch-products.ts
var fetchProducts = async (req, res, next) => {
  try {
    const { search } = req.query;
    const products = await prisma_default.product.findMany({
      ...search && {
        where: {
          OR: [
            { name: { contains: search.toString(), mode: "insensitive" } },
            { code: { contains: search.toString(), mode: "insensitive" } },
            { sigla: { contains: search.toString(), mode: "insensitive" } }
          ]
        }
      },
      where: {
        deletedAt: { equals: null }
      },
      select: {
        id: true,
        name: true,
        code: true,
        sigla: true
      }
    });
    return res.json({ products }).status(200 /* Success */);
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};

// src/http/users/fetch-users.ts
var fetchUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const users = await prisma_default.user.findMany({
      ...search && {
        where: {
          OR: [
            { name: { contains: search.toString(), mode: "insensitive" } },
            { email: { contains: search.toString(), mode: "insensitive" } }
          ]
        }
      },
      where: {
        deletedAt: { equals: null }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: false
      }
    });
    return res.json({ users }).status(200 /* Success */);
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};

// src/http/inventory/delete-inventory.ts
var deleteInventory = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    await prisma_default.inventory.update({
      where: {
        id: productId
      },
      data: {
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    return res.json({ message: "Estoque deletado com sucesso." }).status(200 /* Success */);
  } catch (err) {
    console.log(err);
    next(err);
    throw new InternalServerError();
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

// src/server.ts
var app = (0, import_express2.default)();
app.use(import_express2.default.json());
app.use(corsMiddleware);
app.use(router);
app.use(errorMiddleware);
app.listen(
  env.PORT,
  () => console.log(`Servidor rodando na porta ${env.PORT}!!!`)
);
