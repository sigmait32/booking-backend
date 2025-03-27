// import express from "express";
// import {
//     createProduct,
//     getAllProducts,
//     getProductById,
//     updateProduct,
//     deleteProduct,
// } from "../controllers/productController.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";
// import { roleMiddleware } from "../middlewares/roleMiddleware.js";

// const router = express.Router();

// // ✅ Only Admin can create a product
// router.post("/", authMiddleware, roleMiddleware(["admin"]), createProduct);

// // ✅ Everyone can view products
// router.get("/", getAllProducts);

// // ✅ Everyone can view a single product
// router.get("/:id", getProductById);

// // ✅ Only Admin can update a product
// router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateProduct);

// // ✅ Only Admin can delete a product
// router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteProduct);

// export default router;

import express from "express";
import { createProduct, updateProduct, deleteProduct, getProducts, getProductById, getSubCategoryByCatId } from "../controllers/productController.js";

import upload from '../utiles/multer.js';

const router = express.Router();

// 🟢 Create Product with Multiple Images
router.post("/", upload.array("images", 5), createProduct);

// 🟢 Get All Products
router.get("/", getProducts);

// 🟢 Get Single Product by ID
router.get("/:id", getProductById);
router.get("/sub-category/:id", getSubCategoryByCatId);

// 🟢 Update Product (with optional new images)
router.put("/:id", upload.array("images", 5), updateProduct);

// 🔴 Delete Product (and remove images)
router.delete("/:id", deleteProduct);

export default router;
