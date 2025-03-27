import Address from '../models/addressModel.js';

import Country from '../models/countryModel.js';
// import State from '../models/stateModel.js';
import State from "../models/StateModel.js";

import City from '../models/cityModel.js';

// ✅ Create a New Address
export const createAddress = async (req, res) => {
    try {
        const { fullName, mobileNo, address, country, state, city, pincode } = req.body;
        const userId = req.user.id;

        // console.log(" userId: ------------------------", userId);

        // Check if country, state, and city exist
        const existingCountry = await Country.findById(country);
        const existingState = await State.findById(state);
        const existingCity = await City.findById(city);

        if (!existingCountry) return res.status(404).json({ message: "Country not found" });
        if (!existingState) return res.status(404).json({ message: "State not found" });
        if (!existingCity) return res.status(404).json({ message: "City not found" });

        const newAddress = new Address({
            user: userId,
            fullName,
            mobileNo,
            address,
            country,
            state,
            city,
            pincode
        });

        await newAddress.save();
        res.status(201).json({ message: "Address added successfully", address: newAddress });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get All Addresses of a User
export const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await Address.find({ user: userId }).populate('country state city');

        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get a Single Address by ID
export const getSingleAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await Address.findById(id).populate('country state city');

        if (!address) return res.status(404).json({ message: "Address not found" });

        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Update an Address
export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, mobileNo, address, country, state, city, pincode } = req.body;

        const updatedAddress = await Address.findByIdAndUpdate(
            id,
            { fullName, mobileNo, address, country, state, city, pincode },
            { new: true }
        );

        if (!updatedAddress) return res.status(404).json({ message: "Address not found" });

        res.status(200).json({ message: "Address updated successfully", updatedAddress });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Delete an Address
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAddress = await Address.findByIdAndDelete(id);

        if (!deletedAddress) return res.status(404).json({ message: "Address not found" });

        res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
