import express from "express";
import { addToCart, getCart, updateMultipleCartItems, removeCartItem, clearCart, addMultipleProductsToCart } from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-single-product", authMiddleware, addToCart);       // Add product to cart
router.post("/add", authMiddleware, addMultipleProductsToCart);
router.get("/", authMiddleware, getCart);            // Get all cart items
// router.put("/update", authMiddleware, updateCartItem); // Update quantity of cart item
router.put("/update", authMiddleware, updateMultipleCartItems);
router.delete("/remove", authMiddleware, removeCartItem); // Remove a single product from cart
router.delete("/clear", authMiddleware, clearCart);   // Clear the entire cart

export default router;
