import City from '../models/cityModel.js';
import State from '../models/StateModel.js';
import Country from '../models/countryModel.js';


export const createCity = async (req, res) => {
    try {
        const { name, state, country } = req.body;

        // Check if the state and country exist
        const existingState = await State.findById(state);
        const existingCountry = await Country.findById(country);

        if (!existingState) return res.status(404).json({ message: "State not found" });
        if (!existingCountry) return res.status(404).json({ message: "Country not found" });

        // Check if the city already exists in the same state and country
        const existingCity = await City.findOne({ name, state, country });

        if (existingCity) {
            return res.status(400).json({ message: "City already exists in this state and country" });
        }

        // Create and save the new city
        const city = new City({ name, state, country });
        await city.save();

        res.status(201).json({ message: "City created successfully", city });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


// ✅ Get all cities (Admin & Customers)
export const getAllCities = async (req, res) => {
    try {
        const cities = await City.find().populate('state country', 'name');
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get a single city by ID (Admin & Customers)
export const getSingleCity = async (req, res) => {
    try {
        const city = await City.findById(req.params.id).populate('state country', 'name');
        if (!city) return res.status(404).json({ message: "City not found" });
        res.json(city);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get cities by state ID (Admin & Customers)
export const getCitiesByState = async (req, res) => {
    try {
        const cities = await City.find({ state: req.params.stateId }).populate('state country', 'name');
        if (!cities.length) return res.status(404).json({ message: "No cities found for this state" });
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Update a city (Only Admin)
export const updateCity = async (req, res) => {
    try {
        const { name, state, country } = req.body;
        const city = await City.findByIdAndUpdate(req.params.id, { name, state, country }, { new: true });

        if (!city) return res.status(404).json({ message: "City not found" });

        res.json({ message: "City updated successfully", city });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Delete a city (Only Admin)
export const deleteCity = async (req, res) => {
    try {
        const city = await City.findByIdAndDelete(req.params.id);
        if (!city) return res.status(404).json({ message: "City not found" });
        res.json({ message: "City deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};