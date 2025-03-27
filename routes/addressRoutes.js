import express from 'express';
import {
    createAddress,
    getUserAddresses,
    getSingleAddress,
    updateAddress,
    deleteAddress
} from '../controllers/addressController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Create a new address (User must be logged in)
router.post('/', authMiddleware, createAddress);

// ✅ Get all addresses of a user
router.get('/', authMiddleware, getUserAddresses);

// ✅ Get a single address by ID
router.get('/:id', authMiddleware, getSingleAddress);

// ✅ Update an address
router.put('/:id', authMiddleware, updateAddress);

// ✅ Delete an address
router.delete('/:id', authMiddleware, deleteAddress);

export default router;
