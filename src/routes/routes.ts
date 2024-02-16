import { fetchInventory } from './../http/inventory/fetch-inventory';
import { Router } from "express";

import { createActionInventory } from '@/http/inventory/action-inventoy';
import { login } from "@/http/auth/login";
import { createUser } from "@/http/users/create-user";
import { deleteUser } from "@/http/users/delete-user";
import { editUser } from "@/http/users/edit-user";
import { getUserProfile } from "@/http/users/get-user";
import { isAuthenticated } from "@/middlewares/auth-middleware";
import { createProduct } from "@/http/products/create-product";
import { deleteProduct } from "@/http/products/delete-product";
import { editProduct } from "@/http/products/edit-product";
import { editInventory } from "@/http/inventory/edit-inventory";
import { createInventory } from '@/http/inventory/create-inventory';
import { getProduct } from "@/http/products/get-product";
import { fetchProducts } from "@/http/products/fetch-products";

const router = Router();

// Users 
router.post("/users/signin", login);
router.post("/users", createUser);
router.delete("/users/:id", isAuthenticated, deleteUser);
router.put("/users/:id", isAuthenticated, editUser);
router.get("/me", isAuthenticated, getUserProfile);

// Products
router.post("/products", isAuthenticated, createProduct);
router.delete("/products/:id", isAuthenticated, deleteProduct);
router.put("/products/:id", isAuthenticated, editProduct);
router.get("/products/:id", isAuthenticated, getProduct);
router.get("/products", isAuthenticated, fetchProducts);

// Inventory
router.post("/inventory", isAuthenticated, createInventory);
router.put("/inventory/:id", isAuthenticated, editInventory);
router.post("/inventory/action/:id", isAuthenticated, createActionInventory);
router.get("/inventory", isAuthenticated, fetchInventory);

export { router };
