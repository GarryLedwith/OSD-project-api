/*
Users endpoints:

POST /api/v1/auth/sign-up (creates a user account)  

POST /api/v1/auth/login (login to existing account)  

GET /api/v1/users (admin) (lists all the users)  

PUT /api/v1/users/:id (admin: update user ) 

DELETE /api/v1/users/:id (admin: deletes a user account)  

*/

import express, {Router} from 'express';

import {
 getUsers,
 getUserById,
 createUser,
 updateUser,
 deleteUser,
} from '../controllers/users';  

const router: Router = express.Router();

// Users routes - CRUD operations
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser); 
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;