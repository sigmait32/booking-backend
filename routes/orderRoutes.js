import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from "../controllers/orderController.js";

// import {createOrder} from "../controllers/orderController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"; // For authentication
import { roleMiddleware } from "../middlewares/roleMiddleware.js"; // For admin check

const router = express.Router();

// ✅ Create Order (User must be authenticated)
router.post("/create", authMiddleware, createOrder);

// ✅ Get All Orders (Admin Only)
router.get("/list", authMiddleware, roleMiddleware(["admin"]), getAllOrders);

// ✅ Get Single Order (Admin & User)
router.get("/:id", authMiddleware, getOrderById);

// ✅ Update Order Status (Admin Only)
router.patch("/update/:id", authMiddleware, roleMiddleware(["admin"]), updateOrderStatus);

// ❌ Delete Order (Admin Only)
router.delete("/delete/:id", authMiddleware, roleMiddleware(["admin"]), deleteOrder);

export default router;
