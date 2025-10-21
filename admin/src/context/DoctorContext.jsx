import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(() => {
        // Force immediate read on initialization
        const token = localStorage.getItem('dToken')
        console.log('DoctorContext initial token:', token ? 'Found' : 'Not found')
        return token || ''
    })
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    // Getting Doctor appointment data from Database using API
    const getAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })

            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting Doctor profile data from Database using API
    const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
            console.log(data.profileData)
            setProfileData(data.profileData)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel doctor appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // after creating dashboard
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // Later after creating getDashData Function
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })

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

    // Function to send report to patient using API
    const sendReport = async (appointmentId, reportData, reportFile) => {
        try {
            const formData = new FormData()
            formData.append('appointmentId', appointmentId)
            formData.append('reportTitle', reportData.reportTitle)
            formData.append('reportContent', reportData.reportContent)
            formData.append('reportType', reportData.reportType)
            
            if (reportFile) {
                formData.append('reportFile', reportFile)
            }

            const { data } = await axios.post(backendUrl + '/api/reports/send-report', formData, { 
                headers: { 
                    dToken,
                    'Content-Type': 'multipart/form-data'
                } 
            })

            if (data.success) {
                toast.success(data.message)
                getAppointments() // Refresh appointments
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
            throw error
        }
    }

    // Immediate token sync on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('dToken')
        console.log('DoctorContext immediate check on mount:', storedToken ? 'Found' : 'Not found')
        
        if (storedToken && storedToken !== dToken) {
            console.log('Immediate doctor token sync:', storedToken.substring(0, 20) + '...')
            setDToken(storedToken)
        } else if (!storedToken && dToken) {
            console.log('Clearing doctor token on mount as not found in localStorage')
            setDToken('')
        }
        
        // Also force a check after a brief delay to catch any race conditions
        setTimeout(() => {
            const delayedToken = localStorage.getItem('dToken')
            if (delayedToken && delayedToken !== dToken) {
                console.log('Delayed doctor token sync:', delayedToken.substring(0, 20) + '...')
                setDToken(delayedToken)
            }
        }, 100)
    }, [])

    // Monitor localStorage changes for dToken
    useEffect(() => {
        const checkToken = () => {
            const storedToken = localStorage.getItem('dToken')
            if (storedToken && storedToken !== 'undefined' && storedToken !== 'null' && storedToken !== dToken) {
                console.log('Setting doctor token via monitor:', storedToken.substring(0, 20) + '...')
                setDToken(storedToken)
            } else if (!storedToken && dToken) {
                console.log('Clearing doctor token via monitor')
                setDToken('')
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
    }, [dToken])

    const value = {
        dToken, setDToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
        sendReport,
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )


}

export default DoctorContextProvider