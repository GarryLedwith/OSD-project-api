import { Request, Response } from 'express';
import { collections } from '../database';
import { User } from '../models/user';
import * as argon2 from 'argon2';
import { sign as jwtSign } from 'jsonwebtoken';

// Function to create JWT access token
const createAccessToken = (user: User | null): string => {
  const secret = process.env.JWTSECRET || 'not very secret';
  const expiresTime = '2m'; 

  const payload = {
    email: user?.email,
    name: user?.name, 
    role: user?.role // including role in the payload when creating the token
  };

  return jwtSign(payload, secret, { expiresIn: expiresTime });
};

// Handle user login and JWT generation
export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const dummyHash = await argon2.hash('time wasting'); 

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const user = (await collections.users?.findOne({
    email: email.toLowerCase()
  })) as unknown as User;

  if (user && user.hashedPassword) {
    const isPasswordValid = await argon2.verify(user.hashedPassword, password);

    if (isPasswordValid) {
      const token = createAccessToken(user);
      res.status(201).json({ accessToken: token, user: { email: user.email, name: user.name } });
      return;
    } else {
      res.status(401).json({ message: 'Invalid email or password!' });
      return;
    }
  }

  await argon2.verify(dummyHash, password);
  res.status(401).json({ message: 'Invalid email or password!' });
};
