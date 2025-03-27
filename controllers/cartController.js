import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

/** 
 * 📌 Add to Cart
 */
export const addToCart = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        const existingProduct = cart.products.find((p) => p.product.toString() === product);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product, quantity });
        }

        await cart.save();
        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const addMultipleProductsToCart = async (req, res) => {
    try {
        const { products } = req.body;
        const userId = req.user.id;

        // Validate request data
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products array is required" });
        }

        for (let item of products) {
            if (!item.product || !item.quantity) {
                return res.status(400).json({ message: "Each product must have a product ID and quantity" });
            }
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        products.forEach(({ product, quantity }) => {
            const existingProduct = cart.products.find((p) => p.product.toString() === product);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product, quantity });
            }
        });

        await cart.save();
        res.status(200).json({ message: "Products added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/** 
 * 📌 Get Cart Items
 */
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
        if (!cart) return res.status(404).json({ message: "Cart is empty" });

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/** 
 * 📌 Update Cart Item Quantity
 */


// export const updateCart = async (req, res) => {
//     try {
//         const { productId, quantity } = req.body;
//         const userId = req.user.id;

//         if (!productId || quantity === undefined) {
//             return res.status(400).json({ message: "Product ID and quantity are required" });
//         }

//         let cart = await Cart.findOne({ user: userId });
//         if (!cart) {
//             return res.status(404).json({ message: "Cart not found" });
//         }

//         let productExists = false;

//         cart.products = cart.products.map((item) => {
//             if (item.product.toString() === productId) {
//                 productExists = true;
//                 return { ...item, quantity };
//             }
//             return item;
//         });

//         if (!productExists) {
//             return res.status(404).json({ message: "Product not found in cart" });
//         }

//         await cart.save();

//         res.status(200).json({ message: "Cart updated successfully", cart });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };

export const updateMultipleCartItems = async (req, res) => {
    try {
        const { products } = req.body;
        const userId = req.user.id;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products array is required" });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Loop through provided products and update quantities
        products.forEach(({ productId, quantity }) => {
            const itemIndex = cart.products.findIndex((item) => item.product.toString() === productId);
            if (itemIndex !== -1) {
                cart.products[itemIndex].quantity = quantity;
            }
        });

        await cart.save();

        res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Filter out the product from the cart
        const updatedProducts = cart.products.filter((p) => p.product.toString() !== productId);

        if (cart.products.length === updatedProducts.length) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        cart.products = updatedProducts;
        await cart.save();

        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/** 
 * 📌 Clear Cart
 */
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        await Cart.findOneAndDelete({ user: userId });

        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
