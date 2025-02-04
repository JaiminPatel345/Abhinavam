import express from 'express'
import 'dotenv/config'
import {connectRedis} from './redis/redis.js'
import connectDB from "./database.js";

//import routes
import authRouter from './routes/authRoute.js'

//General
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

//redis connect
connectRedis()

//mongodb connect
connectDB()

//routes match
app.use('/auth', authRouter);
app.get("/", (req, res) => {
  res.json({message: "Connected"})
});

app.use((req, res) => {
  res.status(404).json({message: "Not Found"})
})

app.use((err, req, res, next) => {
  console.error(err.stack); // Log error for debugging
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} `);
})