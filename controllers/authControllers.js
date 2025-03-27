// const Banner = require('../models/banner');
// const User = require('../models/user')

import User from '../models/user.js'
import { createToken } from '../utiles/tokenCreate.js'
// import bcrpty from "bcrypt";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { fullName, email, password, mobileNo, gst_number, address } = req.body;

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
            gst_number,
            address,
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
// export const login = async (req, res) => {
//     const { email, mobileNo, password } = req.body;

//     try {
//         // Check if either email or mobileNo is provided
//         if (!email && !mobileNo) {
//             return res.status(400).json({ error: 'Email or mobile number is required' });
//         }

//         // Find the user by email or mobile number
//         const user = await User.findOne({
//             $or: [{ email }, { mobileNo }],
//         });

//         if (!user) {
//             return res.status(404).json({ error: 'Invalid login credentials' });
//         }

//         if (user) {
//             const isMatch = await bcrpty.compare(password, user.password);

//             if (isMatch) {

//                 console.log("user is ===========>", user.id)
//                 console.log("role is ===========>", user.role)
//                 const token = await createToken({
//                     id: user.id,
//                     role: user.role
//                 })
//                 res.cookie('accessToken', token, {
//                     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//                 })
//                 return res.status(200).json({ token, message: "Login Success" })
//             } else {
//                 return res.status(401).json({ error: 'Invalid password' });
//             }
//         }

//         // If user not found


//     } catch (err) {
//         console.error('Error during login:', err); // Log the error for debugging
//         res.status(500).json({ error: 'Login failed' }); // Send a generic error message
//     }
// };



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
        console.log("User ID:", user.id);
        console.log("User Role:", user.role);

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