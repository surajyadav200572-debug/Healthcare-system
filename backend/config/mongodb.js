import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI
    try {
        // Mask password for logs: replace password between ':' and '@' with ****
        const maskedUri = uri ? uri.replace(/(\/\/[^:]+:)[^@]+(@)/, '$1*****$2') : 'MONGODB_URI not set'
        console.log('Attempting to connect to MongoDB:', maskedUri)

        mongoose.connection.on('connected', () => console.log('Database Connected'))
        mongoose.connection.on('error', (err) => console.log('Database connection error:', err.message))

        // Provide sensible options and a shorter server selection timeout to fail fast
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000 // 10s
        }

        await mongoose.connect(uri, options)
    } catch (error) {
        console.log('Failed to connect to database:', error.message)
        console.log('App will run without database - some features may not work')
    }
}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.