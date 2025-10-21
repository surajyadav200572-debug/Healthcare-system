import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData, setAToken } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)
  
  // Check for token in URL parameters (cross-origin login)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get('token')
    const userType = urlParams.get('type')
    
    if (urlToken && userType === 'admin') {
      console.log('Found admin token in URL parameters:', urlToken.substring(0, 30) + '...')
      
      // Save token to localStorage and context (always update)
      localStorage.setItem('aToken', urlToken)
      localStorage.setItem('userType', 'admin')
      setAToken(urlToken)
      
      // Clean URL (remove parameters)
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)
      
      console.log('Admin token set from URL parameters')
    }
  }, [])

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  // Debug token status
  console.log('Dashboard - aToken:', aToken ? 'Present' : 'Missing')
  console.log('Dashboard - localStorage aToken:', localStorage.getItem('aToken') ? 'Present' : 'Missing')

  // Force token check if not present but localStorage has it
  useEffect(() => {
    const storedToken = localStorage.getItem('aToken')
    if (storedToken && !aToken) {
      console.log('Dashboard forcing token update')
      // Immediate reload if token exists but context doesn't have it
      setTimeout(() => {
        console.log('Reloading dashboard due to token sync issue')
        window.location.reload()
      }, 500)
    }
  }, [])
  
  // Also check when aToken changes
  useEffect(() => {
    const storedToken = localStorage.getItem('aToken')
    console.log('Dashboard aToken changed:', aToken ? 'Present' : 'Missing', 'LocalStorage:', storedToken ? 'Present' : 'Missing')
  }, [aToken])

  // Show loading/auth check until we have a token
  if (!aToken) {
    const storedToken = localStorage.getItem('aToken')
    return (
      <div className='m-5 flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <p className='text-xl text-gray-600'>Loading admin dashboard...</p>
          <p className='text-sm text-gray-500 mt-2'>Please wait while we verify your credentials</p>
          <div className='mt-4 space-y-2 text-xs text-gray-400'>
            <p>Context Token: {aToken ? 'Found' : 'Missing'}</p>
            <p>LocalStorage Token: {storedToken ? 'Found' : 'Missing'}</p>
            <p>UserType: {localStorage.getItem('userType') || 'Not set'}</p>
            <p>All localStorage keys: {Object.keys(localStorage).join(', ')}</p>
            {storedToken && (
              <p>Token Preview: {storedToken.substring(0, 30)}...</p>
            )}
          </div>
          <div className='mt-4 space-x-2'>
            {storedToken && (
              <button 
                onClick={() => window.location.reload()}
                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
              >
                Refresh Page
              </button>
            )}
            <button 
              onClick={() => {
                const token = localStorage.getItem('aToken')
                alert(`Token in localStorage: ${token ? 'Found: ' + token.substring(0, 50) + '...' : 'Not Found'}`)
              }}
              className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700'
            >
              Check Token
            </button>
            <button 
              onClick={() => {
                localStorage.clear()
                alert('localStorage cleared! Redirecting to user site for fresh login.')
                const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'https://your-frontend-url.vercel.app'
                window.location.href = `${frontendUrl}/login`
              }}
              className='bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700'
            >
              Clear & Fresh Login
            </button>
            {!storedToken && (
              <button 
                onClick={() => {
                  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'https://your-frontend-url.vercel.app'
                  window.location.href = `${frontendUrl}/login`
                }}
                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p></div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <img className='rounded-full w-10' src={item.docData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard