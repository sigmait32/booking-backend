
import SaleEntry from '../models/saleEntryModel.js'
import User from '../models/user.js';
import Product from '../models/productModel.js'



// export const createSaleEntry = async (req, res) => {

//     console.log(" sale entry is =========>", req.body);
//     return res.json({ message: "this is sale Entry" })


// }


export const createSaleEntry = async (req, res) => {
    console.log("body is =========>", req.body)
    try {
        const {
            employeeId,
            customerDetails,
            items,
            totals,
            additionalDiscount,
            paidAmount,
            balanceAmount,
            paymentMode
        } = req.body;

        const newSaleEntry = new SaleEntry({
            employeeId: employeeId,
            customerId: customerDetails.customerId,
            email: customerDetails.email,
            mobileNo: customerDetails.mobileNo,
            address: customerDetails.address,
            gst_number: customerDetails.gst_number,
            items: items.map((item) => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
                batchNumber: item.batchNumber,
                expDate: item.expDate,
                mrp: item.mrp,
                storePrice: item.storePrice,
                discount: item.discount,
                sgstPercent: item.sgstPercent,
                cgstPercent: item.cgstPercent,
                igstPercent: item.igstPercent,
                sgst: item.sgst,
                cgst: item.cgst,
                igst: item.igst,
                discountAmt: item.discountAmt,
                shipping: item.shipping,
                hsn: item.hsn,
                isTaxable: item.isTaxable,
                isFreeShipping: item.isFreeShipping,
                grossAmount: item.grossAmount,
                amount: item.amount,
                category: item.category,
                subCategory: item.subCategory
            })),
            totals,
            additionalDiscount,
            paidAmount,
            balanceAmount,
            paymentMode
        });

        await newSaleEntry.save();

        res.status(201).json({
            message: "Sale entry created successfully",
            data: newSaleEntry
        });
    } catch (error) {
        console.error("Error creating sale entry:", error);
        res.status(500).json({
            message: "Error creating sale entry",
            error: error.message
        });
    }
};

export const getAllSaleEntries = async (req, res) => {
    let response = await SaleEntry.find({}).sort({ id: -1 })
        .populate({
            path: "employeeId",
            model: User,
            select: "fullName email"
        })
        .populate({
            path: "customerId",
            model: User,
            select: "fullName email"
        })
        .populate({
            path: "items.product",
            model: Product,
            select: "name images "
        })
    // console.log("response is =========>", response)
    return res.json(response)
}



export const getSaleEntryById = async (req, res) => {
    return res.json({ message: "this is sale Entry" })
}
export const updateSaleEntry = async (req, res) => {
    return res.json({ message: "this is sale Entry" })
}

// export const deleteSaleEntry = async (req, res) => {
//     c
//     return res.json({ message: "this is sale Entry" })
// }



export const deleteSaleEntry = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("delete entry", id)

        const deletedEntry = await SaleEntry.findByIdAndDelete(id);

        if (!deletedEntry) {
            return res.status(404).json({ message: "Sale entry not found." });
        }

        return res.status(200).json({ message: "Sale entry deleted successfully." });
    } catch (error) {
        console.error("Delete Sale Entry Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
