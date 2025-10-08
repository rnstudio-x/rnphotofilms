import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import googleSheetsAPI from '../Utils/googleSheets'

const AttendanceTracker = () => {
  const [photographers, setPhotographers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhotographers()
    fetchAttendance()
  }, [selectedDate])

  const fetchPhotographers = async () => {
    try {
      const response = await googleSheetsAPI.getPhotographers()
      if (response.success) {
        setPhotographers(response.data)
      }
    } catch (error) {
      console.error('Error fetching photographers:', error)
    }
  }

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const response = await googleSheetsAPI.getAttendance(selectedDate)
      if (response.success) {
        setAttendance(response.data)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
    setLoading(false)
  }

  const markAttendance = async (photographerId, status) => {
    try {
      await googleSheetsAPI.markAttendance({
        photographerId,
        date: selectedDate,
        status
      })
      fetchAttendance()
    } catch (error) {
      console.error('Error marking attendance:', error)
    }
  }

  const getAttendanceStatus = (photographerId) => {
    const record = attendance.find(a => a.photographerId === photographerId && a.date === selectedDate)
    return record?.status || 'Absent'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <FaCalendarAlt className="text-gold text-2xl" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : photographers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No photographers found</div>
        ) : (
          photographers.map((photographer, index) => {
            const status = getAttendanceStatus(photographer.id)
            return (
              <motion.div
                key={photographer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {photographer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-charcoal">{photographer.name}</h3>
                    <p className="text-sm text-gray-500">₹{photographer.dailyRate}/day</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => markAttendance(photographer.id, 'Present')}
                    className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                      status === 'Present'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    <FaCheckCircle /> Present
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => markAttendance(photographer.id, 'Absent')}
                    className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                      status === 'Absent'
                        ? 'bg-red-500 text-white'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <FaTimesCircle /> Absent
                  </motion.button>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AttendanceTracker
