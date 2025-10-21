import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const ReportModal = ({ isOpen, onClose, appointment, onSendReport }) => {
    
    const [reportData, setReportData] = useState({
        reportTitle: '',
        reportContent: '',
        reportType: 'prescription'
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Handle file selection with validation
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            const allowedTypes = [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword',
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp'
            ]
            
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only PDF, DOC/DOCX, and image files (JPG, PNG, GIF, WebP) are allowed')
                return
            }
            
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should not exceed 10MB')
                return
            }
            
            setSelectedFile(file)
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!reportData.reportTitle.trim() || !reportData.reportContent.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        
        try {
            await onSendReport(appointment._id, reportData, selectedFile)
            
            // Reset form
            setReportData({
                reportTitle: '',
                reportContent: '',
                reportType: 'prescription'
            })
            setSelectedFile(null)
            onClose()
            toast.success('Report sent successfully!')
            
        } catch (error) {
            console.error('Error sending report:', error)
            toast.error('Failed to send report')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setReportData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Remove selected file
    const removeFile = () => {
        setSelectedFile(null)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Send Medical Report</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Patient: {appointment?.userData?.name} | {appointment?.slotDate} | {appointment?.slotTime}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Report Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Report Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="reportTitle"
                            value={reportData.reportTitle}
                            onChange={handleInputChange}
                            placeholder="e.g., Blood Test Results, Prescription, X-Ray Report"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Report Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                        <select
                            name="reportType"
                            value={reportData.reportType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="prescription">Prescription</option>
                            <option value="test_report">Test Report</option>
                            <option value="medical_note">Medical Note</option>
                            <option value="discharge_summary">Discharge Summary</option>
                        </select>
                    </div>

                    {/* Report Content/Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description/Notes <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="reportContent"
                            value={reportData.reportContent}
                            onChange={handleInputChange}
                            rows={5}
                            placeholder="Enter detailed description, prescription details, or medical notes..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            required
                        ></textarea>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attach Report File (Optional)
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Supported formats: PDF, DOC/DOCX, Images (JPG, PNG, GIF, WebP). Max size: 10MB
                        </p>
                        
                        {!selectedFile ? (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG, GIF, WebP</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                                />
                            </label>
                        ) : (
                            <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? 'Sending...' : 'Send Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReportModal