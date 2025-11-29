import { Request, Response, NextFunction } from 'express';
import { verify as jwtVerify } from 'jsonwebtoken';


// Part 3: Additional authentication middleware to validate JWTs

export const validJWTProvided = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    console.log('no header ' + authHeader);
    res.status(401).send();
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).send();
    return;
  }

  const secret = process.env.JWTSECRET || 'not very secret';

  try {
    const payload = jwtVerify(token, secret);
    res.locals.payload = payload; 
    next();
  } catch (err) {
    res.status(403).send();
    return;
  }
};


