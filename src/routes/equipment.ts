import express, {Router} from 'express';
import { bookingSchema, equipmentSchema, updateEquipmentSchema} from '../models/equipment';
import { validate } from '../middleware/validate.middleware';               

import {
    addEquipment,
    getEquipment,
    getEquipmentById,
    updateEquipment,
    deleteEquipment,
    createBooking,
    getBookings
} from '../controllers/equipment';

const router: Router = express.Router();

// Equipment routes - CRUD operations
router.post('/', validate(equipmentSchema), addEquipment); // validate request body
router.get('/', getEquipment);
router.get('/:id', getEquipmentById);
router.patch('/:id', validate(updateEquipmentSchema), updateEquipment); // validate request body
router.delete('/:id', deleteEquipment);

// Bookings sub-routes
router.post('/:id/bookings', validate(bookingSchema), createBooking); // validate request body
router.get('/:id/bookings', getBookings);


export default router;