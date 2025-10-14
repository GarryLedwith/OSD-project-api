/*
Users endpoints:

GET /api/v1/users (admin: lists all the users)  

GET /api/v1/users/:id (admin: gets an individual user)  

PUT /api/v1/users/:id (admin: update individual user- full update ) 

PATCH /api/v1/users/:id (admin: update individual user – partial update) 

DELETE /api/v1/users/:id (admin: deletes a user account)  

*/

import express, {Router} from 'express';
import { createUserSchema } from '../models/user';
import { validate } from '../middleware/validate.middleware';               

import {
 getUsers,
 getUserById,
 createUser,
 updateUser,
 patchUser,
 deleteUser,
} from '../controllers/users';  

const router: Router = express.Router();

// Users routes - CRUD operations
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', updateUser);
router.patch('/:id', patchUser);
router.delete('/:id', deleteUser);

export default router;