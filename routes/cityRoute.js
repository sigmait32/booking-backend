// import express from 'express';
// import {
//     createCity,
//     getAllCities,
//     getCitiesByState,
//     updateCity,
//     deleteCity
// } from '../controllers/cityController.js';

// const router = express.Router();

// router.post('/cities', createCity);
// router.get('/cities', getAllCities);
// router.get('/cities/state/:stateId', getCitiesByState);
// router.put('/cities/:cityId', updateCity);
// router.delete('/cities/:cityId', deleteCity);

// export default router;

import express from 'express';
import {
    createCity,
    getAllCities,
    getCitiesByState,
    getSingleCity,
    updateCity,
    deleteCity
} from '../controllers/cityController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// ✅ Only Admin can create a city
router.post('/', authMiddleware, roleMiddleware(['admin']), createCity);

// ✅ Admin & Customers can view all cities
router.get('/', getAllCities);

// ✅ Admin & Customers can get cities by state ID
router.get('/state/:stateId', getCitiesByState);

// ✅ Admin & Customers can get a single city by ID
router.get('/:id', getSingleCity);

// ✅ Only Admin can update a city
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateCity);

// ✅ Only Admin can delete a city
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteCity);

export default router;

