import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken, dToken } = useContext(DoctorContext)
  const { setAToken, aToken } = useContext(AdminContext)
  const navigate = useNavigate()

  // Debug token changes
  useEffect(() => {
    console.log('Login.jsx - Token changes detected:')
    console.log('aToken:', aToken ? 'Found (' + aToken.substring(0, 20) + '...)' : 'Not found')
    console.log('dToken:', dToken ? 'Found (' + dToken.substring(0, 20) + '...)' : 'Not found')
    console.log('localStorage aToken:', localStorage.getItem('aToken') ? 'Found' : 'Not found')
    console.log('localStorage dToken:', localStorage.getItem('dToken') ? 'Found' : 'Not found')
  }, [aToken, dToken])

  // Check if already logged in
  useEffect(() => {
    if (aToken && state === 'Admin') {
      console.log('Already logged in as admin, navigating to dashboard')
      navigate('/admin-dashboard')
    } else if (dToken && state === 'Doctor') {
      console.log('Already logged in as doctor, navigating to dashboard')
      navigate('/doctor-dashboard')
    }
  }, [aToken, dToken, state, navigate])

  const onSubmitHandler = async (event) => {
    console.log('Login button clicked!');
    
    // Prevent any default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('=== LOGIN ATTEMPT STARTED ===')
    console.log('State:', state)
    console.log('Email:', email)
    console.log('Backend URL:', backendUrl)

    if (state === 'Admin') {
      try {
        console.log('Making admin login API call...')
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        
        console.log('API Response:', data)
        
        if (data.success) {
          console.log('Login successful! Token received:', data.token ? data.token.substring(0, 20) + '...' : 'No token')
          
          // Save to localStorage with error handling
          console.log('Saving token to localStorage...')
          console.log('Token to save:', data.token ? data.token.substring(0, 30) + '...' : 'No token')
          
          try {
            // Clear any existing tokens first
            localStorage.removeItem('aToken')
            localStorage.removeItem('dToken')
            localStorage.removeItem('userType')
            
            // Set new token
            localStorage.setItem('aToken', data.token)
            localStorage.setItem('userType', 'admin')
            
            console.log('localStorage.setItem completed')
            
            // Immediate verification
            const savedToken = localStorage.getItem('aToken')
            console.log('VERIFICATION - localStorage.getItem result:', savedToken ? 'Found (' + savedToken.length + ' chars)' : 'NOT FOUND!')
            
            if (!savedToken) {
              console.error('CRITICAL ERROR: Token not saved to localStorage!')
              alert('Token storage failed! Please check browser settings.')
              return
            }
            
            // Double check with different method
            const allKeys = Object.keys(localStorage)
            console.log('All localStorage keys:', allKeys)
            console.log('localStorage length:', localStorage.length)
            
          } catch (error) {
            console.error('localStorage error:', error)
            alert('localStorage not available: ' + error.message)
            return
          }
          
          // Set token in context AFTER localStorage
          console.log('Setting token in AdminContext...')
          setAToken(data.token)
          
          toast.success('Admin login successful!')
          
          // Navigate immediately without timeout
          console.log('Navigating to admin dashboard...')
          navigate('/admin-dashboard', { replace: true })
          
        } else {
          console.log('Login failed:', data.message)
          toast.error(data.message)
        }
      } catch (error) {
        console.error('Login error:', error)
        toast.error('Login failed. Please try again.')
      }

    } else {
      try {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          localStorage.setItem('dToken', data.token)
          localStorage.setItem('userType', 'doctor')
          setDToken(data.token)
          toast.success('Doctor login successful!')
          navigate('/doctor-dashboard', { replace: true })
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.error('Doctor login error:', error)
        toast.error('Login failed. Please try again.')
      }
    }
  }

  return (
    <div className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button onClick={onSubmitHandler} className='bg-primary text-white w-full py-2 rounded-md text-base' type='button'>Login</button>
        {
          state === 'Admin'
            ? <p>Doctor Login? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Click here</span></p>
            : <p>Admin Login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </div>
  )
}

export default Login