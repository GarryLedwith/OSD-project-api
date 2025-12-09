import express from 'express';
import { handleLogin } from '../controllers/auth';

export const authRouter = express.Router();

// public route for user login
authRouter.post('/', handleLogin);
