import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ExtendedRequest } from '../types/custom'; // Assuming types are defined in a custom.d.ts file
import { SECRET_KEY } from '../server';

/**
 * Middleware to authenticate JWT tokens in HTTP requests.
 *
 * This function attempts to extract a JWT token from the 'Authorization' header first and then
 * falls back to checking the query parameters. It validates the token using a secret key and
 * ensures the token is valid and has not expired. On successful validation, it appends the
 * decoded user information to the request object and passes control to the next middleware.
 * If the token is missing, invalid, or expired, it sends an appropriate HTTP status code.
 *
 * @param {ExtendedRequest} req - The request object extended to include the user property.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The callback to pass control to the next middleware function.
 */
export function authenticateToken(req: ExtendedRequest, res: Response, next: NextFunction) {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  console.log("authHeader: ", authHeader);

  // If no token in the header, try to get it from query parameters
  if (!token) {
    token = req.query.token as string || undefined;
  }

  // If no token found, return a 401 Unauthorized status
  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401);
  } 

  // Check if the SECRET_KEY is configured
  if (!SECRET_KEY) {
    console.error('SECRET_KEY is missing');
    return res.sendStatus(403);
  }

  // Verify the token using the configured SECRET_KEY
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log('Token verification failed:', err);
      return res.sendStatus(403);
    }

    // Check if decoded token has necessary user information
    if (typeof decoded === 'object' && decoded && 'username' in decoded) {
      req.user = { username: decoded.username }; // Attach user info to request
      next(); // Pass control to the next middleware
    } else {
      return res.sendStatus(403); // Token is invalid or malformed
    }
  });
}
