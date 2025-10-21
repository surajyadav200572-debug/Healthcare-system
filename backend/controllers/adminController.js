import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        
        // Update each appointment with latest user data including profile image
        const updatedAppointments = await Promise.all(
            appointments.map(async (appointment) => {
                try {
                    // Get latest user data with updated profile image
                    const latestUserData = await userModel.findById(appointment.userId).select('-password')
                    
                    if (latestUserData) {
                        // Update userData with latest information including image
                        appointment.userData = {
                            ...appointment.userData,
                            image: latestUserData.image, // Update with latest profile image
                            name: latestUserData.name,
                            email: latestUserData.email,
                            phone: latestUserData.phone,
                            address: latestUserData.address,
                            dob: latestUserData.dob,
                            gender: latestUserData.gender
                        }
                    }
                    
                    return appointment
                } catch (err) {
                    console.log('Error updating appointment user data:', err)
                    return appointment // Return original if update fails
                }
            })
        )
        
        res.json({ success: true, appointments: updatedAppointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // Default image URL if Cloudinary upload fails
        let imageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAMAAAAJixmgAAAAMFBMVEXk5ueutLfn6eq1ur3o6+zs7+/h4+TZ3N3O0tTV2NrHy868wcPd4OG5vsHBx8rP1Na99gYaAAAD9UlEQVR4nO3c2ZKrIBQF0IsMDuH/f7YXNHbsJN3EhF6c2i+pTlnpWgRkEgjG/nyM/XYBXx4K9B8K9B8K9B8K9B8K9B8K9B8K9B8K9B8K9B8K9B8K9B8K9J9/JjBhf0sgY9nxNFY6lh7Pp4yx8XQ9Tx4/1YiPiWKMVFPkyU/xcIexcA5PobMXUxxa1x05GsLihP4MvudmA9/Ebm/NtQVxxLJLPgGeCa12Pu9rP1xWNgPYZGVvro9TrXyK3AF8CptUH0+FRnJN2ytwJ7ENnNpR27R+KnA3sRVsBq5taDszXoE7ie3gY0d8nA0vwV3ENnAqfOyJr8CdxBbwKbB/KnAs8NIRyUTk8kBcJfCW8/ZGM8Qo50Y8V+D9ZOzYlMDHp/o8jtSrqJZHkA1sBedRxKFdMJSZOBXwfCKL5Cb0fFKnwSBibcH7eF3F0KK9MeVcxBbwtjCIuDRXPRH77q6h9cNcCzjO3cGXBjgWp71lAe+lLOdqGuEHrxz2EBxLlwgMGGLY9jqCJVJgCxhQLBr5A3jrEX6j/wLbfOgvmSZjZQUfvbBrqdY7g6Pn6Tpj2MB+Ltp38PHk9XQ/YwHDsYW6vKqzgY9h9XTjYgEX5WnpHq8mfSUGqNKJx2QbOMTM1WDSDjbe5dxYrVULeGk81Cg8Tfpr8NCNJ7CB95bpKKcw8/oaPNxVsazhcI7Q43SaTavTafSYv8yM9TMzXkfpYYrB5bLAhyyzj0Vt4DBON/J0mVfP84qXO/nrPMpcb7H93gB3mP1ZU/wlzK6fpP6+QN9PFvzvC+zgvyOwi/+KwD7+GwIb+S8I7OTfL7CVf7vAXv7dApv5Nwts598r0MG/VaCHf6dAF/8+gT7+bQKd/LsEevn3CHTzbxDo5/9coKP/Y4Ge/g8Fuvo/Eujr/0Cgs/99gd7+dwW6+98TGO5+JOzsnJNk3x4F0YTlmzMCIuzvE+ju7lrSO0XO9cjE+L79vcABwf5O4BDgdydwELC5EzgM2NoJHAh87gQOBT52AgcDHzqBw4F3ncABwdtO4JDgbSdwUPC6EzgsOHYCM9jfCwyiugQBpklw0U7gsGDmANfAB7hmFODR6NEBrpkH2NJHLVkycIgMXCDDZ8jwGTJ8hgyfIcNnyPAZMnyGDJ8hw2fI8BkyfIYMnyHDZ8jwGTJ8hgyfIcNnyPAZMnyGDJ8hw2fI8BkyfIYMnyGDJ8hw2fI8BkyfIYMnyHDZ8jwGTJ8hgyfIcNnyPAZMnyGDJ8hw2fI8BkyfIYMnyHDZ8jwGTJ8hgyfIcNnyPAZMnyGDJ8hw2fI8BkyfIYMnyHDZ/4FgYz9Bhiyg/PNX8JCAAAAAElFTkSuQmCC';
        
        // Try to upload image if available
        try {
            if (imageFile && imageFile.path) {
                console.log('Uploading image to Cloudinary...');
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
                imageUrl = imageUpload.secure_url;
                console.log('Image uploaded successfully:', imageUrl);
            }
        } catch (error) {
            console.log("Image upload failed, using default image:", error.message);
            // Continue with default image
        }

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        
        // Update latest appointments with current user data including profile images
        const latestAppointmentsWithUpdatedData = await Promise.all(
            appointments.reverse().slice(0, 10).map(async (appointment) => {
                try {
                    const latestUserData = await userModel.findById(appointment.userId).select('-password')
                    
                    if (latestUserData) {
                        appointment.userData = {
                            ...appointment.userData,
                            image: latestUserData.image, // Update with latest profile image
                            name: latestUserData.name,
                            email: latestUserData.email,
                            phone: latestUserData.phone,
                            address: latestUserData.address,
                            dob: latestUserData.dob,
                            gender: latestUserData.gender
                        }
                    }
                    
                    return appointment
                } catch (err) {
                    console.log('Error updating dashboard appointment user data:', err)
                    return appointment
                }
            })
        )

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: latestAppointmentsWithUpdatedData
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to remove/delete doctor (Admin only)
const removeDoctor = async (req, res) => {
    try {
        const { docId } = req.body

        if (!docId) {
            return res.json({ success: false, message: "Doctor ID is required" })
        }

        // Check if doctor exists
        const doctor = await doctorModel.findById(docId)
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" })
        }

        // Check if doctor has any appointments
        const appointments = await appointmentModel.find({ docId })
        
        if (appointments.length > 0) {
            // Check if there are any pending appointments
            const pendingAppointments = appointments.filter(appointment => 
                !appointment.cancelled && !appointment.isCompleted
            )
            
            if (pendingAppointments.length > 0) {
                return res.json({ 
                    success: false, 
                    message: "Cannot remove doctor. There are pending appointments. Please complete or cancel all appointments first." 
                })
            }
        }

        // Remove doctor
        await doctorModel.findByIdAndDelete(docId)
        
        res.json({ success: true, message: "Doctor removed successfully" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
    removeDoctor
}
