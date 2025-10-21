import express from 'express';
import { 
    sendReport, 
    getUserReports, 
    getAppointmentReports, 
    getDoctorReports, 
    markReportAsRead 
} from '../controllers/reportController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
import authDoctor from '../middleware/authDoctor.js';

const reportRouter = express.Router();

// Doctor routes - for sending reports
reportRouter.post('/send-report', upload.single('reportFile'), authDoctor, sendReport);
reportRouter.get('/doctor-reports', authDoctor, getDoctorReports);
reportRouter.get('/appointment-reports/:appointmentId', authDoctor, getAppointmentReports);

// User routes - for receiving reports
reportRouter.get('/user-reports', authUser, getUserReports);
reportRouter.post('/mark-read', authUser, markReportAsRead);

export default reportRouter;