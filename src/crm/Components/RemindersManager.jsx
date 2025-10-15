import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaBell, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaClock,
  FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaFilter,
  FaPlus, FaEdit, FaTrash, FaEye, FaTimes, FaSave, FaHistory,
  FaChevronLeft, FaChevronRight, FaPaperPlane, FaBirthdayCake,
  FaHeart, FaMoneyBillWave, FaUserFriends
} from 'react-icons/fa'

const RemindersManager = () => {
  // ==================== STATE MANAGEMENT ====================
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [viewMode, setViewMode] = useState('upcoming') // upcoming, all, history
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState(null)
  
  // Form State
  const [reminderForm, setReminderForm] = useState({
    type: 'Follow-up',
    relatedId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    reminderDate: '',
    reminderTime: '10:00',
    message: ''
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyCFoBNyXT8fmTmlG9RwMO7QVgcuaVpgEUynu-hbG4Hl-zVJf09ArlCbSXNhBX9jDUcpg/exec'

  // ==================== DATA FETCHING ====================
  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getReminders' })
      })

      const result = await response.json()

      if (result.success) {
        setReminders(result.reminders || [])
      } else {
        console.error('Failed to fetch reminders:', result.message)
      }
    } catch (error) {
      console.error('Error fetching reminders:', error)
      alert('Failed to load reminders')
    } finally {
      setLoading(false)
    }
  }

  // ==================== REMINDER OPERATIONS ====================
  const handleCreateReminder = async () => {
    if (!reminderForm.clientName || !reminderForm.reminderDate) {
      alert('⚠️ Please fill required fields!')
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'createReminder',
          ...reminderForm
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Reminder created successfully!')
        setIsAddModalOpen(false)
        resetForm()
        fetchReminders()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error creating reminder:', error)
      alert('Failed to create reminder')
    }
  }

  const handleDeleteReminder = async (reminder) => {
    if (!confirm(`Delete reminder for ${reminder.clientName}?`)) return

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'deleteReminder',
          id: reminder.id
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Reminder deleted')
        fetchReminders()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error deleting reminder:', error)
      alert('Failed to delete reminder')
    }
  }

  const resetForm = () => {
    setReminderForm({
      type: 'Follow-up',
      relatedId: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      reminderDate: '',
      reminderTime: '10:00',
      message: ''
    })
  }

  // ==================== HELPER FUNCTIONS ====================
  const getReminderTypeIcon = (type) => {
    const icons = {
      'Follow-up': FaUserFriends,
      'Event': FaCalendarAlt,
      'Payment': FaMoneyBillWave,
      'Birthday': FaBirthdayCake,
      'Anniversary': FaHeart
    }
    return icons[type] || FaBell
  }

  const getReminderTypeColor = (type) => {
    const colors = {
      'Follow-up': 'bg-blue-500',
      'Event': 'bg-purple-500',
      'Payment': 'bg-green-500',
      'Birthday': 'bg-pink-500',
      'Anniversary': 'bg-red-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Sent': 'bg-green-100 text-green-800',
      'Failed': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': FaClock,
      'Sent': FaCheckCircle,
      'Failed': FaTimesCircle
    }
    return icons[status] || FaExclamationCircle
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const isUpcoming = (reminder) => {
    if (reminder.status !== 'Pending') return false
    const reminderDate = new Date(reminder.reminderDate)
    const now = new Date()
    return reminderDate >= now
  }

  const isPast = (reminder) => {
    const reminderDate = new Date(reminder.reminderDate)
    const now = new Date()
    return reminderDate < now
  }

  // ==================== FILTERED DATA ====================
  const filteredReminders = reminders.filter(reminder => {
    // Type filter
    if (filterType !== 'All' && reminder.type !== filterType) return false
    
    // Status filter
    if (filterStatus !== 'All' && reminder.status !== filterStatus) return false
    
    // View mode filter
    if (viewMode === 'upcoming' && !isUpcoming(reminder)) return false
    if (viewMode === 'history' && reminder.status === 'Pending') return false
    
    return true
  })

  // Sort by date
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    return new Date(b.reminderDate) - new Date(a.reminderDate)
  })

  // ==================== STATISTICS ====================
  const stats = {
    total: reminders.length,
    pending: reminders.filter(r => r.status === 'Pending').length,
    sent: reminders.filter(r => r.status === 'Sent').length,
    upcoming: reminders.filter(r => isUpcoming(r)).length
  }

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reminders...</p>
        </div>
      </div>
    )
  }

  // ==================== RENDER ====================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <FaBell className="text-blue-600" />
          Reminders Manager
        </h1>
        <p className="text-gray-600">Manage automated reminders for follow-ups, events, and payments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <FaBell className="text-3xl opacity-80 mb-2" />
          <h3 className="text-2xl font-bold mb-1">{stats.total}</h3>
          <p className="text-blue-100 text-sm">Total Reminders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg"
        >
          <FaClock className="text-3xl opacity-80 mb-2" />
          <h3 className="text-2xl font-bold mb-1">{stats.pending}</h3>
          <p className="text-yellow-100 text-sm">Pending</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <FaCheckCircle className="text-3xl opacity-80 mb-2" />
          <h3 className="text-2xl font-bold mb-1">{stats.sent}</h3>
          <p className="text-green-100 text-sm">Sent</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <FaCalendarAlt className="text-3xl opacity-80 mb-2" />
          <h3 className="text-2xl font-bold mb-1">{stats.upcoming}</h3>
          <p className="text-purple-100 text-sm">Upcoming</p>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('upcoming')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                viewMode === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                viewMode === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              History
            </button>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Event">Event</option>
              <option value="Payment">Payment</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Sent">Sent</option>
              <option value="Failed">Failed</option>
            </select>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaPlus />
              Add Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {sortedReminders.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reminders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Reminder Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Message</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedReminders.map((reminder, index) => {
                  const TypeIcon = getReminderTypeIcon(reminder.type)
                  const StatusIcon = getStatusIcon(reminder.status)
                  
                  return (
                    <motion.tr
                      key={reminder.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-gray-50 transition-colors ${
                        isPast(reminder) && reminder.status === 'Pending' ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 ${getReminderTypeColor(reminder.type)} rounded-lg`}>
                            <TypeIcon className="text-white" />
                          </div>
                          <span className="font-medium text-gray-900">{reminder.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{reminder.clientName}</div>
                          {reminder.clientEmail && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <FaEnvelope className="text-xs" />
                              {reminder.clientEmail}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400" />
                          <span className="text-gray-900">{formatDate(reminder.reminderDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <FaClock className="text-gray-400 text-xs" />
                          <span className="text-sm text-gray-500">{reminder.reminderTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{reminder.message}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                            <StatusIcon />
                            {reminder.status}
                          </span>
                        </div>
                        {reminder.sentAt && (
                          <div className="text-xs text-gray-500 text-center mt-1">
                            {formatDateTime(reminder.sentAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedReminder(reminder)
                              setIsViewModalOpen(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {reminder.status === 'Pending' && (
                            <button
                              onClick={() => handleDeleteReminder(reminder)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD REMINDER MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaPlus />
                      Create Reminder
                    </h2>
                    <p className="text-blue-100 mt-1">Schedule a new reminder</p>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Type *
                    </label>
                    <select
                      value={reminderForm.type}
                      onChange={(e) => setReminderForm({...reminderForm, type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Follow-up">Follow-up</option>
                      <option value="Event">Event</option>
                      <option value="Payment">Payment</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={reminderForm.clientName}
                      onChange={(e) => setReminderForm({...reminderForm, clientName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter client name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={reminderForm.clientEmail}
                      onChange={(e) => setReminderForm({...reminderForm, clientEmail: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="client@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={reminderForm.clientPhone}
                      onChange={(e) => setReminderForm({...reminderForm, clientPhone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Date *
                    </label>
                    <input
                      type="date"
                      value={reminderForm.reminderDate}
                      onChange={(e) => setReminderForm({...reminderForm, reminderDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Time
                    </label>
                    <input
                      type="time"
                      value={reminderForm.reminderTime}
                      onChange={(e) => setReminderForm({...reminderForm, reminderTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={reminderForm.message}
                    onChange={(e) => setReminderForm({...reminderForm, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Enter reminder message..."
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCreateReminder}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    Create Reminder
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW REMINDER MODAL */}
      <AnimatePresence>
        {isViewModalOpen && selectedReminder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
            >
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Reminder Details</h2>
                    <p className="text-indigo-100 mt-1">{selectedReminder.type}</p>
                  </div>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Client Name</label>
                      <p className="font-semibold text-gray-900">{selectedReminder.clientName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Type</label>
                      <p className="font-semibold text-gray-900">{selectedReminder.type}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-semibold text-gray-900">{selectedReminder.clientEmail || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-semibold text-gray-900">{selectedReminder.clientPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Reminder Date</label>
                      <p className="font-semibold text-gray-900">{formatDate(selectedReminder.reminderDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Time</label>
                      <p className="font-semibold text-gray-900">{selectedReminder.reminderTime}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReminder.status)}`}>
                        {selectedReminder.status}
                      </span>
                    </div>
                    {selectedReminder.sentAt && (
                      <div>
                        <label className="text-sm text-gray-600">Sent At</label>
                        <p className="font-semibold text-gray-900">{formatDateTime(selectedReminder.sentAt)}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Message</label>
                    <div className="bg-gray-50 p-4 rounded-lg mt-2">
                      <p className="text-gray-900">{selectedReminder.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default RemindersManager
