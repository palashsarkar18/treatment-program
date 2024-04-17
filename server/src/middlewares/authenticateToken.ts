import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ExtendedRequest } from '../types/custom'; // Assuming types are defined in a custom.d.ts file
import { SECRET_KEY } from '../server';

export function authenticateToken(req: ExtendedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  console.log("authHeader: ", authHeader);

  // If no token in the header, try to get it from query parameters
  if (!token) {
    token = req.query.token as string || undefined;
    }

  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401);
  } 

  jwt.verify(token, process.env.SECRET_KEY || SECRET_KEY, (err, decoded) => { // TODO: Better to assign in process.env
    if (err) {
        console.log('Token verification failed:', err);
      return res.sendStatus(403);
    }

    if (typeof decoded === 'object' && decoded && 'username' in decoded) {
      req.user = { username: decoded.username };
      next();
    } else {
      return res.sendStatus(403);
    }
  });
}
