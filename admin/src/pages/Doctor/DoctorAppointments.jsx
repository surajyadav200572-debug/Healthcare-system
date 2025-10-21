import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import ReportModal from '../../components/ReportModal'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, sendReport } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])
  
  // Handle report button click
  const handleReportClick = (appointment) => {
    setSelectedAppointment(appointment)
    setIsReportModalOpen(true)
  }
  
  // Handle send report
  const handleSendReport = async (appointmentId, reportData, reportFile) => {
    await sendReport(appointmentId, reportData, reportFile)
  }
  
  // Close modal
  const closeModal = () => {
    setIsReportModalOpen(false)
    setSelectedAppointment(null)
  }

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
          <p>Report</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>
            <div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>
                {item.payment?'Online':'CASH'}
              </p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{currency}{item.amount}</p>
            {item.cancelled
              ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : item.isCompleted
                ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                : <div className='flex'>
                  <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                </div>
            }
            {/* Report Button */}
            <div className='text-center'>
              {item.cancelled || item.isCompleted ? (
                <button 
                  className='text-xs px-3 py-1 border rounded bg-gray-200 text-gray-400 cursor-not-allowed'
                  disabled
                >
                  Report
                </button>
              ) : (
                <button 
                  onClick={() => handleReportClick(item)}
                  className='text-xs px-3 py-1 border rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer'
                >
                  Report
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={closeModal}
        appointment={selectedAppointment}
        onSendReport={handleSendReport}
      />

    </div>
  )
}

export default DoctorAppointments