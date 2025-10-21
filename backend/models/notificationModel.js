import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['report', 'appointment', 'general'], default: 'general' },
    relatedId: { type: String }, // reportId or appointmentId
    doctorName: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    actionButton: {
        text: { type: String },
        link: { type: String }
    }
})

const notificationModel = mongoose.models.notification || mongoose.model("notification", notificationSchema)
export default notificationModel