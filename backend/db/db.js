import mongoose from "mongoose";

const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to db.');
    } catch (error) {
        console.log("Error in connecting to database: ", error.message);
    }
}

export default connectDb;