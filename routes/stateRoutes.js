import express from 'express';
import { 
    createState, 
    getAllStates, 
    getStateById, 
    updateState, 
    deleteState 
} from '../controllers/stateController.js';

const router = express.Router();

// ✅ Create a new state
router.post('/', createState);

// ✅ Get all states
router.get('/', getAllStates);

// ✅ Get a state by ID
router.get('/:id', getStateById);

// ✅ Update a state
router.put('/:id', updateState);

// ✅ Delete a state
router.delete('/:id', deleteState);

export default router;
