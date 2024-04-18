import { Request } from 'express';

/**
 * ExtendedRequest Interface
 * 
 * This interface extends the standard Express.js Request object to include custom user information.
 * It is part of the middleware authentication strategy where user details, once validated and decoded
 * from a JWT or another authentication mechanism, are attached to the request object for downstream
 * access within request handlers and other middleware.
 */
export interface ExtendedRequest extends Request {
  user?: {
    username: string;
  }
}
