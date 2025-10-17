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
 getUsersByRole,
} from '../controllers/users';  

/*
Users endpoints:

POST /api/v1/users (admin: creates a new user account)

GET /api/v1/users (admin: lists all the users)  

GET /api/v1/users/:id (admin: gets an individual user)  

GET /api/v1/users/role/:role (admin: gets users by role)

PUT /api/v1/users/:id (admin: update individual user- full update ) 

PATCH /api/v1/users/:id (admin: update individual user – partial update) 

DELETE /api/v1/users/:id (admin: deletes a user account)   

*/

const router: Router = express.Router();

// Users routes - CRUD operations
router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/role/:role', getUsersByRole);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(createUserSchema), updateUser);
router.patch('/:id', patchUser);
router.delete('/:id', deleteUser);

export default router;