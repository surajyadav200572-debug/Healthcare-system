import notificationModel from "../models/notificationModel.js";

// API to get user notifications
const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.body; // From auth middleware

        const notifications = await notificationModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20); // Get latest 20 notifications

        // Count unread notifications
        const unreadCount = await notificationModel.countDocuments({ userId, isRead: false });

        res.json({ 
            success: true, 
            notifications,
            unreadCount 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        const userId = req.body.userId; // From auth middleware

        // Verify notification belongs to user
        const notification = await notificationModel.findById(notificationId);
        if (!notification || notification.userId !== userId) {
            return res.json({ success: false, message: "Notification not found" });
        }

        await notificationModel.findByIdAndUpdate(notificationId, { isRead: true });
        
        res.json({ success: true, message: "Notification marked as read" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.body.userId; // From auth middleware

        await notificationModel.updateMany({ userId, isRead: false }, { isRead: true });
        
        res.json({ success: true, message: "All notifications marked as read" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to delete notification
const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.body;
        const userId = req.body.userId; // From auth middleware

        // Verify notification belongs to user
        const notification = await notificationModel.findById(notificationId);
        if (!notification || notification.userId !== userId) {
            return res.json({ success: false, message: "Notification not found" });
        }

        await notificationModel.findByIdAndDelete(notificationId);
        
        res.json({ success: true, message: "Notification deleted" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Helper function to create notification (used by other controllers)
const createNotification = async (userId, title, message, type = 'general', relatedId = null, doctorName = null, actionButton = null) => {
    try {
        const notificationData = {
            userId,
            title,
            message,
            type,
            relatedId,
            doctorName,
            actionButton
        };

        const notification = new notificationModel(notificationData);
        await notification.save();
        
        return notification;
    } catch (error) {
        console.log('Error creating notification:', error);
        return null;
    }
};

export {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    createNotification
};