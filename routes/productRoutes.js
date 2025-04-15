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
import { createProduct, updateProduct, deleteProduct, getProducts, getProductById, getSubCategoryByCatId, updateProductStock, getProductByCode } from "../controllers/productController.js";

import upload from '../utiles/multer.js';

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";


const router = express.Router();

// 🟢 Create Product with Multiple Images
router.post("/", authMiddleware, roleMiddleware(["admin"]), upload.array("images", 5), createProduct);

// 🟢 Get All Products
router.get("/", getProducts);

// 🟢 Get Single Product by ID
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), getProductById);
// router.get("/product-by-product-code/:code", authMiddleware, roleMiddleware(["admin", "employee"]), getProductByCode);
router.get("/code/:productCode", authMiddleware, roleMiddleware(["admin", "employee"]), getProductByCode);
router.get("/sub-category/:id", getSubCategoryByCatId);

// 🟢 Update Product (with optional new images)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), upload.array("images", 5), updateProduct);
router.patch("/update-stock/:id", updateProductStock);

// 🔴 Delete Product (and remove images)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteProduct);

export default router;
