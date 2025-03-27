// import express from 'express';




// const router = express.Router();


// // POST /api/create
// router.get("/sub-category-list", SubCategoryList);
// router.post("/create-sub-category", createSubCategory);
// // Update an existing category
// router.put('/update-sub-category/:id', updateSubCategory);
// // Delete a category
// router.delete('/remove-sub-category/:id', deleteSubCategory)

// export default router;

import express from 'express';
import {
    createSubCategory,
    getAllSubCategories,
    getSingleSubCategory,
    updateSubCategory,
    deleteSubCategory
} from '../controllers/subCategoryController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'

const router = express.Router();

// Create a new subcategory
router.post('/', createSubCategory);

// Get all subcategories
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllSubCategories);

// Get a single subcategory by ID
router.get('/:id', authMiddleware, roleMiddleware(['admin']), getSingleSubCategory);

// Update a subcategory by ID
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateSubCategory);

// Delete a subcategory by ID
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteSubCategory);


// // Create a new subcategory
// router.post('/', createSubCategory);

// // Get all subcategories
// router.get('/', getAllSubCategories);

// // Get a single subcategory by ID
// router.get('/:id', getSingleSubCategory);

// // Update a subcategory by ID
// router.put('/:id', updateSubCategory);

// // Delete a subcategory by ID
// router.delete('/:id', deleteSubCategory);

export default router;
