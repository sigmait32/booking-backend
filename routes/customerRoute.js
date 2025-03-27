import express from 'express';
import { createCustomer, customerList, updateCustomer, deleteCustomer, getCustomerById } from '../controllers/customerController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';



const router = express.Router();


// POST /api/create
router.get("/list", authMiddleware, roleMiddleware(['admin', 'employee']), customerList);
router.get("/:id", authMiddleware, roleMiddleware(['admin', "employee"]), getCustomerById);
router.post("/create", authMiddleware, roleMiddleware(['admin', "employee"]), createCustomer);
// Update an existing category
router.put('/update/:id', authMiddleware, roleMiddleware(['admin', 'employee']), updateCustomer);
// Delete a category
router.delete('/remove/:id', authMiddleware, roleMiddleware(['admin']), deleteCustomer);

export default router;