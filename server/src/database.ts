import mongoose from "mongoose";


const connectDB =  () => {
  mongoose.connect(process.env.MONGODB_URL as string).then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("Error to Connect DB : " , err);
  })
}

export default connectDB;