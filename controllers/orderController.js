import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

import crypto from "crypto";
import moment from "moment";





export const createOrder = async (req, res) => {
  try {

    console.log("request body is =====>", req.body)
    const { items, employeeId, shippingInfo, customerId, discount, shipping, tax, totalBeforeDiscount, totalAfterDiscount, total } = req.body;
    const userId = req.user.id;

    // ✅ Validate input
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one product." });
    }

    // ✅ Generate a structured Order ID (Flipkart & Amazon style)
    const datePart = moment().format("YYYYMMDD");
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
    const orderId = `ORD-${datePart}-${randomPart}`;

    // ✅ Check product availability before deducting stock
    let totalPrice = 0;
    const products = [];

    for (const item of items) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(400).json({ message: `Product ${item.name} not found.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} unit(s) of "${product.name}" are available, but you ordered ${item.quantity}.`
        });
      }
    }

    // ✅ Deduct stock after validation
    for (const item of items) {
      const product = await Product.findByIdAndUpdate(
        item._id,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      products.push({
        product: product._id,
        quantity: item.quantity,
        priceAtOrder: product.price
      });

      totalPrice += product.price * item.quantity;
    }



    // ✅ Create and save order
    const order = new Order({
      discount,
      shipping,
      tax,
      totalBeforeDiscount,
      totalAfterDiscount,
      totalPrice: total,
      orderId,
      customerId,
      employeeId,
      user: userId,
      products,
      totalPrice,
      address: shippingInfo.address,
      status: "Pending",
      paymentStatus: "Pending"
    });

    await order.save();

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
    console.error("Order creation error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error: error.message
    });
  }
};


// export const createOrder = async (req, res) => {
//   try {

//     console.log("request body is =====>", req.body)
//     const { items, employeeId, shippingInfo, customerId } = req.body;
//     const userId = req.user.id;

//     // ✅ Validate input
//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "Order must contain at least one product." });
//     }

//     // ✅ Generate a structured Order ID (Flipkart & Amazon style)
//     const datePart = moment().format("YYYYMMDD");
//     const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
//     const orderId = `ORD-${datePart}-${randomPart}`;

//     // ✅ Check product availability before deducting stock
//     let totalPrice = 0;
//     const products = [];

//     for (const item of items) {
//       const product = await Product.findById(item._id);

//       if (!product) {
//         return res.status(400).json({ message: `Product ${item.name} not found.` });
//       }

//       if (product.stock < item.quantity) {
//         return res.status(400).json({
//           message: `Only ${product.stock} unit(s) of "${product.name}" are available, but you ordered ${item.quantity}.`
//         });
//       }
//     }

//     // ✅ Deduct stock after validation
//     for (const item of items) {
//       const product = await Product.findByIdAndUpdate(
//         item._id,
//         { $inc: { stock: -item.quantity } },
//         { new: true }
//       );

//       products.push({
//         product: product._id,
//         quantity: item.quantity,
//         priceAtOrder: product.price
//       });

//       totalPrice += product.price * item.quantity;
//     }



//     // ✅ Create and save order
//     const order = new Order({
//       orderId,
//       customerId,
//       employeeId,
//       user: userId,
//       products,
//       totalPrice,
//       address: shippingInfo.address,
//       status: "Pending",
//       paymentStatus: "Pending"
//     });

//     // await order.save();

//     // ✅ Return success response
//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: {
//         orderId: order.orderId,
//         totalPrice: order.totalPrice,
//         status: order.status,
//         createdAt: order.createdAt
//       }
//     });

//   } catch (error) {
//     console.error("Order creation error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create order.",
//       error: error.message
//     });
//   }
// };






// ✅ Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user products.product address")
      .sort({ createdAt: -1 }); // Sorting in descending order (newest first)

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



// ✅ Get Single Order (User/Admin)
export const getOrderById = async (req, res) => {
  // console.log(" employee order detail  is ==========>", req.params.id)
  try {
    const order = await Order.findById(req.params.id)
      .populate("user products.product address")
      .populate("customerId")
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

export const getEmpOrdrDtl = async (req, res) => {
  // console.log(" employee order detail  is ==========>", req.params.id)
  try {
    const order = await Order.findById(req.params.id)
      .populate("user products.product address")
      // .populate("customerId")
      .populate("customerId", "fullName email")
      .populate("employeeId", "fullName email");
    if (!order) return res.status(404).json({ message: "Order not found" });


    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getCustomerOrderById = async (req, res) => {
  try {
    // Ensure req.user is defined
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. User not found" });
    }

    const orders = await Order.find({ orderId: req.params.id })
      .populate("products.product")
      .populate("customerId", "fullName email")
      .populate("employeeId", "fullName email");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this customer" });
    }

    // Ensure req.user._id exists before calling toString()
    if (
      req.user.role !== "admin" &&
      req.user._id && req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // console.log("order status is =========>", status)
    // console.log("order status is =========>", status)

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



export const getEmpOrderList = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. User not found" });
    }

    // console.log("employeeId  ============>", req.user.id);

    // Fetch orders assigned to this employee
    const orders = await Order.find({ employeeId: req.user.id })
      .populate("products.product", "name price images")
      .populate("customerId", "fullName email")
      .populate("employeeId", "fullName email");

    // console.log("orders  ============>", orders);

    // If no orders are found, return a proper response
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this employee", orders: [] });
    }

    // Return the list of orders
    return res.status(200).json({ success: true, orders });

  } catch (error) {
    console.error("Error fetching employee orders:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
