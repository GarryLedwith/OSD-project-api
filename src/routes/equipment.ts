import express, {Router} from 'express';
import { bookingSchema, equipmentSchema, updateEquipmentSchema} from '../models/equipment';
import { validate } from '../middleware/validate.middleware';   
import { validJWTProvided } from '../middleware/auth.middleware';            

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
// public route to get all equipment
router.get('/', getEquipment);
// protected routes
router.post('/', validJWTProvided, validate(equipmentSchema), addEquipment); // validate request body
router.get('/:id', validJWTProvided, getEquipmentById);
router.patch('/:id', validJWTProvided, validate(updateEquipmentSchema), updateEquipment); // validate request body
router.delete('/:id', validJWTProvided, deleteEquipment);

// Bookings sub-routes
router.post('/:id/bookings', validJWTProvided, validate(bookingSchema), createBooking); // validate request body
router.get('/:id/bookings', validJWTProvided, getBookings);


export default router;