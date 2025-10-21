import reportModel from "../models/reportModel.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import { createNotification } from "./notificationController.js";

// API for doctor to send report to patient
const sendReport = async (req, res) => {
    try {
        const { appointmentId, reportTitle, reportContent, reportType } = req.body;
        const reportFile = req.file;
        const doctorId = req.body.docId; // From auth middleware

        // Validate required fields
        if (!appointmentId || !reportTitle || !reportContent) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        // Check if appointment exists and is not completed/cancelled
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointment.cancelled) {
            return res.json({ success: false, message: "Cannot send report for cancelled appointment" });
        }

        if (appointment.isCompleted) {
            return res.json({ success: false, message: "Cannot send report for completed appointment" });
        }

        // Verify doctor owns this appointment
        if (appointment.docId !== doctorId) {
            return res.json({ success: false, message: "Unauthorized: You can only send reports for your appointments" });
        }

        // Get doctor and user data
        const doctorData = await doctorModel.findById(doctorId).select('-password');
        const userData = await userModel.findById(appointment.userId).select('-password');

        if (!doctorData || !userData) {
            return res.json({ success: false, message: "Doctor or User data not found" });
        }

        // Handle file upload to Cloudinary if file is provided
        let reportFileUrl = null;
        if (reportFile) {
            try {
                const uploadResult = await cloudinary.uploader.upload(reportFile.path, {
                    resource_type: "auto", // Supports PDFs, images, etc.
                    folder: "medical_reports"
                });
                reportFileUrl = uploadResult.secure_url;
            } catch (uploadError) {
                console.log("File upload failed:", uploadError.message);
                // Continue without file attachment
            }
        }

        // Create report
        const reportData = {
            appointmentId,
            doctorId,
            userId: appointment.userId,
            doctorName: doctorData.name,
            userName: userData.name,
            userEmail: userData.email,
            reportTitle,
            reportContent,
            reportFile: reportFileUrl,
            reportType: reportType || 'prescription',
            appointmentDate: appointment.slotDate,
            appointmentTime: appointment.slotTime
        };

        const newReport = new reportModel(reportData);
        await newReport.save();

        // Create notification for user
        await createNotification(
            appointment.userId,
            "New Medical Report",
            `Dr. ${doctorData.name} has sent you a new ${reportData.reportType.replace('_', ' ')}: ${reportData.reportTitle}`,
            'report',
            newReport._id,
            doctorData.name,
            {
                text: "View Report",
                link: "/my-reports"
            }
        );

        res.json({ 
            success: true, 
            message: "Report sent successfully to patient",
            reportId: newReport._id
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for patient to get their reports
const getUserReports = async (req, res) => {
    try {
        const { userId } = req.body; // From auth middleware

        const reports = await reportModel.find({ userId }).sort({ dateCreated: -1 });
        
        res.json({ success: true, reports });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for doctor to get reports sent for specific appointment
const getAppointmentReports = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const doctorId = req.body.docId; // From auth middleware

        // Verify doctor owns this appointment
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment || appointment.docId !== doctorId) {
            return res.json({ success: false, message: "Unauthorized access" });
        }

        const reports = await reportModel.find({ appointmentId }).sort({ dateCreated: -1 });
        
        res.json({ success: true, reports });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for doctor to get all reports they have sent
const getDoctorReports = async (req, res) => {
    try {
        const doctorId = req.body.docId; // From auth middleware

        const reports = await reportModel.find({ doctorId }).sort({ dateCreated: -1 });
        
        res.json({ success: true, reports });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark report as read by user
const markReportAsRead = async (req, res) => {
    try {
        const { reportId } = req.body;
        const userId = req.body.userId; // From auth middleware

        // Verify user owns this report
        const report = await reportModel.findById(reportId);
        if (!report || report.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized access" });
        }

        await reportModel.findByIdAndUpdate(reportId, { isRead: true });
        
        res.json({ success: true, message: "Report marked as read" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    sendReport,
    getUserReports,
    getAppointmentReports,
    getDoctorReports,
    markReportAsRead
};