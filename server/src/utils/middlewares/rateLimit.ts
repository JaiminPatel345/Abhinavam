import {Request, Response} from "express";
import rateLimit from 'express-rate-limit';
import {formatResponse} from "../../types/custom.types.js";

const rateLimiter = (windowMs: number, limit: number) => {
  return rateLimit({
    windowMs: windowMs,
    limit,
    message: formatResponse(
        false,
        'Too many requests from this IP, please try again later.',
        {
          retryAfter: `${windowMs / 60000} minutes`, // Convert to minutes
          limit: limit
        }
    ),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req: Request, res: Response) => {
      res.status(429).json(formatResponse(
          false,
          `Rate limit exceeded. Try again after ${windowMs / 60000} minutes`,
          {
            limit,
            windowMs: `${windowMs / 60000} minutes`
          }
      ));
    }
  });
};

export default rateLimiter;

// Usage example:
export const commentLimiter = rateLimiter(60 * 1000, 5);
export const likeLimiter = rateLimiter(30 * 1000, 10); // 10 requests 30s