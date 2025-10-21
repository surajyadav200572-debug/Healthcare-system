import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"))
        mongoose.connection.on('error', (err) => console.log("Database connection error:", err.message))
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.log("Failed to connect to database:", error.message)
        console.log("App will run without database - some features may not work")
    }
}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.