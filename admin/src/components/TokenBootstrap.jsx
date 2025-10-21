import { useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'

const TokenBootstrap = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAToken } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const token = urlParams.get('token')
    const type = urlParams.get('type')

    console.log('TokenBootstrap - URL params:', { token: token ? 'Found' : 'Not found', type })

    if (token && type) {
      try {
        if (type === 'admin') {
          console.log('TokenBootstrap - Setting admin token')
          localStorage.setItem('aToken', token)
          localStorage.setItem('userType', 'admin')
          setAToken(token)
          
          // Clean URL and navigate to admin dashboard
          window.history.replaceState({}, document.title, '/admin-dashboard')
          navigate('/admin-dashboard', { replace: true })
          
        } else if (type === 'doctor') {
          console.log('TokenBootstrap - Setting doctor token')
          localStorage.setItem('dToken', token)
          localStorage.setItem('userType', 'doctor')
          setDToken(token)
          
          // Clean URL and navigate to doctor dashboard
          window.history.replaceState({}, document.title, '/doctor-dashboard')
          navigate('/doctor-dashboard', { replace: true })
        }
      } catch (error) {
        console.error('TokenBootstrap error:', error)
      }
    }
  }, [location.search, setAToken, setDToken, navigate])

  return null // This component doesn't render anything
}

export default TokenBootstrap