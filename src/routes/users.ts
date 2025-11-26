import express, {Router} from 'express';
import { createUserSchema, updateUserSchema } from '../models/user';
import { validate } from '../middleware/validate.middleware';               

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
router.get('/', getUsers);
router.get('/role/:role', getUsersByRole); 
router.get('/:id', getUserById);
router.post('/', validate(createUserSchema), createUser); // validate request body
router.put('/:id', validate(createUserSchema), updateUser); // validate request body
router.patch('/:id', validate(updateUserSchema), patchUser); // validate request body
router.delete('/:id', deleteUser);

export default router;