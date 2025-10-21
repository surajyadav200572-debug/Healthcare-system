import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { DoctorContext } from '../../context/DoctorContext'

const DoctorsList = () => {

  const { doctors, changeAvailability , aToken , getAllDoctors, removeDoctor} = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  
  // Check if current user is admin (has aToken but no dToken)
  const isAdmin = aToken && !dToken

  useEffect(() => {
    if (aToken) {
        getAllDoctors()
    }
}, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <div className='w-full h-48 bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 flex items-center justify-center overflow-hidden'>
              <img 
                className='w-full h-full object-cover' 
                src={item.image} 
                alt={item.name}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIyNSIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNjAgMTYwQzYwIDEzNy45MDkgNzcuOTA5IDEyMCAxMDAgMTIwUzE0MCAxMzcuOTA5IDE0MCAxNjBINjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='
                }}
              />
            </div>
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
              
              {/* Remove Doctor Button - Only visible to Admin */}
              {isAdmin && (
                <div className='mt-3 pt-3 border-t border-gray-200'>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      removeDoctor(item._id, item.name)
                    }}
                    className='w-full bg-red-50 text-red-600 text-sm py-2 px-3 rounded-md border border-red-200 hover:bg-red-100 hover:text-red-700 transition-all duration-300 flex items-center justify-center gap-2'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                    </svg>
                    Remove Doctor
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList