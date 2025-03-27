import Product from "../models/productModel.js";
import SubCategory from '../models/subCategoryModel.js'
import fs from "fs";
import path from "path";

// ✅ Create Product with Multiple Images
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, subCategory } = req.body;
    // console.log("request is =====>",req.body)
    // console.log("image is =====>",req.files)

    const images = req.files.map(file => ({ url: `/${file.filename}` }));

    const product = new Product({ name, description, price, stock, category, subCategory, images });
    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get All Products
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate("category subCategory");
//     console.log("poduct is =====>",products)
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("subCategory");

    // console.log("Products after population:", products);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Single Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category subCategory");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getSubCategoryByCatId = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ category: req.params.id });
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update Product (with optional new images)
// export const updateProduct = async (req, res) => {
//   try {
//     const { name, description, price, stock, category, subCategory } = req.body;
//     console.log("request is =====>",req.body)
//     console.log("image is =====>",req.files)

//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     product.name = name || product.name;
//     product.description = description || product.description;
//     product.price = price || product.price;
//     product.stock = stock || product.stock;
//     product.category = category || product.category;
//     product.subCategory = subCategory || product.subCategory;

//     // If new images are uploaded, replace old images
//     if (req.files.length > 0) {
//       product.images.forEach(img => {
//         const filePath = path.join("uploads", img.url.split("/uploads/")[1]);
//         if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Delete old images
//       });

//       product.images = req.files.map(file => ({ url: `/uploads/${file.filename}` }));
//     }

//     await product.save();
//     res.status(200).json({ message: "Product updated successfully", product });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };



// export const updateProduct = async (req, res) => {
//   try {
//     const { name, description, price, stock, category, subCategory, oldImgPath } = req.body;
//     console.log('Request body:', req.body);
//     console.log('Uploaded files:', req.files);

//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     // Update product fields
//     product.name = name || product.name;
//     product.description = description || product.description;
//     product.price = price || product.price;
//     product.stock = stock || product.stock;
//     product.category = category || product.category;
//     product.subCategory = subCategory || product.subCategory;

//     // If new images are uploaded, replace old images
//     if (req.files && req.files.length > 0) {
//       // Delete old images
//       product.images.forEach((img) => {
//         if (img.url && img.url.includes('/uploads/')) {
//           const filePath = path.join('uploads', img.url.split('/uploads/')[1]);
//           if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Delete old images
//         } else {
//           console.warn('Invalid image URL:', img.url);
//         }
//       });

//       // Add new images
//       product.images = req.files.map((file) => ({ url: `/${file.filename}` }));
//       // Add new images
//       product.images += req.body.oldImgPath.map((fileName) => ({ url: fileName }));


//     }
//     console.log("product data is ====>", product)

//     // await product.save();
//     res.status(200).json({ message: 'Product updated successfully', product });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, subCategory, oldImgPath } = req.body;
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;

    // If new images are uploaded, replace old images
    let updatedImages = [];

    if (req.files && req.files.length > 0) {
      // Delete old images from server if not retained
      if (!oldImgPath || oldImgPath.length === 0) {
        product.images.forEach((img) => {
          if (img.url && img.url.includes('/uploads/')) {
            const filePath = path.join('uploads', img.url.split('/uploads/')[1]);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Delete old images
          } else {
            console.warn('Invalid image URL:', img.url);
          }
        });
      }

      // Add new images to updatedImages array
      updatedImages = req.files.map((file) => ({ url: `/${file.filename}` }));
    }

    // Retain previous images if `oldImgPath` is provided
    if (oldImgPath) {
      const oldImages = Array.isArray(oldImgPath) ? oldImgPath : [oldImgPath]; // Ensure it's an array
      updatedImages = [...oldImages.map((fileName) => ({ url: fileName })), ...updatedImages];
    }

    // Assign updated images
    product.images = updatedImages;

    await product.save();

    console.log("Updated product data:", product);
    res.status(200).json({ message: 'Product updated successfully', product });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// ✅ Delete Product (and remove images)
// ✅ Delete Product (and remove images)
// export const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     console.log("product is ========>", req.params.id)
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     // Delete images from server
//     product.images.forEach(img => {
//       const filePath = path.join("uploads", img.url.split("/uploads/")[1]);
//       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//     });

//     await Product.deleteOne({ _id: req.params.id });

//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.log("error is ====>", error)
//     res.status(500).json({ message: "Server error", error });
//   }
// };



export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log("Product to delete:", product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from server
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img?.url && img.url.includes("/uploads/")) {
          const filePath = path.join("uploads", img.url.split("/uploads/")[1]);

          // Check if filePath is valid before deleting
          if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          } else {
            console.warn("Invalid or non-existent file path:", filePath);
          }
        } else {
          console.warn("Invalid image URL format:", img?.url);
        }
      });
    } else {
      console.warn("No images found for product:", product._id);
    }

    // Delete product from the database
    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
