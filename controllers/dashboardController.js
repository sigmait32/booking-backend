

// import Product from "../models/productModel.js";
// import Category from "../models/categoryModel.js";
// import SubCategory from "../models/subCategoryModel.js";
// import Order from "../models/orderModel.js";
// import User from "../models/user.js";
// import Banner from "../models/bannerModel.js";
// import Country from "../models/countryModel.js";
// import State from "../models/stateModel.js";
// import City from "../models/cityModel.js";
// import Entry from '../models/saleEntryModel.js'

// export const getDashboardStats = async (req, res) => {
//     try {
//         // Fetch counts in parallel using Promise.all
//         const [
//             totalProducts,
//             totalCategories,
//             totalSubCategories,
//             totalOrders,
//             totalCustomers,
//             totalEmployees,
//             totalBanners,
//             totalCountries,
//             totalStates,
//             totalCities,
//             totalStock,
//             outOfStockProducts
//         ] = await Promise.all([
//             Product.countDocuments({}),
//             Category.countDocuments({}),
//             SubCategory.countDocuments({}),
//             Order.countDocuments({}),
//             User.countDocuments({ role: "customer" }),
//             User.countDocuments({ role: "employee" }),
//             Banner.countDocuments({}),
//             Country.countDocuments({}),
//             State.countDocuments({}),
//             City.countDocuments({}),
//             Product.aggregate([{ $group: { _id: null, totalStock: { $sum: "$stock" } } }]), // Total stock
//             Product.countDocuments({ stock: { $lte: 0 } }) // Out-of-stock products
//         ]);

//         res.status(200).json({
//             success: true,
//             revenue: 486.15, // Placeholder for revenue, replace with actual logic
//             totalProducts,
//             totalCategories,
//             totalSubCategories,
//             totalOrders,
//             totalCustomers,
//             totalEmployees,
//             totalBanners,
//             totalCountries,
//             totalStates,
//             totalCities,
//             totalStock: totalStock.length > 0 ? totalStock[0].totalStock : 0,
//             outOfStockProducts
//         });
//     } catch (error) {
//         console.error("Error fetching dashboard stats:", error);
//         res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
//     }
// };


import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryModel.js";
import Order from "../models/orderModel.js";
import User from "../models/user.js";
import Banner from "../models/bannerModel.js";
import Country from "../models/countryModel.js";
import State from "../models/stateModel.js";
import City from "../models/cityModel.js";
import Entry from "../models/saleEntryModel.js"; // Sale Entry model

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalProducts,
            totalCategories,
            totalSubCategories,
            totalOrders,
            totalCustomers,
            totalEmployees,
            totalBanners,
            totalCountries,
            totalStates,
            totalCities,
            totalStock,
            outOfStockProducts,
            totalSaleEntries
        ] = await Promise.all([
            Product.countDocuments({}),
            Category.countDocuments({}),
            SubCategory.countDocuments({}),
            Order.countDocuments({}),
            User.countDocuments({ role: "customer" }),
            User.countDocuments({ role: "employee" }),
            Banner.countDocuments({}),
            Country.countDocuments({}),
            State.countDocuments({}),
            City.countDocuments({}),
            Product.aggregate([{ $group: { _id: null, totalStock: { $sum: "$stock" } } }]),
            Product.countDocuments({ stock: { $lte: 0 } }),
            Entry.countDocuments({}) // ➕ Total sale entries
        ]);

        res.status(200).json({
            success: true,
            revenue: 486.15, // TODO: Replace with actual revenue calculation
            totalProducts,
            totalCategories,
            totalSubCategories,
            totalOrders,
            totalCustomers,
            totalEmployees,
            totalBanners,
            totalCountries,
            totalStates,
            totalCities,
            totalStock: totalStock.length > 0 ? totalStock[0].totalStock : 0,
            outOfStockProducts,
            totalSaleEntries // ➕ Add to response
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
    }
};
