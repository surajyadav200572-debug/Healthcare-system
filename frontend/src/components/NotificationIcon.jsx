import React, { useState, useEffect, useContext, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const NotificationIcon = () => {
    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()
    
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef(null)

    // Get notifications
    const getNotifications = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(backendUrl + '/api/notifications/user-notifications', { headers: { token } })
            
            if (data.success) {
                setNotifications(data.notifications)
                setUnreadCount(data.unreadCount)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/notifications/mark-read', 
                { notificationId }, 
                { headers: { token } }
            )
            
            if (data.success) {
                setNotifications(prev => 
                    prev.map(notif => 
                        notif._id === notificationId ? { ...notif, isRead: true } : notif
                    )
                )
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/notifications/mark-all-read', {}, { headers: { token } })
            
            if (data.success) {
                setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
                setUnreadCount(0)
                toast.success('All notifications marked as read')
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Handle notification click
    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id)
        }
        
        if (notification.actionButton && notification.actionButton.link) {
            navigate(notification.actionButton.link)
            setIsOpen(false)
        }
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now - date
        
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)
        
        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Fetch notifications on mount
    useEffect(() => {
        if (token) {
            getNotifications()
            
            // Refresh notifications every 30 seconds
            const interval = setInterval(getNotifications, 30000)
            return () => clearInterval(interval)
        }
    }, [token])

    if (!token) return null

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Icon */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5-5 5h5zm0 0v-5a3 3 0 00-6 0v5m6 0a3 3 0 01-6 0" />
                </svg>
                
                {/* Red dot for unread notifications */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-64 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5-5 5h5zm0 0v-5a3 3 0 00-6 0v5m6 0a3 3 0 01-6 0" />
                                </svg>
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div 
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                                        !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                                    {notification.title}
                                                </h4>
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            {notification.doctorName && (
                                                <p className="text-xs text-blue-600 mt-1">
                                                    From: Dr. {notification.doctorName}
                                                </p>
                                            )}
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-gray-400">
                                                    {formatDate(notification.createdAt)}
                                                </span>
                                                {notification.actionButton && (
                                                    <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                                                        {notification.actionButton.text}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t text-center">
                            <button 
                                onClick={() => {
                                    navigate('/my-reports')
                                    setIsOpen(false)
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                View All Reports →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default NotificationIcon