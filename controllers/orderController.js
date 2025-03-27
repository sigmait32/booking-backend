import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

import crypto from "crypto";
import moment from "moment";


// ✅ Create Order
// export const createOrder = async (req, res) => {
//   try {



//     const { products, totalPrice, address } = req.body;

//     const userId = req.user.id;
//     req.body.items.map((rec) => {
//       console.log("item is ========>", rec)
//     })

//     console.log("product page userId id ========>", userId)

//     if (!products || products.length === 0) {
//       return res.status(400).json({ message: "Order must contain at least one product" });
//     }

//     // Create new order
//     // const order = new Order({ user: userId, products, totalPrice, address });
//     // await order.save();

//     res.status(201).json({ message: "Order created successfully", order });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };


// export const createOrder = async (req, res) => {
//   try {
//     const { items, address, paymentMethod } = req.body;
//     const userId = req.user.id;
//     console.log("order address is ===========>", address)
//     console.log("order paymentMethod is ===========>", req.body)

//     items.map((order) => {
//       console.log("order route is ===========>", order)
//     })


//     // Validate input
//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "Order must contain at least one product" });
//     }

//     if (!address) {
//       return res.status(400).json({ message: "Shipping address is required" });
//     }

//     // Check product availability and calculate total
//     let totalPrice = 0;
//     const products = [];

//     for (const item of items) {
//       const product = await Product.findById(item._id);

//       if (!product) {
//         return res.status(404).json({ message: `Product ${item.name} not found` });
//       }

//       const quantity = item.quantity || 1;

//       if (product.stock < quantity) {
//         return res.status(400).json({
//           message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
//         });
//       }

//       // Add to order products array
//       products.push({
//         product: product._id,
//         quantity,
//         priceAtOrder: product.price
//       });

//       // Update total
//       totalPrice += product.price * quantity;

//       // Decrement stock (without transaction)
//       product.stock -= quantity;
//       await product.save();
//     }

//     // Create order
//     const order = new Order({
//       user: userId,
//       products,
//       totalPrice,
//       address,
//       paymentMethod,
//       status: "Pending",
//       paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Completed"
//     });

//     await order.save();

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: {
//         _id: order._id,
//         totalPrice: order.totalPrice,
//         status: order.status,
//         createdAt: order.createdAt
//       }
//     });

//   } catch (error) {
//     console.error("Order creation error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create order",
//       error: error.message
//     });
//   }
// };





// export const createOrder = async (req, res) => {
//   try {
//     const { items, address } = req.body;
//     const userId = req.user.id;

//     console.log("Order Address:", address);
//     console.log("Order Items:", items);


//     // Validate input
//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "Order must contain at least one product" });
//     }
//     if (!address) {
//       return res.status(400).json({ message: "Shipping address is required" });
//     }

//     // 🆕 Generate Order ID (Structured Like Flipkart & Amazon)
//     const datePart = moment().format("YYYYMMDD"); // Current date (20250326)
//     const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase(); // Random 6-char string
//     const orderId = `ORD-${datePart}-${randomPart}`; // Final Order ID

//     // Check product availability and calculate total
//     let totalPrice = 0;
//     const products = [];

//     for (const item of items) {
//       const product = await Product.findById(item._id);
//       if (!product) {
//         return res.status(404).json({ message: `Product ${item.name} not found` });
//       }

//       const quantity = item.quantity || 1;
//       if (product.stock < quantity) {
//         return res.status(400).json({
//           message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
//         });
//       }

//       // Add to order products array
//       products.push({
//         product: product._id,
//         quantity,
//         priceAtOrder: product.price
//       });

//       // Update total price
//       totalPrice += product.price * quantity;

//       // Decrement stock
//       product.stock -= quantity;
//       await product.save();
//     }

//     // Create order with only "Cash on Delivery" as payment method
//     const order = new Order({
//       orderId, // ✅ Unique Order ID
//       user: userId,
//       products,
//       totalPrice,
//       address,
//       paymentMethod: "Cash on Delivery",
//       status: "Pending",
//       paymentStatus: "Pending"
//     });

//     // await order.save();

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: {
//         orderId: order.orderId, // ✅ Return Order ID
//         totalPrice: order.totalPrice,
//         status: order.status,
//         createdAt: order.createdAt
//       }
//     });

//   } catch (error) {
//     console.error("Order creation error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create order",
//       error: error.message
//     });
//   }
// };



export const createOrder = async (req, res) => {
  try {
    const { items, employeeId, shippingInfo, customerId } = req.body;
    const userId = req.user.id;

    // ✅ Validate input
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one product" });
    }

    // ✅ Generate a structured Order ID (Flipkart & Amazon style)
    const datePart = moment().format("YYYYMMDD"); // e.g., 20250327
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g., ABC123
    const orderId = `ORD-${datePart}-${randomPart}`;

    // ✅ Check product availability and calculate total price
    let totalPrice = 0;
    const products = [];

    for (const item of items) {
      const product = await Product.findOneAndUpdate(
        { _id: item._id, stock: { $gte: item.quantity } }, // ✅ Prevents overselling (atomic check)
        { $inc: { stock: -item.quantity } }, // ✅ Reduce stock safely
        { new: true }
      );

      if (!product) {
        return res.status(400).json({ message: `Product ${item.name} not available or out of stock` });
      }

      products.push({
        product: product._id,
        quantity: item.quantity,
        priceAtOrder: product.price
      });

      totalPrice += product.price * item.quantity;
    }

    // ✅ Save the order in MongoDB
    const order = new Order({
      orderId, // Unique Order ID
      customerId,
      employeeId,
      user: userId,
      products,
      totalPrice,
      address: shippingInfo.address, // ✅ Use shippingInfo for address
      // paymentMethod: shippingInfo.payment, // ✅ Dynamic payment method
      status: "Pending",
      paymentStatus: "Pending"
    });

    await order.save(); // ✅ Ensure the order is saved

    // ✅ Return success response
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        orderId: order.orderId,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};






// ✅ Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user products.product address");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// export const getAllOrders = async (req, res) => {
//   try {
//     // Fetch orders and populate only necessary fields
//     const orders = await Order.find()
//       .populate({
//         path: "products.product",
//         select: "name price images" // Select only necessary fields
//       });

//     // Transform data into a simple product table format
//     const simplifiedOrders = orders.map(order => ({
//       orderId: order._id,
//       products: order.products.map(p => ({
//         name: p.product?.name || "Unknown",
//         price: p.product?.price || 0,
//         image: p.product?.images?.[0]?.url || "No Image"
//       }))
//     }));

//     res.status(200).json(simplifiedOrders);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };


// ✅ Get Single Order (User/Admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user products.product address");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow the user who placed the order OR an admin to view it
    if (req.user.role !== "admin" && req.user._id.toString() !== order.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    console.log("order status is =========>", status)
    console.log("order status is =========>", status)

    // Check if order exists
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the status only
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status } }, // ✅ Only update the status field
      { new: true, runValidators: true } // ✅ Ensures enum validation is applied
    );

    res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ❌ Delete Order (Admin Only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await Order.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
