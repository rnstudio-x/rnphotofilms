import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCalendarCheck, FaChevronLeft, FaChevronRight, FaUser,
  FaCheck, FaTimes, FaClock, FaUmbrellaBeach, FaFilter,
  FaChartBar, FaDownload, FaEye, FaPlus, FaHistory,
  FaCheckCircle, FaTimesCircle, FaExclamationCircle
} from 'react-icons/fa'

const AttendanceTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [photographers, setPhotographers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhotographer, setSelectedPhotographer] = useState(null)
  const [viewMode, setViewMode] = useState('mark') // mark, history, stats
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false)
  
  const [markForm, setMarkForm] = useState({
    photographerId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    notes: ''
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwKBxSj_Qb0_Zoo4OZ7EA9tlZhGBRjXfoCwGpmwUFqKhLxV52AcTUmwzkgfecOc3ZT8dg/exec'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch photographers
      const photoResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getPhotographers' })
      })
      const photoResult = await photoResponse.json()
      
      if (photoResult.success) {
        setPhotographers(photoResult.photographers || [])
      }

      // Fetch attendance records
      const attResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getAttendance' })
      })
      const attResult = await attResponse.json()
      
      if (attResult.success) {
        setAttendance(attResult.attendance || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark attendance
  const handleMarkAttendance = async () => {
    if (!markForm.photographerId) {
      alert('⚠️ Please select a photographer!')
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'markAttendance',
          photographerId: markForm.photographerId,
          date: markForm.date,
          status: markForm.status,
          notes: markForm.notes,
          timestamp: new Date().toISOString()
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('✅ Attendance marked successfully!')
        setIsMarkModalOpen(false)
        resetMarkForm()
        fetchData()
      } else {
        alert('❌ Failed to mark attendance: ' + result.error)
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert('❌ Error marking attendance')
    }
  }

  const resetMarkForm = () => {
    setMarkForm({
      photographerId: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      notes: ''
    })
  }

  // Get attendance for specific date and photographer
  const getAttendanceStatus = (photographerId, date) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0]
    const record = attendance.find(
      att => att.photographerId === photographerId && att.date === dateStr
    )
    return record ? record.status : null
  }

  // Calculate monthly stats
  const calculateMonthlyStats = (photographerId) => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    const monthlyRecords = attendance.filter(att => {
      if (att.photographerId !== photographerId) return false
      const attDate = new Date(att.date)
      return attDate >= monthStart && attDate <= monthEnd
    })

    return {
      present: monthlyRecords.filter(r => r.status === 'Present').length,
      absent: monthlyRecords.filter(r => r.status === 'Absent').length,
      halfDay: monthlyRecords.filter(r => r.status === 'Half-Day').length,
      leave: monthlyRecords.filter(r => r.status === 'Leave').length,
      total: monthlyRecords.length
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Present': 'bg-green-100 text-green-800',
      'Absent': 'bg-red-100 text-red-800',
      'Half-Day': 'bg-yellow-100 text-yellow-800',
      'Leave': 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const icons = {
      'Present': <FaCheckCircle className="text-green-600" />,
      'Absent': <FaTimesCircle className="text-red-600" />,
      'Half-Day': <FaExclamationCircle className="text-yellow-600" />,
      'Leave': <FaUmbrellaBeach className="text-blue-600" />
    }
    return icons[status] || null
  }

  // Calendar navigation
  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1))
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading attendance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Attendance Tracker</h1>
              <p className="text-gray-600">Mark and manage photographer attendance</p>
            </div>
            
            <button
              onClick={() => setIsMarkModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
            >
              <FaPlus /> Mark Attendance
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('mark')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'mark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Mark Today
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'stats'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Statistics
            </button>
          </div>
        </div>

        {/* Mark Today View */}
        {viewMode === 'mark' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Today's Attendance</h2>
              <span className="text-lg font-semibold text-blue-600">
                {new Date().toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>

            {photographers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No photographers found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photographers.map((photographer, index) => {
                  const todayStatus = getAttendanceStatus(
                    photographer.id, 
                    new Date().toISOString().split('T')[0]
                  )
                  
                  return (
                    <motion.div
                      key={photographer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {photographer.name?.charAt(0)}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-800">{photographer.name}</h3>
                          <p className="text-sm text-gray-500">{photographer.specialization}</p>
                        </div>
                      </div>

                      {todayStatus ? (
                        <div className={`flex items-center justify-center gap-2 py-3 rounded-lg ${getStatusColor(todayStatus)}`}>
                          {getStatusIcon(todayStatus)}
                          <span className="font-semibold">{todayStatus}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setMarkForm(prev => ({ ...prev, photographerId: photographer.id }))
                            setIsMarkModalOpen(true)
                          }}
                          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          Mark Attendance
                        </button>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* History View */}
        {viewMode === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronLeft />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronRight />
              </button>
            </div>

            {photographers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No photographers found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Photographer</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Present</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Absent</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Half-Day</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Leave</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Total Days</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {photographers.map((photographer, index) => {
                      const stats = calculateMonthlyStats(photographer.id)
                      
                      return (
                        <motion.tr
                          key={photographer.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-semibold text-gray-800">{photographer.name}</p>
                              <p className="text-sm text-gray-500">{photographer.specialization}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                              <FaCheckCircle /> {stats.present}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                              <FaTimesCircle /> {stats.absent}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                              <FaClock /> {stats.halfDay}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                              <FaUmbrellaBeach /> {stats.leave}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-bold text-gray-800">{stats.total}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setSelectedPhotographer(photographer)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              <FaEye className="inline mr-1" /> View
                            </button>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Statistics View */}
        {viewMode === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {photographers.map((photographer, index) => {
              const stats = calculateMonthlyStats(photographer.id)
              const attendanceRate = stats.total > 0 
                ? Math.round((stats.present / stats.total) * 100) 
                : 0
              
              return (
                <motion.div
                  key={photographer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {photographer.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{photographer.name}</h3>
                      <p className="text-gray-600">{photographer.specialization}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Attendance Rate</span>
                      <span className="text-2xl font-bold text-blue-600">{attendanceRate}%</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-600 mb-1">Present</p>
                        <p className="text-2xl font-bold text-green-800">{stats.present}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-600 mb-1">Absent</p>
                        <p className="text-2xl font-bold text-red-800">{stats.absent}</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-600 mb-1">Half-Day</p>
                        <p className="text-2xl font-bold text-yellow-800">{stats.halfDay}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-600 mb-1">Leave</p>
                        <p className="text-2xl font-bold text-blue-800">{stats.leave}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Working Days</span>
                        <span className="text-xl font-bold text-gray-800">{stats.total}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

      </div>

      {/* Mark Attendance Modal */}
      <AnimatePresence>
        {isMarkModalOpen && (
          <MarkAttendanceModal
            photographers={photographers}
            formData={markForm}
            onInputChange={(field, value) => setMarkForm(prev => ({ ...prev, [field]: value }))}
            onSave={handleMarkAttendance}
            onClose={() => {
              setIsMarkModalOpen(false)
              resetMarkForm()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ==================== MARK ATTENDANCE MODAL ====================
const MarkAttendanceModal = ({ photographers, formData, onInputChange, onSave, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Mark Attendance</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Photographer *
            </label>
            <select
              value={formData.photographerId}
              onChange={(e) => onInputChange('photographerId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Select Photographer --</option>
              {photographers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => onInputChange('date', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Present', 'Absent', 'Half-Day', 'Leave'].map(status => (
                <button
                  key={status}
                  onClick={() => onInputChange('status', status)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    formData.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => onInputChange('notes', e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            Save Attendance
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AttendanceTracker
