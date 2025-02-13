// src/server.ts
import express, {Request, Response} from 'express';
import 'dotenv/config';
import {connectRedis} from './redis/redis.js';
import connectDB from "./database.js";

// Import routes
import authRouter from './routes/authRoute.js';
import {CustomErrorHandler} from './types/server.types.js';
import tokenRoute from "./routes/tokenRoute.js";
import postRoute from "./routes/postRoute.js";
import {formatResponse} from "./types/custom.types.js";

// Create Express app
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3003;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Database connections
const startServer = async () => {
  try {
    // Connect to Redis
    connectRedis();

    // Connect to MongoDB
    connectDB();

    // Routes
    app.use('/post', postRoute);
    app.use('/token', tokenRoute);
    app.use('/auth', authRouter);

    // Health check route
    app.get("/", (req: Request, res: Response) => {
      res.json({message: "Connected"});
    });

    // 404 Handler
    app.use((req: Request, res: Response) => {
      res.status(404).json(formatResponse(false, "Not Route Found"));
      return
    });

    // Error handling middleware
    const errorHandler: CustomErrorHandler = (error, req, res, next) => {
      console.error('Unhandled Error:', error);

      // Default to 500 if no status code is set
      const statusCode = error.status || 500;

      res.status(statusCode).json(formatResponse(false, error.message || "Internal Server Error", error));
    };

    app.use(errorHandler);

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Run the server
startServer();

// Unhandled Promise Rejection Handler
process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally exit the process
  // process.exit(1);
});

// Uncaught Exception Handler
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  // Optionally exit the process
  // process.exit(1);
});

export default app;