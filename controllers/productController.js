import Product from "../models/productModel.js";
import SubCategory from '../models/subCategoryModel.js'
import fs from "fs";
import path from "path";

// ✅ Create Product with Multiple Images
// export const createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       productCode,
//       costPrice,
//       price,
//       mrp,
//       maxDiscount,
//       category,
//       subCategory,
//       stock,
//       batchNumber,
//       barcode,
//       manufacturingDate,
//       expiryDate,
//       isTaxable,
//       cgst,
//       sgst,
//       igst,
//       shippingCost,
//       freeShipping
//     } = req.body;

//     // console.log("body is =========>", req.body);

//     // Defensive image processing
//     const images = req.files && req.files.length > 0
//       ? req.files.map(file => ({ url: `/${file.filename}` }))
//       : [];

//     // Create new product
//     const product = new Product({
//       name,
//       description,
//       productCode,
//       costPrice,
//       price,
//       mrp,
//       maxDiscount,
//       category,
//       subCategory,
//       stock,
//       batchNumber,
//       barcode,
//       manufacturingDate,
//       expiryDate,
//       isTaxable: isTaxable === "true" || isTaxable === true,
//       cgst,
//       sgst,
//       igst,
//       images,
//       shipping: {
//         cost: parseFloat(shippingCost) || 0,
//         isFreeShipping: freeShipping === "true" || freeShipping === true
//       }
//     });
//     const existing = await Product.findOne({ $or: [{ barcode }, { productCode }] });
//     if (existing) {
//       return res.status(400).json({
//         message: `🚫 Product with the same barcode or product code already exists.`,
//       });
//     }

//     await product.save();

//     res.status(201).json({
//       message: "✅ Product created successfully",
//       product,
//     });

//   } catch (error) {
//     console.error("❌ Product creation error:", error);
//     res.status(500).json({
//       message: "Server error while creating product",
//       error: error.message,
//     });
//   }
// };


export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      productCode,
      costPrice,
      price,
      mrp,
      maxDiscount,
      category,
      subCategory,
      stock,
      batchNumber,
      barcode,
      manufacturingDate,
      expiryDate,
      isTaxable,
      cgst,
      sgst,
      igst,
      shippingCost,
      freeShipping
    } = req.body;

    // ✅ Check for duplicate barcode or productCode before creating product
    const existing = await Product.findOne({
      $or: [{ barcode }, { productCode }]
    });

    if (existing) {
      return res.status(400).json({
        message: `🚫 Product with the same barcode or product code already exists.`,
      });
    }

    // ✅ Defensive image handling
    const images = req.files && req.files.length > 0
      ? req.files.map(file => ({ url: `/${file.filename}` }))
      : [];

    // ✅ Create product only after duplicate check
    const product = new Product({
      name,
      description,
      productCode,
      costPrice,
      price,
      mrp,
      maxDiscount,
      category,
      subCategory,
      stock,
      batchNumber,
      barcode,
      manufacturingDate,
      expiryDate,
      isTaxable: isTaxable === "true" || isTaxable === true,
      cgst,
      sgst,
      igst,
      images,
      shipping: {
        cost: parseFloat(shippingCost) || 0,
        isFreeShipping: freeShipping === "true" || freeShipping === true
      }
    });

    await product.save();

    res.status(201).json({
      message: "✅ Product created successfully",
      product,
    });

  } catch (error) {
    console.error("❌ Product creation error:", error);

    // Handle MongoDB duplicate key error as fallback
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `🚫 Duplicate value for ${field}. It must be unique.`,
      });
    }

    res.status(500).json({
      message: "Server error while creating product",
      error: error.message,
    });
  }
};




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

export const updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body; // Get new stock from request body
    const { id } = req.params;  // Get product ID from request parameters



    // Find and update stock
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { stock: stock } }, // Update only stock field
      { new: true, runValidators: true } // Return updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Stock updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

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
//     let updatedImages = [];

//     if (req.files && req.files.length > 0) {
//       // Delete old images from server if not retained
//       if (!oldImgPath || oldImgPath.length === 0) {
//         product.images.forEach((img) => {
//           if (img.url && img.url.includes('/uploads/')) {
//             const filePath = path.join('uploads', img.url.split('/uploads/')[1]);
//             if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Delete old images
//           } else {
//             console.warn('Invalid image URL:', img.url);
//           }
//         });
//       }

//       // Add new images to updatedImages array
//       updatedImages = req.files.map((file) => ({ url: `/${file.filename}` }));
//     }

//     // Retain previous images if `oldImgPath` is provided
//     if (oldImgPath) {
//       const oldImages = Array.isArray(oldImgPath) ? oldImgPath : [oldImgPath]; // Ensure it's an array
//       updatedImages = [...oldImages.map((fileName) => ({ url: fileName })), ...updatedImages];
//     }

//     // Assign updated images
//     product.images = updatedImages;

//     await product.save();

//     console.log("Updated product data:", product);
//     res.status(200).json({ message: 'Product updated successfully', product });

//   } catch (error) {
//     console.error('Error updating product:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

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


// import fs from "fs";
// import path from "path";
// import Product from "../models/Product.js";

// export const updateProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       productCode,
//       costPrice,
//       price,
//       mrp,
//       maxDiscount,
//       category,
//       subCategory,
//       stock,
//       batchNumber,
//       barcode,
//       manufacturingDate,
//       expiryDate,
//       isTaxable,
//       cgst,
//       sgst,
//       igst,
//       shippingCost,
//       freeShipping,
//       oldImgPath, // this should be an array of image URLs from frontend
//     } = req.body;


//     console.log("update product is =======>", req.body)
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     // ✅ Check for duplicate barcode or productCode (excluding current product)
//     const existing = await Product.findOne({
//       _id: { $ne: req.params.id },
//       $or: [{ barcode }, { productCode }]
//     });

//     if (existing) {
//       return res.status(400).json({
//         message: "🚫 Barcode or Product Code already exists for another product.",
//       });
//     }

//     // Update all fields
//     product.name = name || product.name;
//     product.description = description || product.description;
//     product.productCode = productCode || product.productCode;
//     product.costPrice = costPrice || product.costPrice;
//     product.price = price || product.price;
//     product.mrp = mrp || product.mrp;
//     product.maxDiscount = maxDiscount || product.maxDiscount;
//     product.category = category || product.category;
//     product.subCategory = subCategory || product.subCategory;
//     product.stock = stock || product.stock;
//     product.batchNumber = batchNumber || product.batchNumber;
//     product.barcode = barcode || product.barcode;
//     product.manufacturingDate = manufacturingDate || product.manufacturingDate;
//     product.expiryDate = expiryDate || product.expiryDate;
//     product.isTaxable = isTaxable === "true" || isTaxable === true;
//     product.cgst = cgst || product.cgst;
//     product.sgst = sgst || product.sgst;
//     product.igst = igst || product.igst;

//     // product.shipping = {
//     //   cost: shippingCost ?? product.shipping?.cost ?? 0,
//     //   isFreeShipping: freeShipping === "true" || freeShipping === true
//     //     ? freeShipping === true
//     //     : freeShipping === false || freeShipping === "false",
//     // };

//     product.shipping = {
//       cost: Number(shippingCost ?? product.shipping?.cost ?? 0),
//       isFreeShipping:
//         freeShipping === "true" || freeShipping === true
//           ? true
//           : freeShipping === "false" || freeShipping === false
//             ? false
//             : product.shipping?.isFreeShipping ?? false,
//     };

//     // Handle images
//     let updatedImages = [];

//     // If new files are uploaded
//     if (req.files && req.files.length > 0) {
//       // Delete all old images if oldImgPath not provided
//       if (!oldImgPath || oldImgPath.length === 0) {
//         product.images.forEach((img) => {
//           const filename = img.url?.replace("/", "");
//           const filePath = path.join("uploads", filename);
//           if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//         });
//       }

//       // Add new images
//       updatedImages = req.files.map((file) => ({ url: `/${file.filename}` }));
//     }

//     // If some old images are retained
//     if (oldImgPath) {
//       const oldImages = Array.isArray(oldImgPath) ? oldImgPath : [oldImgPath];
//       updatedImages = [
//         ...oldImages.map((url) => ({ url })),
//         ...updatedImages,
//       ];
//     }

//     // Final image assignment
//     product.images = updatedImages.length > 0 ? updatedImages : product.images;

//     await product.save();

//     res.status(200).json({
//       message: "✅ Product updated successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("❌ Product update error:", error);
//     res.status(500).json({
//       message: "Server error while updating product",
//       error: error.message,
//     });
//   }
// };



export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      productCode,
      costPrice,
      price,
      mrp,
      maxDiscount,
      category,
      subCategory,
      stock,
      batchNumber,
      barcode,
      manufacturingDate,
      expiryDate,
      isTaxable,
      cgst,
      sgst,
      igst,
      shippingCost,
      freeShipping,
      oldImgPath,
    } = req.body;

    // console.log("body is =============>", req.body)

    const errors = [];

    // Validate required fields
    if (!name) errors.push("Product name is required.");
    if (!productCode) errors.push("Product code is required.");
    if (!price || isNaN(price)) errors.push("Valid price is required.");
    if (!barcode) errors.push("Barcode is required.");

    if (errors.length > 0) return res.status(400).json({ errors });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ errors: ["Product not found."] });

    // Check for duplicate barcode/productCode
    const existing = await Product.findOne({
      _id: { $ne: req.params.id },
      $or: [{ barcode }, { productCode }],
    });

    if (existing) {
      if (existing.barcode === barcode) errors.push("🚫 Barcode already exists.");
      if (existing.productCode === productCode) errors.push("🚫 Product Code already exists.");
      return res.status(400).json({ errors });
    }

    // Update basic fields
    Object.assign(product, {
      name,
      description,
      productCode,
      costPrice,
      price,
      mrp,
      maxDiscount,
      category,
      subCategory,
      stock,
      batchNumber,
      barcode,
      manufacturingDate,
      expiryDate,
      isTaxable: isTaxable === "true" || isTaxable === true,
      cgst: parseFloat(cgst) || 0,
      sgst: parseFloat(sgst) || 0,
      igst: parseFloat(igst) || 0,
      shipping: {
        cost: parseFloat(shippingCost) || 0,
        isFreeShipping: freeShipping === "true" || freeShipping === true
      },
    });

    // Handle images
    let updatedImages = [];

    if (req.files?.length) {
      // Delete all previous images if no oldImgPath provided
      if (!oldImgPath?.length) {
        product.images.forEach((img) => {
          const filePath = path.join("uploads", img.url?.replace("/", ""));
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      }

      updatedImages = req.files.map((file) => ({ url: `/${file.filename}` }));
    }

    // Retain old images
    const retainedImages = Array.isArray(oldImgPath)
      ? oldImgPath.map((url) => ({ url }))
      : oldImgPath ? [{ url: oldImgPath }] : [];

    product.images = [...retainedImages, ...updatedImages];

    await product.save();

    res.status(200).json({
      message: "✅ Product updated successfully",
      product,
    });

  } catch (error) {
    console.error("❌ Update Error:", error);
    const errors = [];

    if (error.name === "ValidationError") {
      for (let key in error.errors) {
        errors.push(error.errors[key].message);
      }
    } else if (error.code === 11000) {
      errors.push("Duplicate field value entered.");
    } else {
      errors.push(error.message || "Something went wrong.");
    }

    res.status(500).json({ errors });
  }
};



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




export const getProductByCode = async (req, res) => {
  try {
    const { productCode } = req.params;

    if (!productCode) {
      return res.status(400).json({ message: "❌ Product code is required." });
    }

    const product = await Product.findOne({ productCode });

    if (!product) {
      return res.status(404).json({ message: "🚫 No product found with the given code." });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("❌ Error fetching product by code:", error.message);
    res.status(500).json({ message: "Server error while fetching product." });
  }
};
