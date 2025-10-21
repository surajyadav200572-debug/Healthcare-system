import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyReports = () => {

    const { backendUrl, token } = useContext(AppContext)
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Function to format report date
    const formatReportDate = (dateString) => {
        const date = new Date(dateString)
        const day = date.getDate()
        const month = months[date.getMonth()]
        const year = date.getFullYear()
        return `${day} ${month} ${year}`
    }

    // Getting User Reports Data Using API
    const getUserReports = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(backendUrl + '/api/reports/user-reports', { headers: { token } })
            
            if (data.success) {
                setReports(data.reports)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Function to download/view report file
    const downloadReport = (reportFile, reportTitle) => {
        if (reportFile) {
            // Open file in new tab for viewing/downloading
            window.open(reportFile, '_blank')
        } else {
            toast.info('No file attached to this report')
        }
    }

    // Function to mark report as read
    const markAsRead = async (reportId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/reports/mark-read', { reportId }, { headers: { token } })
            if (data.success) {
                // Update local state
                setReports(prev => prev.map(report => 
                    report._id === reportId ? { ...report, isRead: true } : report
                ))
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Function to get report type badge color
    const getReportTypeColor = (type) => {
        switch (type) {
            case 'prescription': return 'bg-blue-100 text-blue-800'
            case 'test_report': return 'bg-green-100 text-green-800'
            case 'medical_note': return 'bg-yellow-100 text-yellow-800'
            case 'discharge_summary': return 'bg-purple-100 text-purple-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    useEffect(() => {
        if (token) {
            getUserReports()
        }
    }, [token])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">Loading reports...</div>
            </div>
        )
    }

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My Reports</p>
            <div className=''>
                {reports.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No reports available</p>
                        <p className="text-sm">Reports from your doctors will appear here</p>
                    </div>
                ) : (
                    reports.map((item, index) => (
                        <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
                            <div className="cursor-pointer" onClick={() => downloadReport(item.reportFile, item.reportTitle)}>
                                {item.reportFile ? (
                                    <div className="w-36 h-36 bg-[#EAEFFF] border-2 border-dashed border-blue-300 flex flex-col items-center justify-center rounded-lg hover:bg-blue-50 transition-all">
                                        {item.reportFile.includes('.pdf') || item.reportType === 'prescription' ? (
                                            <>
                                                <svg className="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-xs text-gray-600">PDF</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-12 h-12 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-xs text-gray-600">IMAGE</span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-36 h-36 bg-gray-100 flex flex-col items-center justify-center rounded-lg">
                                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-xs text-gray-500">TEXT ONLY</span>
                                    </div>
                                )}
                            </div>
                            <div className='flex-1 text-sm text-[#5E5E5E]' onClick={() => !item.isRead && markAsRead(item._id)}>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className='text-[#262626] text-base font-semibold'>{item.reportTitle}</p>
                                    {!item.isRead && (
                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                                    )}
                                    <span className={`text-xs px-2 py-1 rounded-full ${getReportTypeColor(item.reportType)}`}>
                                        {item.reportType.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <p className='text-[#464646] font-medium mt-1'>Sent by: Dr. {item.doctorName}</p>
                                <p className="text-gray-600 mt-2 leading-relaxed">{item.reportContent}</p>
                                <p className=' mt-3'>
                                    <span className='text-sm text-[#3C3C3C] font-medium'>Appointment Date: </span>
                                    {slotDateFormat(item.appointmentDate)} | {item.appointmentTime}
                                </p>
                                <p className=' mt-1'>
                                    <span className='text-sm text-[#3C3C3C] font-medium'>Report Date: </span>
                                    {formatReportDate(item.dateCreated)}
                                </p>
                            </div>
                            <div></div>
                            <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                                {item.reportFile && (
                                    <button 
                                        onClick={() => downloadReport(item.reportFile, item.reportTitle)}
                                        className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'
                                    >
                                        Download Report
                                    </button>
                                )}
                                <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 bg-green-50'>
                                    Medical Report
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MyReports