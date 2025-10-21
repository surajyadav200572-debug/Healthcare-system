import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment, setDToken } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)
  
  // Check for token in URL parameters (cross-origin login)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get('token')
    const userType = urlParams.get('type')
    
    if (urlToken && userType === 'doctor' && !dToken) {
      console.log('Found doctor token in URL parameters:', urlToken.substring(0, 30) + '...')
      
      // Save token to localStorage and context
      localStorage.setItem('dToken', urlToken)
      localStorage.setItem('userType', 'doctor')
      setDToken(urlToken)
      
      // Clean URL (remove parameters)
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)
      
      console.log('Doctor token set from URL parameters')
    }
  }, [])


  useEffect(() => {

    if (dToken) {
      getDashData()
    }

  }, [dToken])

  // Show loading/auth check until we have a token
  if (!dToken) {
    return (
      <div className='m-5 flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <p className='text-xl text-gray-600'>Loading doctor dashboard...</p>
          <p className='text-sm text-gray-500 mt-2'>Please wait while we verify your credentials</p>
        </div>
      </div>
    )
  }

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency} {dashData.earnings}</p>
            <p className='text-gray-400'>Earnings</p>
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
              <img className='rounded-full w-10' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <div className='flex'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DoctorDashboard