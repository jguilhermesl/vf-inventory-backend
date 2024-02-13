import { login } from "@/http/auth/login";
import { createUser } from "@/http/users/create-user";
import { deleteUser } from "@/http/users/delete-user";
import { editUser } from "@/http/users/edit-user";
import { getUserProfile } from "@/http/users/get-user";
import { isAuthenticated } from "@/middlewares/auth-middleware";
import { Router } from "express";
import { createProduct } from "@/http/products/create-product";
import { deleteProduct } from "@/http/products/delete-product";
import { editProduct } from "@/http/products/edit-product";
import { getProductProfile } from "@/http/products/get-product";
import { createInventory } from "@/http/inventory/create-intentory";
import { editInventory } from "@/http/inventory/edit-inventory";
import { getInventoryProfile } from "@/http/inventory/get-inventory";
import { getAllInventoryItems } from "@/http/inventory/get-allInventory";
import { deleteInventory } from "@/http/inventory/delete-inventory";

const router = Router();

router.post("/users/signin", login);
router.post("/users", createUser);
router.delete("/users/:id", isAuthenticated, deleteUser);
router.put("/users/:id", isAuthenticated, editUser);
router.get("/users/:id", isAuthenticated, getUserProfile);
router.post("/products", createProduct);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", editProduct);
router.get("/products/:id", getProductProfile);
router.post("/inventory", createInventory);
router.put("/inventory/:id", editInventory);
router.get("/inventory/:id", getInventoryProfile);
router.get("/inventory", getAllInventoryItems);
router.delete("/inventory/:id", deleteInventory);

export { router };
