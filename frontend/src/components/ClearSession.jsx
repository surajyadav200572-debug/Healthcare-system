import { useEffect } from 'react'

const ClearSession = () => {
    useEffect(() => {
        // Clear all auth tokens and user data
        console.log('Clearing all session data...');
        
        localStorage.removeItem('userType');
        localStorage.removeItem('token');
        localStorage.removeItem('aToken');
        localStorage.removeItem('dToken');
        
        console.log('Session cleared. You can now access user frontend normally.');
        
        // Redirect to home page
        const target = import.meta.env.VITE_FRONTEND_URL || window.location.origin
        window.location.href = target.endsWith('/') ? target : target + '/'
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Clearing Session...</h2>
                <p>Please wait while we reset your session data.</p>
            </div>
        </div>
    )
}

export default ClearSession