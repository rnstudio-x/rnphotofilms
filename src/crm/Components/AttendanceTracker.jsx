import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCalendarCheck, FaChevronLeft, FaChevronRight, FaUser,
  FaCheck, FaTimes, FaClock, FaUmbrellaBeach, FaFilter,
  FaChartBar, FaDownload, FaEye, FaPlus, FaHistory,
  FaCheckCircle, FaTimesCircle, FaExclamationCircle,
  FaEdit, FaTrash, FaSave, FaCalendarAlt
} from 'react-icons/fa'

const AttendanceTracker = () => {
  // ==================== STATE MANAGEMENT ====================
  const [currentDate, setCurrentDate] = useState(new Date())
  const [photographers, setPhotographers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhotographer, setSelectedPhotographer] = useState(null)
  const [viewMode, setViewMode] = useState('mark')
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isStatsDetailModalOpen, setIsStatsDetailModalOpen] = useState(false)
  const [statsDetailType, setStatsDetailType] = useState('')
  
  const [markForm, setMarkForm] = useState({
    photographerId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    notes: ''
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyCFoBNyXT8fmTmlG9RwMO7QVgcuaVpgEUynu-hbG4Hl-zVJf09ArlCbSXNhBX9jDUcpg/exec'

  // ==================== DATA FETCHING ====================
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const photoResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getPhotographers' })
      })
      const photoResult = await photoResponse.json()
      
      if (photoResult.success) {
        setPhotographers(photoResult.photographers || [])
      }

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
      alert('Failed to load data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  // ==================== DUPLICATE CHECK ====================
  const checkDuplicateAttendance = (photographerId, date) => {
    if (!photographerId || !date) return false
    if (!Array.isArray(attendance) || attendance.length === 0) return false
    
    let inputDateStr
    try {
      inputDateStr = new Date(date).toISOString().split('T')[0]
    } catch {
      return false
    }
    
    for (let i = 0; i < attendance.length; i++) {
      const record = attendance[i]
      
      if (record.photographerId !== photographerId) continue
      if (!record.date) continue
      
      try {
        let recordDateStr
        
        if (typeof record.date === 'string') {
          recordDateStr = record.date.substring(0, 10)
        } else {
          recordDateStr = new Date(record.date).toISOString().split('T')[0]
        }
        
        if (recordDateStr === inputDateStr) {
          return true
        }
      } catch (err) {
        console.warn('Skipping invalid date:', record.date)
        continue
      }
    }
    
    return false
  }

  // ==================== MARK ATTENDANCE ====================
  const handleMarkAttendance = async () => {
    if (!markForm.photographerId) {
      alert('⚠️ Please select a photographer!')
      return
    }

    if (checkDuplicateAttendance(markForm.photographerId, markForm.date)) {
      alert('⚠️ Attendance Already Marked!\n\nAttendance for this photographer on this date is already recorded.\n\nPlease select a different date or photographer.')
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
        alert('⚠️ ' + result.message)
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert('❌ Error marking attendance. Please try again.')
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

  // ==================== HELPER FUNCTIONS ====================
  const getAttendanceStatus = (photographerId, date) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0]
    const record = attendance.find(
      att => att.photographerId === photographerId && att.date?.substring(0, 10) === dateStr
    )
    return record ? record.status : null
  }

  const getPhotographerHistory = (photographerId) => {
    return attendance
      .filter(att => att.photographerId === photographerId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const calculateMonthlyStats = (photographerId) => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    const monthlyRecords = attendance.filter(att => {
      if (att.photographerId !== photographerId) return false
      try {
        const attDate = new Date(att.date)
        return attDate >= monthStart && attDate <= monthEnd
      } catch {
        return false
      }
    })

    return {
      present: monthlyRecords.filter(r => r.status === 'Present').length,
      absent: monthlyRecords.filter(r => r.status === 'Absent').length,
      halfDay: monthlyRecords.filter(r => r.status === 'Half-Day').length,
      leave: monthlyRecords.filter(r => r.status === 'Leave').length,
      total: monthlyRecords.length,
      records: monthlyRecords
    }
  }

  const getDetailedRecordsByStatus = (photographerId, statusType) => {
    const stats = calculateMonthlyStats(photographerId)
    
    const statusMap = {
      'present': 'Present',
      'absent': 'Absent',
      'halfDay': 'Half-Day',
      'leave': 'Leave'
    }
    
    return stats.records.filter(r => r.status === statusMap[statusType])
  }

  const openStatsDetail = (photographer, type) => {
    setSelectedPhotographer(photographer)
    setStatsDetailType(type)
    setIsStatsDetailModalOpen(true)
  }

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
      'Present': FaCheckCircle,
      'Absent': FaTimesCircle,
      'Half-Day': FaClock,
      'Leave': FaUmbrellaBeach
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
      return 'N/A'
    }
  }

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      })
    } catch {
      return 'N/A'
    }
  }

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const getMonthName = () => {
    return currentDate.toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric'
    })
  }

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance data...</p>
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
          <FaCalendarCheck className="text-blue-600" />
          Attendance Tracker
        </h1>
        <p className="text-gray-600">Mark and manage photographer attendance</p>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('mark')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                viewMode === 'mark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaPlus className="inline mr-2" />
              Mark Today
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                viewMode === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaHistory className="inline mr-2" />
              History
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                viewMode === 'stats'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaChartBar className="inline mr-2" />
              Statistics
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronLeft />
            </button>
            <span className="font-semibold text-gray-700 min-w-[150px] text-center">
              {getMonthName()}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* ==================== MARK TODAY VIEW ==================== */}
      {viewMode === 'mark' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Mark Today's Attendance</h2>
            <button
              onClick={() => setIsMarkModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaPlus />
              Mark Attendance
            </button>
          </div>

          {photographers.length === 0 ? (
            <div className="text-center py-12">
              <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No photographers found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photographers.map((photographer) => {
                const todayStatus = getAttendanceStatus(
                  photographer.id,
                  new Date().toISOString().split('T')[0]
                )
                const StatusIcon = todayStatus ? getStatusIcon(todayStatus) : FaUser

                return (
                  <motion.div
                    key={photographer.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{photographer.name}</h3>
                        <p className="text-sm text-gray-500">{photographer.specialization}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${todayStatus ? getStatusColor(todayStatus) : 'bg-gray-100'}`}>
                        <StatusIcon className="text-lg" />
                      </div>
                    </div>
                    
                    {todayStatus ? (
                      <div className={`text-center py-2 rounded-lg ${getStatusColor(todayStatus)}`}>
                        <span className="font-medium">{todayStatus}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setMarkForm({
                            ...markForm,
                            photographerId: photographer.id
                          })
                          setIsMarkModalOpen(true)
                        }}
                        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors font-medium"
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

      {/* ==================== HISTORY VIEW ==================== */}
      {viewMode === 'history' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Attendance History</h2>
          
          {photographers.length === 0 ? (
            <div className="text-center py-12">
              <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No photographers found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {photographers.map((photographer) => {
                const history = getPhotographerHistory(photographer.id)
                
                return (
                  <motion.div
                    key={photographer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{photographer.name}</h3>
                          <p className="text-sm text-gray-500">{photographer.specialization}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPhotographer(photographer)
                          setIsHistoryModalOpen(true)
                        }}
                        className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <FaEye />
                        View Full History
                      </button>
                    </div>

                    {history.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No attendance records</p>
                    ) : (
                      <div className="grid grid-cols-7 gap-2">
                        {history.slice(0, 14).map((record, idx) => {
                          const StatusIcon = getStatusIcon(record.status)
                          return (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg text-center ${getStatusColor(record.status)}`}
                              title={`${formatDate(record.date)} - ${record.status}`}
                            >
                              <StatusIcon className="mx-auto mb-1" />
                              <p className="text-xs">{formatDateShort(record.date)}</p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    
                    <div className="mt-3 text-sm text-gray-600 text-center">
                      Total Records: {history.length} days
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================== STATISTICS VIEW ==================== */}
      {viewMode === 'stats' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Photographer</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Present</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Absent</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Half-Day</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Leave</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Total Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {photographers.map((photographer, index) => {
                  const stats = calculateMonthlyStats(photographer.id)
                  
                  return (
                    <motion.tr
                      key={photographer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{photographer.name}</div>
                            <div className="text-sm text-gray-500">{photographer.specialization}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openStatsDetail(photographer, 'present')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <FaCheckCircle />
                          <span className="font-semibold">{stats.present}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openStatsDetail(photographer, 'absent')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <FaTimesCircle />
                          <span className="font-semibold">{stats.absent}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openStatsDetail(photographer, 'halfDay')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <FaClock />
                          <span className="font-semibold">{stats.halfDay}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openStatsDetail(photographer, 'leave')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <FaUmbrellaBeach />
                          <span className="font-semibold">{stats.leave}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-gray-900">{stats.total}</span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== MARK ATTENDANCE MODAL ==================== */}
      <AnimatePresence>
        {isMarkModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsMarkModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaCalendarCheck />
                    Mark Attendance
                  </h2>
                  <button
                    onClick={() => setIsMarkModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Photographer *
                  </label>
                  <select
                    value={markForm.photographerId}
                    onChange={(e) => setMarkForm({ ...markForm, photographerId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose photographer...</option>
                    {photographers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - {p.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={markForm.date}
                    onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Present', 'Absent', 'Half-Day', 'Leave'].map((status) => {
                      const StatusIcon = getStatusIcon(status)
                      return (
                        <button
                          key={status}
                          onClick={() => setMarkForm({ ...markForm, status })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            markForm.status === status
                              ? `${getStatusColor(status)} border-current`
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <StatusIcon className="mx-auto mb-1 text-xl" />
                          <span className="text-sm font-medium">{status}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={markForm.notes}
                    onChange={(e) => setMarkForm({ ...markForm, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Add any notes..."
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleMarkAttendance}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    Mark Attendance
                  </button>
                  <button
                    onClick={() => setIsMarkModalOpen(false)}
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

      {/* ==================== FULL HISTORY MODAL ==================== */}
      <AnimatePresence>
        {isHistoryModalOpen && selectedPhotographer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsHistoryModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaHistory />
                      Attendance History
                    </h2>
                    <p className="text-purple-100 mt-1">{selectedPhotographer.name}</p>
                  </div>
                  <button
                    onClick={() => setIsHistoryModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {(() => {
                  const history = getPhotographerHistory(selectedPhotographer.id)
                  
                  if (history.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No attendance records found</p>
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-3">
                      {history.map((record, index) => {
                        const StatusIcon = getStatusIcon(record.status)
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-xl border-2 ${getStatusColor(record.status)} border-current`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <StatusIcon className="text-2xl" />
                                <div>
                                  <div className="font-semibold">{record.status}</div>
                                  <div className="text-sm opacity-80">
                                    {formatDate(record.date)}
                                  </div>
                                </div>
                              </div>
                              {record.notes && (
                                <div className="text-sm opacity-80 max-w-md italic">
                                  "{record.notes}"
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== STATISTICS DETAIL MODAL ==================== */}
      <AnimatePresence>
        {isStatsDetailModalOpen && selectedPhotographer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsStatsDetailModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaChartBar />
                      {statsDetailType.charAt(0).toUpperCase() + statsDetailType.slice(1)} Days Details
                    </h2>
                    <p className="text-green-100 mt-1">
                      {selectedPhotographer.name} - {getMonthName()}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsStatsDetailModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {(() => {
                  const records = getDetailedRecordsByStatus(selectedPhotographer.id, statsDetailType)
                  
                  if (records.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No records found for this category</p>
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-3">
                      {records.map((record, index) => {
                        const StatusIcon = getStatusIcon(record.status)
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-xl ${getStatusColor(record.status)}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <StatusIcon className="text-2xl" />
                                <div>
                                  <div className="font-semibold">{formatDate(record.date)}</div>
                                  <div className="text-sm opacity-80">{record.status}</div>
                                </div>
                              </div>
                              {record.notes && (
                                <div className="text-sm opacity-80 italic max-w-xs">
                                  "{record.notes}"
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                      
                      <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-lg font-bold text-gray-900">
                          Total: {records.length} day{records.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AttendanceTracker
