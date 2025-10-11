import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaMoneyBillWave, FaCalendarAlt, FaUser, FaDownload,
  FaCheckCircle, FaTimesCircle, FaCalculator, FaHistory,
  FaPlus, FaMinus, FaReceipt, FaFileInvoice, FaChartLine,
  FaTimes, FaSave, FaEye, FaPrint, FaFilter
} from 'react-icons/fa'

const SalaryProcessor = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [photographers, setPhotographers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [salaries, setSalaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedPhotographer, setSelectedPhotographer] = useState(null)
  const [salaryData, setSalaryData] = useState({
    photographerId: '',
    month: '',
    year: '',
    workingDays: 0,
    dailyRate: 0,
    basicSalary: 0,
    bonus: 0,
    deductions: 0,
    netSalary: 0,
    paymentStatus: 'Pending',
    paymentDate: '',
    notes: ''
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzX0rollFXcrI5d8qKhWlLslCX71JDSnlwAVtLLsqmDze2Jhi9_FbpMg-wIvELxe83fZQ/exec'

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (salaryData.basicSalary || salaryData.bonus || salaryData.deductions) {
      calculateNetSalary()
    }
  }, [salaryData.basicSalary, salaryData.bonus, salaryData.deductions])

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

      // Fetch attendance
      const attResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getAttendance' })
      })
      const attResult = await attResponse.json()
      if (attResult.success) {
        setAttendance(attResult.attendance || [])
      }

      // Fetch salary records
      const salaryResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getSalaries' })
      })
      const salaryResult = await salaryResponse.json()
      if (salaryResult.success) {
        setSalaries(salaryResult.salaries || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate working days from attendance
  const calculateWorkingDays = (photographerId, month, year) => {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    
    const records = attendance.filter(att => {
      if (att.photographerId !== photographerId) return false
      const attDate = new Date(att.date)
      return attDate >= monthStart && attDate <= monthEnd
    })

    let workingDays = 0
    records.forEach(record => {
      if (record.status === 'Present') workingDays += 1
      else if (record.status === 'Half-Day') workingDays += 0.5
    })

    return workingDays
  }

  // Auto-calculate salary
  const openProcessModal = (photographer) => {
    const month = currentMonth.getMonth()
    const year = currentMonth.getFullYear()
    const workingDays = calculateWorkingDays(photographer.id, month, year)
    const dailyRate = parseFloat(photographer.dailyRate) || 0
    const basicSalary = workingDays * dailyRate

    setSalaryData({
      photographerId: photographer.id,
      photographerName: photographer.name,
      month: month,
      year: year,
      workingDays: workingDays,
      dailyRate: dailyRate,
      basicSalary: basicSalary,
      bonus: 0,
      deductions: 0,
      netSalary: basicSalary,
      paymentStatus: 'Pending',
      paymentDate: '',
      notes: ''
    })

    setSelectedPhotographer(photographer)
    setIsProcessModalOpen(true)
  }

  const calculateNetSalary = () => {
    const net = parseFloat(salaryData.basicSalary || 0) + 
                parseFloat(salaryData.bonus || 0) - 
                parseFloat(salaryData.deductions || 0)
    
    setSalaryData(prev => ({
      ...prev,
      netSalary: net
    }))
  }

  const handleProcessSalary = async () => {
    if (!salaryData.photographerId) {
      alert('⚠️ Photographer not selected!')
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'processSalary',
          ...salaryData,
          processedDate: new Date().toISOString()
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('✅ Salary processed successfully!')
        setIsProcessModalOpen(false)
        resetSalaryData()
        fetchData()
      } else {
        alert('❌ Failed to process salary: ' + result.error)
      }
    } catch (error) {
      console.error('Error processing salary:', error)
      alert('❌ Error processing salary')
    }
  }

  const resetSalaryData = () => {
    setSalaryData({
      photographerId: '',
      month: '',
      year: '',
      workingDays: 0,
      dailyRate: 0,
      basicSalary: 0,
      bonus: 0,
      deductions: 0,
      netSalary: 0,
      paymentStatus: 'Pending',
      paymentDate: '',
      notes: ''
    })
    setSelectedPhotographer(null)
  }

  const formatCurrency = (amount) => {
    return '₹' + parseFloat(amount || 0).toLocaleString('en-IN')
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Get salary for photographer in current month
  const getSalaryRecord = (photographerId) => {
    return salaries.find(s => 
      s.photographerId === photographerId &&
      parseInt(s.month) === currentMonth.getMonth() &&
      parseInt(s.year) === currentMonth.getFullYear()
    )
  }

  const changeMonth = (delta) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading salary data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Salary Processor</h1>
          <p className="text-gray-600">Process and manage photographer salaries</p>
        </div>

        {/* Month Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => changeMonth(-1)}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaCalendarAlt className="text-xl" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            
            <button
              onClick={() => changeMonth(1)}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaCalendarAlt className="text-xl" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <FaUser className="text-3xl opacity-80" />
            </div>
            <p className="text-blue-100 text-sm mb-1">Total Photographers</p>
            <h3 className="text-4xl font-bold">{photographers.length}</h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <FaCheckCircle className="text-3xl opacity-80" />
            </div>
            <p className="text-green-100 text-sm mb-1">Processed</p>
            <h3 className="text-4xl font-bold">
              {salaries.filter(s => 
                parseInt(s.month) === currentMonth.getMonth() &&
                parseInt(s.year) === currentMonth.getFullYear()
              ).length}
            </h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <FaTimesCircle className="text-3xl opacity-80" />
            </div>
            <p className="text-orange-100 text-sm mb-1">Pending</p>
            <h3 className="text-4xl font-bold">
              {photographers.length - salaries.filter(s => 
                parseInt(s.month) === currentMonth.getMonth() &&
                parseInt(s.year) === currentMonth.getFullYear()
              ).length}
            </h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <FaMoneyBillWave className="text-3xl opacity-80" />
            </div>
            <p className="text-purple-100 text-sm mb-1">Total Payout</p>
            <h3 className="text-2xl font-bold">
              {formatCurrency(
                salaries
                  .filter(s => 
                    parseInt(s.month) === currentMonth.getMonth() &&
                    parseInt(s.year) === currentMonth.getFullYear()
                  )
                  .reduce((sum, s) => sum + parseFloat(s.netSalary || 0), 0)
              )}
            </h3>
          </motion.div>
        </div>

        {/* Photographers Salary Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Salary Processing</h2>

          {photographers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No photographers found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photographers.map((photographer, index) => {
                const workingDays = calculateWorkingDays(
                  photographer.id,
                  currentMonth.getMonth(),
                  currentMonth.getFullYear()
                )
                const dailyRate = parseFloat(photographer.dailyRate) || 0
                const estimatedSalary = workingDays * dailyRate
                const salaryRecord = getSalaryRecord(photographer.id)

                return (
                  <motion.div
                    key={photographer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Photographer Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {photographer.name?.charAt(0)}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-800">{photographer.name}</h3>
                        <p className="text-sm text-gray-500">{photographer.specialization}</p>
                      </div>
                    </div>

                    {/* Salary Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Working Days</span>
                        <span className="font-semibold text-gray-800">{workingDays} days</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Daily Rate</span>
                        <span className="font-semibold text-gray-800">{formatCurrency(dailyRate)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="font-semibold text-gray-700">Estimated</span>
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(estimatedSalary)}</span>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    {salaryRecord ? (
                      <div className="space-y-2">
                        <div className={`flex items-center justify-center gap-2 py-3 rounded-lg ${
                          salaryRecord.paymentStatus === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          <FaCheckCircle />
                          <span className="font-semibold">
                            Processed - {formatCurrency(salaryRecord.netSalary)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPhotographer({ ...photographer, salaryRecord })
                            setIsViewModalOpen(true)
                          }}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FaEye /> View Slip
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openProcessModal(photographer)}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        <FaCalculator /> Process Salary
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Process Salary Modal */}
      <AnimatePresence>
        {isProcessModalOpen && (
          <ProcessSalaryModal
            photographer={selectedPhotographer}
            salaryData={salaryData}
            onInputChange={(field, value) => setSalaryData(prev => ({ ...prev, [field]: value }))}
            onSave={handleProcessSalary}
            onClose={() => {
              setIsProcessModalOpen(false)
              resetSalaryData()
            }}
            formatCurrency={formatCurrency}
            monthNames={monthNames}
          />
        )}
      </AnimatePresence>

      {/* View Salary Slip Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedPhotographer && (
          <SalarySlipModal
            photographer={selectedPhotographer}
            onClose={() => {
              setIsViewModalOpen(false)
              setSelectedPhotographer(null)
            }}
            formatCurrency={formatCurrency}
            monthNames={monthNames}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ==================== PROCESS SALARY MODAL ====================
const ProcessSalaryModal = ({ photographer, salaryData, onInputChange, onSave, onClose, formatCurrency, monthNames }) => {
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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Process Salary</h3>
              <p className="text-green-100">{photographer?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Period & Working Days */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Salary Period</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 mb-1">Month & Year</p>
                <p className="text-lg font-bold text-blue-800">
                  {monthNames[salaryData.month]} {salaryData.year}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 mb-1">Working Days</p>
                <p className="text-lg font-bold text-purple-800">{salaryData.workingDays} days</p>
              </div>
            </div>
          </div>

          {/* Salary Calculation */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Salary Calculation</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Daily Rate</span>
                <span className="text-xl font-bold text-gray-800">{formatCurrency(salaryData.dailyRate)}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span className="text-green-700 font-semibold">Basic Salary</span>
                <span className="text-xl font-bold text-green-800">
                  {formatCurrency(salaryData.basicSalary)}
                </span>
              </div>

              {/* Bonus */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bonus (Optional)
                </label>
                <input
                  type="number"
                  value={salaryData.bonus}
                  onChange={(e) => onInputChange('bonus', e.target.value)}
                  placeholder="Enter bonus amount"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Deductions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deductions (Optional)
                </label>
                <input
                  type="number"
                  value={salaryData.deductions}
                  onChange={(e) => onInputChange('deductions', e.target.value)}
                  placeholder="Enter deduction amount"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Net Salary */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg text-white">
                <span className="text-lg font-bold">Net Salary</span>
                <span className="text-2xl font-bold">{formatCurrency(salaryData.netSalary)}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={salaryData.paymentStatus}
                  onChange={(e) => onInputChange('paymentStatus', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Date (If Paid)
                </label>
                <input
                  type="date"
                  value={salaryData.paymentDate}
                  onChange={(e) => onInputChange('paymentDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={salaryData.notes}
              onChange={(e) => onInputChange('notes', e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <FaSave /> Process & Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ==================== SALARY SLIP MODAL ====================
const SalarySlipModal = ({ photographer, onClose, formatCurrency, monthNames }) => {
  const salaryRecord = photographer.salaryRecord

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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        id="salary-slip"
      >
        {/* Slip Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold">Salary Slip</h3>
              <p className="text-blue-100">RN PhotoFilms</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors print:hidden"
            >
              <FaTimes size={24} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100 mb-1">Period</p>
              <p className="text-xl font-bold">
                {monthNames[parseInt(salaryRecord.month)]} {salaryRecord.year}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100 mb-1">Processed On</p>
              <p className="font-semibold">
                {salaryRecord.processedDate ? new Date(salaryRecord.processedDate).toLocaleDateString('en-IN') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Slip Body */}
        <div className="p-8 space-y-6">
          {/* Employee Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Employee Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-semibold text-gray-800">{photographer.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Designation</p>
                <p className="font-semibold text-gray-800">{photographer.specialization}</p>
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Earnings</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Working Days</span>
                <span className="font-semibold text-gray-800">{salaryRecord.workingDays} days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Daily Rate</span>
                <span className="font-semibold text-gray-800">{formatCurrency(salaryRecord.dailyRate)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-700 font-semibold">Basic Salary</span>
                <span className="font-bold text-green-800">{formatCurrency(salaryRecord.basicSalary)}</span>
              </div>
              {parseFloat(salaryRecord.bonus) > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700">Bonus</span>
                  <span className="font-semibold text-blue-800">{formatCurrency(salaryRecord.bonus)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Deductions */}
          {parseFloat(salaryRecord.deductions) > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Deductions</h4>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-700">Total Deductions</span>
                <span className="font-semibold text-red-800">- {formatCurrency(salaryRecord.deductions)}</span>
              </div>
            </div>
          )}

          {/* Net Salary */}
          <div className="pt-4 border-t-2 border-gray-200">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white">
              <span className="text-xl font-bold">Net Salary</span>
              <span className="text-3xl font-bold">{formatCurrency(salaryRecord.netSalary)}</span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Payment Status</span>
              <span className={`px-4 py-2 rounded-full font-semibold ${
                salaryRecord.paymentStatus === 'Paid'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {salaryRecord.paymentStatus}
              </span>
            </div>
            {salaryRecord.paymentDate && (
              <div className="mt-2 text-sm text-gray-600">
                Paid on: {new Date(salaryRecord.paymentDate).toLocaleDateString('en-IN')}
              </div>
            )}
          </div>

          {/* Notes */}
          {salaryRecord.notes && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 font-semibold mb-1">Notes</p>
              <p className="text-gray-700">{salaryRecord.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3 print:hidden">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <FaPrint /> Print Slip
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SalaryProcessor
