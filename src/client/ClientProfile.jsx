import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaEdit, FaSave, FaTimes, FaCamera, FaBell, FaLock,
  FaCheckCircle, FaCalendarAlt, FaHeart
} from 'react-icons/fa'
import moment from 'moment'

const ClientProfile = () => {
  const navigate = useNavigate()
  const [clientData, setClientData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycby6Ph2hqgkYfoeMu_rIrvPvf0dU-NoG8N8vXACD8O9pWqGvdxFbXZ176XZRhukvaBDUFg/exec'

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('clientToken')
    const data = localStorage.getItem('clientData')
    
    if (!token || !data) {
      navigate('/client/login')
      return
    }
    
    try {
      const parsed = JSON.parse(data)
      setClientData(parsed)
      setEditData(parsed)
      setLoading(false)
    } catch (error) {
      console.error('Auth error:', error)
      navigate('/client/login')
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(clientData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(clientData)
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      // Update localStorage
      localStorage.setItem('clientData', JSON.stringify(editData))
      setClientData(editData)
      
      // TODO: Send update to backend
      // const response = await fetch(GAS_URL, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     action: 'updateClientProfile',
      //     clientId: editData.id,
      //     data: editData
      //   })
      // })

      setTimeout(() => {
        setSaving(false)
        setIsEditing(false)
        alert('Profile updated successfully! ✅')
      }, 1000)
      
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaving(false)
      alert('Failed to update profile')
    }
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-auto">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/client/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaArrowLeft className="text-xl text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <p className="text-sm text-gray-600">Manage your account settings</p>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <FaEdit />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                >
                  <FaSave />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="text-6xl text-blue-600" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                  <FaCamera className="text-white" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">{clientData.name}</h2>
              <div className="flex flex-col md:flex-row gap-4 text-sm opacity-90">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <FaPhone />
                  <span>{clientData.phone}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <FaEnvelope />
                  <span>{clientData.email}</span>
                </div>
              </div>
              
              {clientData.createdAt && (
                <p className="text-sm opacity-75 mt-3">
                  Member since {moment(clientData.createdAt).format('MMMM YYYY')}
                </p>
              )}
            </div>

            {/* Status Badge */}
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              <div className="text-center">
                <FaCheckCircle className="text-3xl mx-auto mb-2" />
                <p className="text-sm font-semibold">Verified Client</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaUser className="text-blue-600" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-semibold px-4 py-3 bg-gray-50 rounded-lg">
                  {clientData.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-semibold px-4 py-3 bg-gray-50 rounded-lg">
                  {clientData.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-semibold px-4 py-3 bg-gray-50 rounded-lg">
                  {clientData.email}
                </p>
              )}
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <p className="text-gray-900 font-semibold px-4 py-3 bg-gray-50 rounded-lg">
                {clientData.eventType}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Event Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-purple-600" />
            Event Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
              <p className="text-gray-900 font-semibold px-4 py-3 bg-gray-50 rounded-lg">
                {clientData.eventDate 
                  ? moment(clientData.eventDate).format('MMMM DD, YYYY')
                  : 'Not scheduled yet'}
              </p>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.venue || ''}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  placeholder="Enter venue name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-semibold px-4 py-3 bg-gray-50 rounded-lg">
                  {clientData.venue || 'To be decided'}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <p className="text-gray-900 font-semibold px-4 py-3 bg-gray-50 rounded-lg">
                {clientData.status}
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Amount
              </label>
              <p className="text-gray-900 font-semibold px-4 py-3 bg-gray-50 rounded-lg">
                ₹{parseFloat(clientData.amount || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Settings & Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaBell className="text-orange-600" />
            Preferences & Settings
          </h3>

          <div className="space-y-4">
            {/* Notification Preferences */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FaBell className="text-blue-600 text-xl" />
                <div>
                  <p className="font-semibold text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Password Change */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FaLock className="text-purple-600 text-xl" />
                <div>
                  <p className="font-semibold text-gray-900">Security</p>
                  <p className="text-sm text-gray-600">Change your password</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-semibold"
              >
                Change
              </button>
            </div>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl shadow-lg p-8 text-center"
        >
          <FaHeart className="text-5xl text-pink-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You for Choosing Us!</h3>
          <p className="text-gray-600 mb-4">
            We're committed to capturing your special moments perfectly.
          </p>
          <p className="text-sm text-gray-500">
            Client ID: {clientData.id} • Joined: {moment(clientData.createdAt).format('MMM YYYY')}
          </p>
        </motion.div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ClientProfile
