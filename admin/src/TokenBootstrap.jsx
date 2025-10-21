import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TokenBootstrap() {
  const navigate = useNavigate()

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search)
    const token = qs.get('token')
    const type = qs.get('type')

    if (token && (type === 'admin' || type === 'doctor')) {
      try {
        if (type === 'admin') {
          localStorage.setItem('aToken', token)
          localStorage.setItem('userType', 'admin')
          // Clean URL and navigate
          window.history.replaceState({}, '', '/admin-dashboard')
          navigate('/admin-dashboard', { replace: true })
        } else {
          localStorage.setItem('dToken', token)
          localStorage.setItem('userType', 'doctor')
          window.history.replaceState({}, '', '/doctor-dashboard')
          navigate('/doctor-dashboard', { replace: true })
        }
      } catch (e) {
        // If storage fails, just navigate
        if (type === 'admin') {
          navigate('/admin-dashboard', { replace: true })
        } else {
          navigate('/doctor-dashboard', { replace: true })
        }
      }
    }
  }, [navigate])

  return null
}