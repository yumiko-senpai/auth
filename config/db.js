import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("connected to db")
    }
    catch (err) {
        console.error(err.message)
    }
};

export default connectDB