import express from "express";
import {

    createSaleEntry,
    getAllSaleEntries,
    getSaleEntryById,
    updateSaleEntry,
    deleteSaleEntry
} from "../controllers/saleEntryContrller.js";

// import {createOrder} from "../controllers/orderController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"; // For authentication
import { roleMiddleware } from "../middlewares/roleMiddleware.js"; // For admin check

const router = express.Router();


router.post("/", createSaleEntry);
router.get("/", getAllSaleEntries);
router.get("/:id", getSaleEntryById);
router.put("/:id", updateSaleEntry);
router.delete("/:id", deleteSaleEntry);

// ✅ Get All Orders (Admin Only)

export default router;
