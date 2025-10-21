import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // Direct localStorage read with immediate sync
    const getStoredToken = () => {
        const token = localStorage.getItem('aToken')
        console.log('AdminContext getting stored token:', token ? 'Found' : 'Not found')
        return token || ''
    }
    
    const [aToken, setAToken] = useState(() => {
        // Force immediate read on initialization
        const token = localStorage.getItem('aToken')
        console.log('AdminContext initial token:', token ? 'Found' : 'Not found')
        return token || ''
    })

    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Session expired. Please login again.')
                localStorage.removeItem('aToken')
                setAToken('')
            } else {
                toast.error(error.message)
            }
        }

    }

    // Function to change doctor availablity using API
    const changeAvailability = async (docId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to remove doctor using API (Admin only)
    const removeDoctor = async (docId, doctorName) => {
        try {
            // Confirm before removing
            const confirmRemove = window.confirm(
                `Are you sure you want to remove Dr. ${doctorName}?\n\nThis action cannot be undone. The doctor will be permanently removed from the system.`
            )
            
            if (!confirmRemove) {
                return
            }

            const { data } = await axios.post(backendUrl + '/api/admin/remove-doctor', { docId }, { headers: { aToken } })
            
            if (data.success) {
                toast.success(data.message)
                getAllDoctors() // Refresh doctors list
                getDashData() // Refresh dashboard data
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Immediate token sync on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('aToken')
        console.log('AdminContext immediate check on mount:', storedToken ? 'Found' : 'Not found')
        
        if (storedToken && storedToken !== aToken) {
            console.log('Immediate token sync:', storedToken.substring(0, 20) + '...')
            setAToken(storedToken)
        } else if (!storedToken && aToken) {
            console.log('Clearing token on mount as not found in localStorage')
            setAToken('')
        }
        
        // Also force a check after a brief delay to catch any race conditions
        setTimeout(() => {
            const delayedToken = localStorage.getItem('aToken')
            if (delayedToken && delayedToken !== aToken) {
                console.log('Delayed token sync:', delayedToken.substring(0, 20) + '...')
                setAToken(delayedToken)
            }
        }, 100)
    }, [])

    // Monitor localStorage changes for aToken
    useEffect(() => {
        const checkToken = () => {
            const storedToken = localStorage.getItem('aToken')
            
            if (storedToken && storedToken !== 'undefined' && storedToken !== 'null' && storedToken !== aToken) {
                console.log('Setting admin token via monitor:', storedToken.substring(0, 20) + '...')
                setAToken(storedToken)
            } else if (!storedToken && aToken) {
                console.log('Clearing admin token via monitor')
                setAToken('')
            }
        }

        // Set up moderate interval to check for changes
        const interval = setInterval(checkToken, 500)
        
        // Also listen for storage events
        const handleStorageChange = () => {
            setTimeout(checkToken, 100) // Small delay to ensure storage write is complete
        }
        
        window.addEventListener('storage', handleStorageChange)
        
        return () => {
            clearInterval(interval)
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [aToken])

    const value = {
        aToken, setAToken,
        doctors,
        getAllDoctors,
        changeAvailability,
        removeDoctor,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider