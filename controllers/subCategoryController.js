// import SubCategory from '../models/subCategoryModel.js';
// import slugify from 'slugify';

// export const createSubCategory = async (req, res) => {
//     try {
//         const { name } = req.body;


//         // Validate input
//         if (!name) {
//             return res.status(400).json({ error: 'Name  required' });
//         }

//         // Generate slug
//         const slug = slugify(name, { lower: true });

//         // Check if category already exists
//         const existingCategory = await SubCategory.findOne({ name });
//         if (existingCategory) {
//             return res.status(400).json({ error: 'Sub Category already exists' });
//         }

//         // Create new category
//         const newCategory = await SubCategory.create({
//             name,
//             slug,
//         });

//         res.status(201).json({
//             message: 'Sub Category created successfully',
//             category: newCategory,
//         });

//     } catch (err) {
//         console.error('Error creating category:', err);
//         res.status(500).json({ error: 'Failed to create category' });
//     }
// };


// // Get all subcategories
// export const getAllSubCategories = async (req, res) => {
//     try {
//         const subCategories = await SubCategory.find();
//         res.status(200).json(subCategories);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
//     }
// };

// // Get a single subcategory by ID
// export const getSingleSubCategory = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const subCategory = await SubCategory.findById(id);
//         if (!subCategory) {
//             return res.status(404).json({ message: 'SubCategory not found' });
//         }

//         res.status(200).json(subCategory);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching subcategory', error: error.message });
//     }
// };

// // Update a subcategory by ID
// export const updateSubCategory = async (req, res) => {
//     const { id } = req.params;
//     const { name } = req.body;

//     if (!name) {
//         return res.status(400).json({ error: 'Name  required' });
//     }

//     // Generate slug
//     const slug = slugify(name, { lower: true });

//     try {
//         const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, { name, slug }, { new: true });

//         if (!updatedSubCategory) {
//             return res.status(404).json({ message: 'SubCategory not found' });
//         }

//         res.status(200).json(updatedSubCategory);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating subcategory', error: error.message });
//     }
// };

// // Delete a subcategory by ID
// export const deleteSubCategory = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

//         if (!deletedSubCategory) {
//             return res.status(404).json({ message: 'SubCategory not found' });
//         }

//         res.status(200).json({ message: 'SubCategory deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
//     }
// };


import SubCategory from '../models/subCategoryModel.js';
import slugify from 'slugify';

// Create a new subcategory
export const createSubCategory = async (req, res) => {
    try {
        const { name, category } = req.body;

        console.log("body is =>", req.body)

        // Validate input
        if (!name || !category) {
            return res.status(400).json({ error: 'Name and category are required' });
        }

        // Generate slug
        const slug = slugify(name, { lower: true });

        // Check if subcategory already exists
        const existingSubCategory = await SubCategory.findOne({ name, category });
        if (existingSubCategory) {
            return res.status(400).json({ error: 'Subcategory already exists for this category' });
        }

        // Create new subcategory
        const newSubCategory = await SubCategory.create({
            name,
            slug,
            category,
        });

        res.status(201).json({
            message: 'Subcategory created successfully',
            subCategory: newSubCategory,
        });

    } catch (err) {
        console.error('Error creating subcategory:', err);
        res.status(500).json({ error: 'Failed to create subcategory' });
    }
};

// Get all subcategories
export const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate('category', 'name');
        res.status(200).json(subCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
    }
};

// Get a single subcategory by ID
export const getSingleSubCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const subCategory = await SubCategory.findById(id).populate('category', 'name');
        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.status(200).json(subCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching subcategory', error: error.message });
    }
};

// Update a subcategory by ID
export const updateSubCategory = async (req, res) => {
    const { id } = req.params;
    const { name, category } = req.body;

    // Validate input
    if (!name || !category) {
        return res.status(400).json({ error: 'Name and category are required' });
    }

    // Generate slug
    const slug = slugify(name, { lower: true });

    try {
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            id,
            { name, slug, category },
            { new: true }
        );

        if (!updatedSubCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.status(200).json(updatedSubCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating subcategory', error: error.message });
    }
};

// Delete a subcategory by ID
export const deleteSubCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

        if (!deletedSubCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
    }
};