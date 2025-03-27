// import State from "../models/stateModel.js";
import State from "../models/StateModel.js";

// ✅ Create a New State
export const createState = async (req, res) => {
    try {
        const { name, country } = req.body;
        if (!name || !country) {
            return res.status(400).json({ message: 'Name and country are required' });
        }
        const existingState = await State.findOne({ name });
        if (existingState) {
            return res.status(409).json({ error: 'State already exists' });
        }



        const newState = new State({ name, country });
        await newState.save();

        res.status(201).json({ message: 'State created successfully', state: newState });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Get All States
export const getAllStates = async (req, res) => {
    try {
        const states = await State.find().populate('country', 'name'); // Populating country details
        res.status(200).json(states);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Get a Single State by ID
export const getStateById = async (req, res) => {
    try {
        const state = await State.findById(req.params.id).populate('country', 'name');
        if (!state) return res.status(404).json({ message: 'State not found' });

        res.status(200).json(state);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Update a State by ID
export const updateState = async (req, res) => {
    try {
        const { name, country } = req.body;
        const state = await State.findByIdAndUpdate(req.params.id, { name, country }, { new: true });

        if (!state) return res.status(404).json({ message: 'State not found' });

        res.status(200).json({ message: 'State updated successfully', state });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Delete a State by ID
export const deleteState = async (req, res) => {
    try {
        const state = await State.findByIdAndDelete(req.params.id);
        if (!state) return res.status(404).json({ message: 'State not found' });

        res.status(200).json({ message: 'State deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
