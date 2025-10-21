import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    try {
        // Only configure Cloudinary if credentials are provided
        if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_SECRET_KEY) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_SECRET_KEY
            });
            console.log("Cloudinary configured successfully");
        } else {
            console.log("Cloudinary credentials not found - running without image upload");
        }
    } catch (error) {
        console.log("Cloudinary configuration error:", error.message);
    }
}

export default connectCloudinary;