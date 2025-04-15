

import bcrypt from 'bcrypt';
import User from '../models/user.js'; // Make sure the path to the User model is correct

// Create a new customer
// export const createCustomer = async (req, res) => {
//     try {
//         const { fullName, email, password, mobileNo, gst_number, address, state, city } = req.body;

//         // Check if the email already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json({ error: 'Email already exists' }); // 409 Conflict for duplicate email
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const newUser = await User.create({
//             fullName,
//             email,
//             password: hashedPassword,
//             mobileNo,
//             gst_number,
//             state,
//             city,
//             address,
//         });

//         // Respond with the created user details
//         res.status(201).json({
//             message: 'User created successfully',
//             user: {
//                 id: newUser._id,
//                 fullName: newUser.fullName,
//                 email: newUser.email,
//                 mobileNo: newUser.mobileNo,
//                 gst_number: newUser.gst_number,
//                 address: newUser.address,
//             },
//         });

//     } catch (err) {
//         console.error('Error during registration:', err);
//         res.status(500).json({ error: 'User registration failed' }); // Send a generic error message
//     }
// };


export const createCustomer = async (req, res) => {
    try {
        const { fullName, email, password, mobileNo, gst_number, address, state, city } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !mobileNo || !address || !state || !city) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the email or mobile number already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { mobileNo }] // Check for either email or phone number
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Email or mobile number already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new customer
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            mobileNo,
            gst_number,
            state,
            city,
            address,
            role: 'customer', // Ensure role is set
        });

        // Respond with the created user details
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                mobileNo: newUser.mobileNo,
                gst_number: newUser.gst_number,
                address: newUser.address,
            },
        });

    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'User registration failed' });
    }
};

export const customerList = async (req, res) => {
    try {
        // Retrieve customers with role "customer" from the database
        const customers = await User.find({ role: "customer" }).sort({ createdAt: -1 });

        res.status(200).json(customers); // Return the filtered list of customers
    } catch (err) {
        console.error("Error fetching customer list:", err);
        res.status(500).json({ error: "Failed to fetch customer list" });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await User.findById(id);

        if (!category) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(category);

    } catch (error) {
        console.error("Error fetching User:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// Update a customer's details
// export const updateCustomer = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { fullName, email, mobileNo, password, gst_number, address } = req.body;

//         // Find the customer by ID
//         req.password = await bcrypt.hash(password, 10);
//         console.log("password  is ========>", req.body.password)
//         return

//     } catch (err) {
//         console.error('Error updating customer:', err);
//         res.status(500).json({ error: 'Customer update failed' });
//     }
// };

export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, mobileNo, password, gst_number, address, state, city } = req.body;
        console.log("update body is =======>", req.body)
        // Find the customer by ID
        let customer = await User.findById(id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }


        // Hash password only if provided
        let hashedPassword = customer.password; // Keep old password if no new password is provided
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update customer details
        customer.fullName = fullName || customer.fullName;
        customer.state = state || customer.state;
        customer.city = city || customer.city;
        customer.email = email || customer.email;
        customer.mobileNo = mobileNo || customer.mobileNo;
        customer.password = hashedPassword;
        customer.gst_number = gst_number || customer.gst_number;
        customer.address = address || customer.address;

        // Save updated customer
        await customer.save();

        res.status(200).json({ message: 'Customer updated successfully', customer });
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ error: 'Customer update failed' });
    }
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the customer by ID
        const deletedCustomer = await User.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted successfully' });

    } catch (err) {
        console.error('Error deleting customer:', err);
        res.status(500).json({ error: 'Customer deletion failed' });
    }
};
