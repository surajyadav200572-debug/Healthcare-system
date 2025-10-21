import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
    appointmentId: { type: String, required: true },
    doctorId: { type: String, required: true },
    userId: { type: String, required: true },
    doctorName: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    reportTitle: { type: String, required: true },
    reportContent: { type: String, required: true }, // Text content/prescription
    reportFile: { type: String, default: null }, // Cloudinary URL for uploaded file
    reportType: { type: String, enum: ['prescription', 'test_report', 'medical_note', 'discharge_summary'], default: 'prescription' },
    dateCreated: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }, // Track if user has read the report
    // Additional metadata
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true }
})

const reportModel = mongoose.models.report || mongoose.model("report", reportSchema)
export default reportModel