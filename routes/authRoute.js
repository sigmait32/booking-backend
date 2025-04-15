import express from 'express';
import { register, login, logout, changePassword, updateCustomerPassword, getEmployeeList, getEmployeeById, deleteEmployee, updateEmployee } from '../controllers/authControllers.js'
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
router.post("/register", authMiddleware, roleMiddleware(['admin']), register);

router.post("/login", login);
router.post("/change-password", authMiddleware, roleMiddleware(['admin']), changePassword);
router.post("/update-customer-password", authMiddleware, roleMiddleware(['admin']), updateCustomerPassword);
router.get("/logout", logout);
router.get("/employee-list", authMiddleware, roleMiddleware(['admin']), getEmployeeList);
router.get("/employee/:id", authMiddleware, roleMiddleware(['admin']), getEmployeeById);
router.put('/employee/update/:id', authMiddleware, roleMiddleware(['admin']), updateEmployee);
router.delete('/remove-employee/:id', authMiddleware, roleMiddleware(['admin']), deleteEmployee);


export default router;
