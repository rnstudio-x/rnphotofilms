import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCalendarAlt, FaMoneyBillWave, FaFileDownload, FaCamera,
  FaMapMarkerAlt, FaClock, FaCheckCircle, FaExclamationCircle,
  FaUser, FaPhone, FaEnvelope, FaSignOutAlt, FaStar,
  FaSpinner, FaHeart, FaImages, FaFilePdf
} from 'react-icons/fa'
import moment from 'moment'

const ClientDashboard = () => {
  const navigate = useNavigate()
  const [clientData, setClientData] = useState(null)
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  const GAS_URL = 'https://script.google.com/macros/s/AKfycby6Ph2hqgkYfoeMu_rIrvPvf0dU-NoG8N8vXACD8O9pWqGvdxFbXZ176XZRhukvaBDUFg/exec'  // ⚠️ Replace with actual URL

  // ✅ Check auth on component mount
  useEffect(() => {
    checkAuth()
  }, [])

  // ✅ Check Authentication
const checkAuth = () => {
  const token = localStorage.getItem('clientToken')
  const data = localStorage.getItem('clientData')
  
  if (!token || !data) {
    navigate('/client/login')
    return
  }
  
  try {
    const parsed = JSON.parse(data)
    console.log('✅ Client data parsed:', parsed)
    setClientData(parsed)
    setLoading(false)
    
    // ✅ Only fetch if ID exists
    if (parsed.id) {
      fetchClientData(parsed.id, token)
    } else {
      console.warn('⚠️ No client ID found, skipping data fetch')
    }
  } catch (error) {
    console.error('❌ Parse error:', error)
    navigate('/client/login')
  }
}


  // ✅ Fetch Client Data from Backend
  const fetchClientData = async (clientId, token) => {
    console.log('📡 Fetching client data for ID:', clientId)
    
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'getClientData',
          clientId: clientId,
          token: token
        })
      })

      const responseText = await response.text()
      const result = JSON.parse(responseText)

      console.log('✅ Client data fetched:', result)

      if (result.success) {
        setEvents(result.events || [])
        setPayments(result.payments || [])
        setStats(result.stats || {})
      } else {
        console.error('❌ Failed to fetch client data:', result.message)
      }
    } catch (error) {
      console.error('❌ Error fetching client data:', error)
    }
  }

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('clientToken')
    localStorage.removeItem('clientData')
    navigate('/client/login')
  }

  // ✅ Submit Feedback
  const handleSubmitFeedback = async () => {
    if (!rating || !feedback.trim()) {
      alert('Please provide rating and feedback')
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'submitClientFeedback',
          clientId: clientData.id,
          clientName: clientData.name,
          rating: rating,
          feedback: feedback
        })
      })

      const responseText = await response.text()
      const result = JSON.parse(responseText)

      if (result.success) {
        alert('Thank you for your feedback! 🎉')
        setShowFeedback(false)
        setRating(0)
        setFeedback('')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback')
    }
  }

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-6xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // ✅ No Data State
  if (!clientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No client data found</p>
          <button
            onClick={() => navigate('/client/login')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-auto">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center" onClick={() => navigate('/client/profile')}>                
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Welcome, {clientData.name}!
                </h1>
                <p className="text-sm text-gray-600">Client Portal</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/client/events')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <FaCalendarAlt className="text-3xl opacity-80" />
              <div className="text-right">
                <p className="text-4xl font-bold">{stats?.totalEvents || 0}</p>
                <p className="text-sm opacity-80">Total Events</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/client/payments')}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <FaMoneyBillWave className="text-3xl opacity-80" />
              <div className="text-right">
                <p className="text-4xl font-bold">
                  ₹{stats?.totalPaid?.toLocaleString('en-IN') || 0}
                </p>
                <p className="text-sm opacity-80">Total Paid</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/client/payments')}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <FaExclamationCircle className="text-3xl opacity-80" />
              <div className="text-right">
                <p className="text-4xl font-bold">
                  ₹{stats?.pendingAmount?.toLocaleString('en-IN') || 0}
                </p>
                <p className="text-sm opacity-80">Pending</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Event Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Event Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaCalendarAlt className="text-blue-600 text-xl mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Event Type</p>
                  <p className="font-semibold text-gray-900">{clientData.eventType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaClock className="text-purple-600 text-xl mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Event Date</p>
                  <p className="font-semibold text-gray-900">
                    {clientData.eventDate ? moment(clientData.eventDate).format('MMMM DD, YYYY') : 'TBD'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-red-600 text-xl mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Venue</p>
                  <p className="font-semibold text-gray-900">{clientData.venue || 'TBD'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaPhone className="text-orange-600 text-xl mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-gray-900">{clientData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaEnvelope className="text-pink-600 text-xl mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{clientData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 text-xl mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-gray-900">{clientData.status}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowFeedback(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <FaStar className="text-4xl text-yellow-500 mb-3 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Give Feedback</h3>
            <p className="text-sm text-gray-600">Share your experience</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <FaFilePdf className="text-4xl text-red-500 mb-3 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Download Contract</h3>
            <p className="text-sm text-gray-600">Get your event contract</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/client/gallery')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <FaImages className="text-4xl text-blue-500 mb-3 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">View Gallery</h3>
            <p className="text-sm text-gray-600">Access your photos</p>
          </motion.button>
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowFeedback(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Your Feedback</h2>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Rate your experience</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                    >
                      <FaStar className={`text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about your experience..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFeedback(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ClientDashboard
