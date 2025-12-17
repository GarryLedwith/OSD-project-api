import { Request, Response, NextFunction } from 'express';
import { verify as jwtVerify } from 'jsonwebtoken';


// Part 3: Additional authentication middleware to validate JWTs

export const validJWTProvided = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers?.authorization;

  // Check for Bearer token in Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    console.log('no header ' + authHeader);
    res.status(401).send();
    return;
  }

  // Extract token from header
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).send();
    return;
  }

  // Verify the token
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

// Middleware to check if the user has admin role (using role from JWT payload)
export const isAdmin = async (
  req: Request,   
  res: Response,
  next: NextFunction
) => {
  const role = res.locals?.payload?.role; // Get role from JWT payload  and assign it to role variable

  console.log('User role: ' + role);

  // Check if role is 'admin' (if so, proceed to next middleware/handler, else return 403)
  if (role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'not an admin' });
  }
}; 
