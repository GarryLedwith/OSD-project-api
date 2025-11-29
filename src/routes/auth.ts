import express from 'express';
import { handleLogin } from '../controllers/auth';

export const authRouter = express.Router();

authRouter.post('/', handleLogin);
