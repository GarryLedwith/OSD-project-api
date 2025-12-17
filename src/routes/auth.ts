import express from 'express';
import { handleLogin } from '../controllers/auth';
import { isAdmin } from '../middleware/auth.middleware';

export const authRouter = express.Router();

// public route for user login
authRouter.post('/', handleLogin);


