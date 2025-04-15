// const Banner = require('../models/banner');
// const User = require('../models/user')

import User from '../models/user.js'
import { createToken } from '../utiles/tokenCreate.js'
// import bcrpty from "bcrypt";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';




export const getEmployeeList = async (req, res) => {

    console.log("get api list is")
    try {
        let employees = await User.find({ role: "employee" }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Employee list fetched successfully",
            data: employees
        });

    } catch (error) {
        console.error("Error fetching employees:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch employee list",
            error: error.message
        });
    }
};


export const register = async (req, res) => {
    try {
        const { fullName, email, password, mobileNo, address } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        // ✅ 5. Check if the email already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ error: 'User email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            fullName,
            email: normalizedEmail,
            password: hashedPassword, // Use the hashed password
            mobileNo,
            address,
            role: "employee",
        });

        // Respond with success message
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
        console.error('Error during registration:', err); // Log the error for debugging
        res.status(500).json({ error: 'User registration failed' }); // Send a generic error message
    }
};


export const login = async (req, res) => {
    const { email, mobileNo, password } = req.body;

    try {
        // ✅ 1. Validate input (ensure at least one identifier is provided)
        if (!email && !mobileNo) {
            return res.status(400).json({ error: 'Email or mobile number is required' });
        }

        // ✅ 2. Find user in the database
        const user = await User.findOne({ $or: [{ email }, { mobileNo }] });

        if (!user) {
            return res.status(404).json({ error: 'Invalid login credentials' });
        }

        // ✅ 3. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // ✅ 4. Log user details for debugging (Remove in production)


        // ✅ 5. Use createToken function
        const token = createToken({ id: user.id, role: user.role, name: user.fullName, email: user.email });

        // ✅ 6. Store token in an HTTP-only secure cookie
        res.cookie('accessToken', token, {
            httpOnly: true, // Prevents JavaScript access for security
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
        });

        // ✅ 7. Return token and success message
        return res.status(200).json({ token, role: user.role, message: "Login Success" });

    } catch (err) {
        console.error('Error during login:', err); // Log the error for debugging
        return res.status(500).json({ error: 'Login failed' }); // Send a generic error message
    }
};


export const logout = async (req, res) => {
    try {
        res.cookie('accessToken', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        return res.status(200).json({ message: 'logout Success' })
    } catch (error) {
        // responseReturn(res, 500, { error: error.message })
        res.status(500).json({ error: error.message });
    }
}

export const changePassword = async (req, res) => {
    const { email, old_password, new_password } = req.body;
    // console.log("change password")
    // console.log(email, old_password, new_password)
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();
        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.log("error is =====>", error)
        res.status(500).json({ message: 'Server Error' });
    }
}

export const updateCustomerPassword = async (req, res) => {
    try {
        const { email, new_password } = req.body;
        // console.log("email is ======>", email);
        // console.log("new_password is ======>", new_password)


        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();

        res.json({ message: 'Password updated successfully by admin' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}


export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await User.findById(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee);

    } catch (error) {
        console.error("Error fetching User:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, mobileNo, password, address } = req.body;

        // Find the employee by ID
        let employee = await User.findById(id);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        // console.log("update body is =======>", req.body)

        // Hash password only if provided
        let hashedPassword = employee.password; // Keep old password if no new password is provided
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update employee details
        employee.fullName = fullName || employee.fullName;

        employee.email = email || employee.email;
        employee.mobileNo = mobileNo || employee.mobileNo;
        employee.password = hashedPassword;
        employee.address = address || employee.address;

        // Save updated employee
        await employee.save();

        res.status(200).json({ message: 'Customer updated successfully', employee });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Employee update failed' });
    }
};


export const deleteEmployee = async (req, res) => {
    console.log("remove employee", req.params)
    try {
        const { id } = req.params;

        // Find and delete the Employee by ID
        const deletedEmployee = await User.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });

    } catch (err) {
        console.error('Error deleting Employee:', err);
        res.status(500).json({ error: 'Employee deletion failed' });
    }
};
