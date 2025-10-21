import express from 'express';
import { 
    getUserNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification 
} from '../controllers/notificationController.js';
import authUser from '../middleware/authUser.js';

const notificationRouter = express.Router();

// User routes - for managing notifications
notificationRouter.get('/user-notifications', authUser, getUserNotifications);
notificationRouter.post('/mark-read', authUser, markNotificationAsRead);
notificationRouter.post('/mark-all-read', authUser, markAllNotificationsAsRead);
notificationRouter.post('/delete', authUser, deleteNotification);

export default notificationRouter;