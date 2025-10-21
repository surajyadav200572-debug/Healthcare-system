import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Login')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  // Target admin/doctor panel URLs from env (fallback to localhost for dev)
  const adminAppUrl = import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:5174'
  const doctorAppUrl = import.meta.env.VITE_DOCTOR_APP_URL || adminAppUrl

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        
        if (data.success) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('userType', 'user')
          setToken(data.token)
          toast.success('Account created successfully!')
          navigate('/')
        } else {
          toast.error(data.message)
        }

      } else if (state === 'Admin') {
        console.log('=== ADMIN LOGIN START ===')
        console.log('Email:', email)
        console.log('Password length:', password.length)
        console.log('Backend URL:', backendUrl)
        
        try {
          const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
          console.log('=== ADMIN LOGIN RESPONSE ===')
          console.log('Full response:', data)
          console.log('Success:', data.success)
          console.log('Token exists:', !!data.token)
          if (data.token) {
            console.log('Token length:', data.token.length)
            console.log('Token preview:', data.token.substring(0, 50) + '...')
          }
          
          if (data.success) {
            console.log('=== STORING TOKEN ===')
            // Clear any existing tokens
            localStorage.removeItem('token')
            localStorage.removeItem('dToken')
            console.log('Cleared previous tokens')
            
            // Set admin token and type
            localStorage.setItem('aToken', data.token)
            localStorage.setItem('userType', 'admin')
            console.log('Stored aToken:', localStorage.getItem('aToken') ? 'SUCCESS' : 'FAILED')
            console.log('Stored userType:', localStorage.getItem('userType'))
            
            // Verify storage
            const storedToken = localStorage.getItem('aToken')
            console.log('Verification - Token in localStorage:', !!storedToken)
            if (storedToken) {
              console.log('Stored token preview:', storedToken.substring(0, 50) + '...')
            }
            
            toast.success('Admin login successful!')
            console.log('=== REDIRECTING ===')
            
            // Redirect to admin panel with token in URL for cross-origin access
            setTimeout(() => {
              console.log('About to redirect to admin panel')
              console.log('Final token check before redirect:', localStorage.getItem('aToken') ? 'PRESENT' : 'MISSING')
              const redirectUrl = `${adminAppUrl}?token=${encodeURIComponent(data.token)}&type=admin`
              console.log('Redirect URL:', redirectUrl)
              window.location.href = redirectUrl
            }, 1000)
          } else {
            console.error('=== ADMIN LOGIN FAILED ===')
            console.error('Error message:', data.message)
            toast.error(data.message)
          }
        } catch (apiError) {
          console.error('=== ADMIN LOGIN API ERROR ===')
          console.error('Error:', apiError)
          throw apiError
        }

      } else if (state === 'Doctor') {
        console.log('Attempting doctor login with:', email)
        
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        console.log('Doctor login response:', data)
        
        if (data.success) {
          console.log('Doctor login successful, token received:', data.token ? 'Yes' : 'No')
          // Clear any existing tokens
          localStorage.removeItem('token')
          localStorage.removeItem('aToken')
          // Set doctor token and type
          localStorage.setItem('dToken', data.token)
          localStorage.setItem('userType', 'doctor')
          console.log('Doctor token saved to localStorage:', localStorage.getItem('dToken') ? 'Success' : 'Failed')
          toast.success('Doctor login successful!')
          // Redirect to doctor panel with token in URL for cross-origin access
          setTimeout(() => {
            console.log('Redirecting to doctor panel')
            const redirectUrl = `${doctorAppUrl}?token=${encodeURIComponent(data.token)}&type=doctor`
            console.log('Doctor redirect URL:', redirectUrl)
            window.location.href = redirectUrl
          }, 500)
        } else {
          console.error('Doctor login failed:', data.message)
          toast.error(data.message)
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        
        if (data.success) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('userType', 'user')
          setToken(data.token)
          toast.success('Login successful!')
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      toast.error('Login failed. Please try again.')
    }

  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>
          {state === 'Sign Up' ? 'Create Account' : 
           state === 'Admin' ? 'Admin Login' : 
           state === 'Doctor' ? 'Doctor Login' : 'Login'}
        </p>
        <p>
          {state === 'Sign Up' ? 'Please sign up to book appointment' : 
           state === 'Admin' ? 'Please log in as admin' : 
           state === 'Doctor' ? 'Please log in as doctor' :
           'Please log in to book appointment'}
        </p>
        {state === 'Sign Up'
          ? <div className='w-full '>
            <p>Full Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
          </div>
          : null
        }
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
          {state === 'Sign Up' ? 'Create Account' : 
           state === 'Admin' ? 'Login as Admin' : 
           state === 'Doctor' ? 'Login as Doctor' : 'Login as User'}
        </button>
        
        {/* Login Type Selection Buttons */}
        <div className='w-full'>
          <p className='text-center text-gray-600 mb-3'>Or choose login type:</p>
          <div className='grid grid-cols-3 gap-2 mb-4'>
            <button 
              type="button"
              onClick={() => setState('Login')}
              className={`py-2 px-3 text-xs rounded border transition-all ${
                state === 'Login' 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              User Login
            </button>
            <button 
              type="button"
              onClick={() => setState('Admin')}
              className={`py-2 px-3 text-xs rounded border transition-all ${
                state === 'Admin' 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Admin Login
            </button>
            <button 
              type="button"
              onClick={() => setState('Doctor')}
              className={`py-2 px-3 text-xs rounded border transition-all ${
                state === 'Doctor' 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Doctor Login
            </button>
          </div>
        </div>
        
        {/* Create Account Link */}
        {state !== 'Sign Up' && (
          <div className='w-full text-center'>
            <p className='text-sm text-gray-600'>
              Don't have an account? 
              <span 
                onClick={() => setState('Sign Up')} 
                className='text-primary underline cursor-pointer ml-1 hover:text-blue-700'
              >
                Create Account
              </span>
            </p>
          </div>
        )}
        
        {/* Back to Login Link */}
        {state === 'Sign Up' && (
          <div className='w-full text-center'>
            <p className='text-sm text-gray-600'>
              Already have an account? 
              <span 
                onClick={() => setState('Login')} 
                className='text-primary underline cursor-pointer ml-1 hover:text-blue-700'
              >
                Login here
              </span>
            </p>
          </div>
        )}
      </div>
    </form>
  )
}

export default Login