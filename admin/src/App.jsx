import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import TokenBootstrap from './components/TokenBootstrap'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  // Debug logging
  console.log('App.jsx - dToken:', dToken ? 'Present' : 'Not found')
  console.log('App.jsx - aToken:', aToken ? 'Present' : 'Not found')
  console.log('App.jsx - localStorage dToken:', localStorage.getItem('dToken') ? 'Present' : 'Not found')
  console.log('App.jsx - localStorage aToken:', localStorage.getItem('aToken') ? 'Present' : 'Not found')

  // Manual sync function for debugging
  const syncTokens = () => {
    const storedAToken = localStorage.getItem('aToken')
    const storedDToken = localStorage.getItem('dToken')
    
    if (storedAToken && !aToken) {
      console.log('Manually syncing aToken')
      // Force context update
      window.location.reload()
    }
    if (storedDToken && !dToken) {
      console.log('Manually syncing dToken')
      window.location.reload()
    }
  }

  // Always show admin panel interface, let individual components handle authentication
  return (
    <div className='bg-[#F8F9FD]'>
      <TokenBootstrap />
      <ToastContainer />
      {(dToken || aToken) && <Navbar />}
      
      {/* Debug sync button - remove in production */}
      {(localStorage.getItem('aToken') || localStorage.getItem('dToken')) && !(dToken || aToken) && (
        <div className='fixed top-4 right-4 z-50'>
          <button 
            onClick={syncTokens}
            className='bg-red-600 text-white px-4 py-2 rounded shadow-lg hover:bg-red-700'
          >
            Sync Tokens (Debug)
          </button>
        </div>
      )}
      
      <div className='flex items-start'>
        {(dToken || aToken) && <Sidebar />}
        <Routes>
          <Route path='/' element={
            aToken ? <Navigate to='/admin-dashboard' replace /> : 
            dToken ? <Navigate to='/doctor-dashboard' replace /> : 
            <Navigate to='/admin-dashboard' replace />
          } />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  )
}

export default App