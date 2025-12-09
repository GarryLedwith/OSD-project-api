import express, {Router} from 'express';
import { createUserSchema, updateUserSchema } from '../models/user';
import { validate } from '../middleware/validate.middleware';  
import { validJWTProvided } from '../middleware/auth.middleware';             

import {
 getUsers,
 getUserById,
 createUser,
 updateUser,
 patchUser,
 deleteUser,
 getUsersByRole,
} from '../controllers/users';  

const router: Router = express.Router();

// Users routes - CRUD operations
// public route to create user
router.post('/', validate(createUserSchema), createUser); // validate request body
// protected routes
router.get('/',  validJWTProvided, getUsers);
router.get('/role/:role', validJWTProvided, getUsersByRole); 
router.get('/:id',  validJWTProvided, getUserById);
router.put('/:id', validJWTProvided, validate(createUserSchema), updateUser); // validate request body
router.patch('/:id', validJWTProvided, validate(updateUserSchema), patchUser); // validate request body
router.delete('/:id', validJWTProvided, deleteUser);

export default router;