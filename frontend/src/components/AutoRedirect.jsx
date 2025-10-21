import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AutoRedirect = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const adminAppUrl = import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:5174'
    const doctorAppUrl = import.meta.env.VITE_DOCTOR_APP_URL || adminAppUrl

    useEffect(() => {
        // Only check for auto-redirect on app load, not on every route change
        if (location.pathname === '/') {
            const userType = localStorage.getItem('userType')
            const userToken = localStorage.getItem('token')
            const adminToken = localStorage.getItem('aToken')
            const doctorToken = localStorage.getItem('dToken')

            console.log('AutoRedirect check:', { userType, hasUserToken: !!userToken, hasAdminToken: !!adminToken, hasDoctorToken: !!doctorToken });

            // Only redirect if tokens are valid and recent (not expired)
            if (userType === 'admin' && adminToken && adminToken !== 'undefined') {
                console.log('Redirecting to admin panel');
                window.location.href = adminAppUrl
            } else if (userType === 'doctor' && doctorToken && doctorToken !== 'undefined') {
                console.log('Redirecting to doctor panel');
                window.location.href = doctorAppUrl
            } else {
                // Clear invalid tokens to prevent future redirects
                if (userType !== 'user') {
                    console.log('Clearing invalid tokens');
                    localStorage.removeItem('userType');
                    localStorage.removeItem('aToken');
                    localStorage.removeItem('dToken');
                }
            }
            // For users or no login, stay on user frontend - no redirect needed
        }
        
        // If user is on login page and already logged in as user, redirect to home
        if (location.pathname === '/login') {
            const userType = localStorage.getItem('userType')
            const userToken = localStorage.getItem('token')
            
            if (userType === 'user' && userToken) {
                navigate('/')
            }
        }
    }, [location.pathname, navigate, adminAppUrl, doctorAppUrl])

    return null // This component doesn't render anything
}

export default AutoRedirect
