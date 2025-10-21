import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI
    if (!uri) {
        console.log('MONGODB_URI not provided. Skipping DB connection.')
        return
    }

    // Mask password for logs: replace password between ':' and '@' with ****
    const maskedUri = uri.replace(/(\/\/[^:]+:)[^@]+(@)/, '$1*****$2')
    console.log('Attempting to connect to MongoDB:', maskedUri)

    mongoose.connection.on('connected', () => console.log('Database Connected'))
    mongoose.connection.on('error', (err) => console.log('Database connection error:', err.message))

    // Options: fail fast and retry a few times if transient
    const options = {
        serverSelectionTimeoutMS: 10000 // 10s
    }

    const maxAttempts = 3
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`MongoDB connection attempt ${attempt}/${maxAttempts}`)
            await mongoose.connect(uri, options)
            return
        } catch (error) {
            console.log(`MongoDB connect attempt ${attempt} failed:`, error.message)
            if (attempt < maxAttempts) {
                // wait before retrying
                await new Promise(r => setTimeout(r, 2000 * attempt))
            } else {
                console.log('Failed to connect to database after retries:', error.message)
            }
        }
    }
    console.log('App will run without database - some features may not work')
}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.