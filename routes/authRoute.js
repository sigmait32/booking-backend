import express from 'express';
import { register, login, logout, changePassword, updateCustomerPassword } from '../controllers/authControllers.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// GET /api/
router.get("/", (req, res) => {
    res.json({
        message: "This is the category route."
    });
});

// POST /api/create
router.post("/register", register);
router.post("/login", login);
router.post("/change-password", changePassword);
router.post("/update-customer-password", authMiddleware, roleMiddleware(['admin']), updateCustomerPassword);
router.get("/logout", logout);


export default router;
