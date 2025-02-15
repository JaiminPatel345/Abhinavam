var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/server.ts
import express from 'express';
import 'dotenv/config';
import { connectRedis } from './redis/redis.js';
import connectDB from "./database.js";
// Import routes
import authRouter from './routes/authRoute.js';
import tokenRoute from "./routes/tokenRoute.js";
import postRoute from "./routes/postRoute.js";
import commentRoute from "./routes/commentRoute.js";
import { formatResponse } from "./types/custom.types.js";
import userRoute from "./routes/userRoute.js";
// Create Express app
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3003;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Database connections
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to Redis
        connectRedis();
        // Connect to MongoDB
        connectDB();
        // Routes
        app.use('/comments', commentRoute);
        app.use('/posts', postRoute);
        app.use('/tokens', tokenRoute);
        app.use('/auth', authRouter);
        app.use('/users', userRoute);
        // Health check route
        app.get("/", (req, res) => {
            res.json({ message: "Connected" });
        });
        // 404 Handler
        app.use((req, res) => {
            res.status(404).json(formatResponse(false, "Not Route Found"));
            return;
        });
        // Error handling middleware
        const errorHandler = (error, req, res, next) => {
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
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
// Run the server
startServer();
// Unhandled Promise Rejection Handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optionally exit the process
    // process.exit(1);
});
// Uncaught Exception Handler
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Optionally exit the process
    // process.exit(1);
});
export default app;
//# sourceMappingURL=server.js.map