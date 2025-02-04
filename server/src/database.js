import mongoose from "mongoose";
const MONGO_URL = process.env.MONGODB_URL;


const connectDB =  () => {
  mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("Error to Connect DB : " , err);
  })
}

export default connectDB;