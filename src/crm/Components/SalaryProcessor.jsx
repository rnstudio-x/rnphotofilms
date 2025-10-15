import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaMoneyBillWave, FaCalendarAlt, FaUser, FaDownload, FaCheckCircle, 
  FaTimesCircle, FaCalculator, FaHistory, FaPlus, FaMinus, FaReceipt, 
  FaFileInvoice, FaChartLine, FaTimes, FaSave, FaEye, FaPrint, FaFilter,
  FaEdit, FaChevronLeft, FaChevronRight, FaWallet, FaExclamationTriangle,
  FaCreditCard, FaUniversity, FaMobileAlt, FaInfoCircle
} from 'react-icons/fa'

const SalaryProcessor = () => {
  // ==================== STATE MANAGEMENT ====================
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [photographers, setPhotographers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [salaries, setSalaries] = useState([])
  const [salaryPayments, setSalaryPayments] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Modal States
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  
  const [selectedPhotographer, setSelectedPhotographer] = useState(null)
  const [selectedSalary, setSelectedSalary] = useState(null)
  
  // Form States
  const [salaryData, setSalaryData] = useState({
    photographerId: '',
    photographerName: '',
    month: '',
    year: '',
    workingDays: 0,
    dailyRate: 0,
    basicSalary: 0,
    bonus: 0,
    deductions: 0,
    netSalary: 0,
    notes: ''
  })

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'UPI',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentType: 'Full Payment',
    transactionId: '',
    notes: ''
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxor8ZV3Meq7lo0DBZ68wn8WZg_R1rF3W7T5AD5AaRsAqLzfUHsmgPjU8cr1OSQINw8Tg/exec'

  // ==================== DATA FETCHING ====================
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    calculateNetSalary()
  }, [salaryData.basicSalary, salaryData.bonus, salaryData.deductions])

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

      const salaryResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getSalaries' })
      })
      const salaryResult = await salaryResponse.json()
      
      if (salaryResult.success) {
        setSalaries(salaryResult.salaries || [])
      }

      const paymentsResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getSalaryPayments' })
      })
      const paymentsResult = await paymentsResponse.json()
      
      if (paymentsResult.success) {
        setSalaryPayments(paymentsResult.payments || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // ==================== CALCULATIONS ====================
  const calculateWorkingDays = (photographerId, month, year) => {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    
    const records = attendance.filter(att => {
      if (att.photographerId !== photographerId) return false
      try {
        const attDate = new Date(att.date)
        return attDate >= monthStart && attDate <= monthEnd
      } catch {
        return false
      }
    })

    let workingDays = 0
    records.forEach(record => {
      if (record.status === 'Present') workingDays += 1
      else if (record.status === 'Half-Day') workingDays += 0.5
    })

    return workingDays
  }

  const calculateNetSalary = () => {
    const net = parseFloat(salaryData.basicSalary || 0) + 
                parseFloat(salaryData.bonus || 0) - 
                parseFloat(salaryData.deductions || 0)
    
    setSalaryData(prev => ({ ...prev, netSalary: net }))
  }

  // ==================== SALARY PROCESSING ====================
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
      notes: ''
    })
    
    setSelectedPhotographer(photographer)
    setIsProcessModalOpen(true)
  }

  const openEditModal = (salary, photographer) => {
    setSalaryData({
      id: salary.id,
      photographerId: salary.photographerId,
      photographerName: salary.photographerName,
      month: parseInt(salary.month),
      year: parseInt(salary.year),
      workingDays: parseFloat(salary.workingDays) || 0,
      dailyRate: parseFloat(salary.dailyRate) || 0,
      basicSalary: parseFloat(salary.basicSalary) || 0,
      bonus: parseFloat(salary.bonus) || 0,
      deductions: parseFloat(salary.deductions) || 0,
      netSalary: parseFloat(salary.netSalary) || 0,
      notes: salary.notes || ''
    })
    
    setSelectedSalary(salary)
    setSelectedPhotographer(photographer)
    setIsEditModalOpen(true)
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
          photographerId: salaryData.photographerId,
          photographerName: salaryData.photographerName,
          month: salaryData.month,
          year: salaryData.year,
          workingDays: salaryData.workingDays,
          dailyRate: salaryData.dailyRate,
          basicSalary: salaryData.basicSalary,
          bonus: salaryData.bonus,
          deductions: salaryData.deductions,
          netSalary: salaryData.netSalary,
          notes: salaryData.notes,
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
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error processing salary:', error)
      alert('❌ Error processing salary')
    }
  }

  const handleUpdateSalary = async () => {
    if (!salaryData.id) {
      alert('⚠️ Salary ID missing!')
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateSalary',
          id: salaryData.id,
          photographerId: salaryData.photographerId,
          photographerName: salaryData.photographerName,
          month: salaryData.month,
          year: salaryData.year,
          workingDays: salaryData.workingDays,
          dailyRate: salaryData.dailyRate,
          basicSalary: salaryData.basicSalary,
          bonus: salaryData.bonus,
          deductions: salaryData.deductions,
          netSalary: salaryData.netSalary,
          notes: salaryData.notes,
          updatedDate: new Date().toISOString()
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Salary updated successfully!')
        setIsEditModalOpen(false)
        fetchData()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error updating salary:', error)
      alert('❌ Error updating salary')
    }
  }

  // ==================== PAYMENT MANAGEMENT ====================
  const openPaymentModal = (salary, photographer) => {
    setSelectedSalary(salary)
    setSelectedPhotographer(photographer)
    
    const totalPaid = getSalaryPayments(salary.id).reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
    const remaining = parseFloat(salary.netSalary || 0) - totalPaid
    
    setPaymentForm({
      amount: remaining > 0 ? remaining.toString() : '',
      paymentMethod: 'UPI',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentType: totalPaid > 0 ? 'Partial Payment' : 'Full Payment',
      transactionId: '',
      notes: ''
    })
    
    setIsPaymentModalOpen(true)
  }

  const handleAddPayment = async () => {
    if (!selectedSalary || !paymentForm.amount) {
      alert('⚠️ Please fill amount!')
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'addSalaryPayment',
          salaryId: selectedSalary.id,
          photographerId: selectedSalary.photographerId,
          photographerName: selectedSalary.photographerName,
          month: selectedSalary.month,
          year: selectedSalary.year,
          amount: parseFloat(paymentForm.amount),
          paymentMethod: paymentForm.paymentMethod,
          paymentDate: paymentForm.paymentDate,
          paymentType: paymentForm.paymentType,
          transactionId: paymentForm.transactionId,
          notes: paymentForm.notes
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Payment added successfully!')
        setIsPaymentModalOpen(false)
        resetPaymentForm()
        fetchData()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error adding payment:', error)
      alert('❌ Error adding payment')
    }
  }

  // ==================== HELPER FUNCTIONS ====================
  const resetSalaryData = () => {
    setSalaryData({
      photographerId: '',
      photographerName: '',
      month: '',
      year: '',
      workingDays: 0,
      dailyRate: 0,
      basicSalary: 0,
      bonus: 0,
      deductions: 0,
      netSalary: 0,
      notes: ''
    })
    setSelectedPhotographer(null)
    setSelectedSalary(null)
  }

  const resetPaymentForm = () => {
    setPaymentForm({
      amount: '',
      paymentMethod: 'UPI',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentType: 'Full Payment',
      transactionId: '',
      notes: ''
    })
  }

  const getSalaryRecord = (photographerId) => {
    return salaries.find(s => 
      s.photographerId === photographerId && 
      parseInt(s.month) === currentMonth.getMonth() && 
      parseInt(s.year) === currentMonth.getFullYear()
    )
  }

  const getSalaryPayments = (salaryId) => {
    return salaryPayments.filter(p => p.salaryId === salaryId)
  }

  const getPaymentStatus = (salary) => {
    const payments = getSalaryPayments(salary.id)
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
    const netSalary = parseFloat(salary.netSalary || 0)

    if (totalPaid >= netSalary) {
      return { status: 'Paid', color: 'bg-green-100 text-green-800', icon: FaCheckCircle }
    } else if (totalPaid > 0) {
      return { status: 'Partial', color: 'bg-yellow-100 text-yellow-800', icon: FaExclamationTriangle }
    } else {
      return { status: 'Pending', color: 'bg-red-100 text-red-800', icon: FaTimesCircle }
    }
  }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'UPI': return <FaMobileAlt />
      case 'Cash': return <FaWallet />
      case 'Card': return <FaCreditCard />
      case 'Bank Transfer': return <FaUniversity />
      default: return <FaMoneyBillWave />
    }
  }

  const formatCurrency = (amount) => {
    return '₹' + parseFloat(amount || 0).toLocaleString('en-IN')
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

  const changeMonth = (delta) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1))
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // ==================== STATISTICS ====================
  const stats = {
    total: photographers.length,
    processed: salaries.filter(s => 
      parseInt(s.month) === currentMonth.getMonth() && 
      parseInt(s.year) === currentMonth.getFullYear()
    ).length,
    pending: photographers.length - salaries.filter(s => 
      parseInt(s.month) === currentMonth.getMonth() && 
      parseInt(s.year) === currentMonth.getFullYear()
    ).length,
    totalPayout: salaries
      .filter(s => parseInt(s.month) === currentMonth.getMonth() && parseInt(s.year) === currentMonth.getFullYear())
      .reduce((sum, s) => sum + parseFloat(s.netSalary || 0), 0)
  }

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading salary data...</p>
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
          <FaMoneyBillWave className="text-blue-600" />
          Salary Processor
        </h1>
        <p className="text-gray-600">Process and manage photographer salaries with payment tracking</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <FaUser className="text-3xl opacity-80 mb-2" />
          <h3 className="text-2xl font-bold mb-1">{stats.total}</h3>
          <p className="text-blue-100 text-sm">Total Photographers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <FaCheckCircle className="text-3xl opacity-80 mb-2" />
          <h3 className="text-2xl font-bold mb-1">{stats.processed}</h3>
          <p className="text-green-100 text-sm">Processed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <FaExclamationTriangle className="text-3xl opacity-80 mb-2" />
          <h3 className="text-2xl font-bold mb-1">{stats.pending}</h3>
          <p className="text-orange-100 text-sm">Pending</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <FaMoneyBillWave className="text-3xl opacity-80 mb-2" />
          <h3 className="text-2xl font-bold mb-1">{formatCurrency(stats.totalPayout)}</h3>
          <p className="text-purple-100 text-sm">Total Payout</p>
        </motion.div>
      </div>

      {/* Month Navigation */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaChevronLeft className="text-xl" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>
      </div>

      {/* Photographers List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {photographers.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No photographers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Photographer</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Daily Rate</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Working Days</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Net Salary</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Payment Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {photographers.map((photographer, index) => {
                  const salaryRecord = getSalaryRecord(photographer.id)
                  const workingDays = calculateWorkingDays(
                    photographer.id, 
                    currentMonth.getMonth(), 
                    currentMonth.getFullYear()
                  )

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
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(photographer.dailyRate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-gray-900">{workingDays} days</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {salaryRecord ? (
                          <span className="font-semibold text-green-600">
                            {formatCurrency(salaryRecord.netSalary)}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not processed</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {salaryRecord ? (
                          <div className="flex flex-col items-center gap-1">
                            {(() => {
                              const paymentStatus = getPaymentStatus(salaryRecord)
                              const StatusIcon = paymentStatus.icon
                              const payments = getSalaryPayments(salaryRecord.id)
                              const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
                              
                              return (
                                <>
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${paymentStatus.color}`}>
                                    <StatusIcon />
                                    {paymentStatus.status}
                                  </span>
                                  {totalPaid > 0 && (
                                    <span className="text-xs text-gray-600">
                                      Paid: {formatCurrency(totalPaid)}
                                    </span>
                                  )}
                                </>
                              )
                            })()}
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <FaTimesCircle />
                              Not Processed
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {salaryRecord ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedSalary(salaryRecord)
                                  setSelectedPhotographer(photographer)
                                  setIsViewModalOpen(true)
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Slip"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => openEditModal(salaryRecord, photographer)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit/Re-process"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => openPaymentModal(salaryRecord, photographer)}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Add Payment"
                              >
                                <FaWallet />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSalary(salaryRecord)
                                  setSelectedPhotographer(photographer)
                                  setIsHistoryModalOpen(true)
                                }}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Payment History"
                              >
                                <FaHistory />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => openProcessModal(photographer)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                              <FaCalculator />
                              Process Salary
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

      {/* ==================== PROCESS SALARY MODAL ==================== */}
      <AnimatePresence>
        {isProcessModalOpen && selectedPhotographer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsProcessModalOpen(false)}
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
                      <FaCalculator />
                      Process Salary
                    </h2>
                    <p className="text-blue-100 mt-1">{selectedPhotographer.name}</p>
                  </div>
                  <button
                    onClick={() => setIsProcessModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Month/Year</p>
                      <p className="text-lg font-bold text-gray-900">
                        {monthNames[salaryData.month]} {salaryData.year}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Working Days</p>
                      <p className="text-lg font-bold text-gray-900">{salaryData.workingDays}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Daily Rate</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(salaryData.dailyRate)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Basic Salary (Auto-calculated)
                    </label>
                    <input
                      type="number"
                      value={salaryData.basicSalary}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bonus
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={salaryData.bonus}
                        onChange={(e) => setSalaryData({...salaryData, bonus: e.target.value})}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deductions
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={salaryData.deductions}
                        onChange={(e) => setSalaryData({...salaryData, deductions: e.target.value})}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Net Salary
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatCurrency(salaryData.netSalary)}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-green-500 rounded-lg bg-green-50 text-green-700 font-bold text-xl"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={salaryData.notes}
                      onChange={(e) => setSalaryData({...salaryData, notes: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Add any notes..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleProcessSalary}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    Process Salary
                  </button>
                  <button
                    onClick={() => setIsProcessModalOpen(false)}
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

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedPhotographer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaEdit />
                      Edit Salary (Re-processing)
                    </h2>
                    <p className="text-green-100 mt-1">{selectedPhotographer.name}</p>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Month/Year</p>
                      <p className="text-lg font-bold text-gray-900">
                        {monthNames[salaryData.month]} {salaryData.year}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Working Days</p>
                      <p className="text-lg font-bold text-gray-900">{salaryData.workingDays}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Daily Rate</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(salaryData.dailyRate)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Basic Salary
                    </label>
                    <input
                      type="number"
                      value={salaryData.basicSalary}
                      onChange={(e) => setSalaryData({...salaryData, basicSalary: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bonus
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={salaryData.bonus}
                        onChange={(e) => setSalaryData({...salaryData, bonus: e.target.value})}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deductions
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={salaryData.deductions}
                        onChange={(e) => setSalaryData({...salaryData, deductions: e.target.value})}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Net Salary
                    </label>
                    <input
                      type="text"
                      value={formatCurrency(salaryData.netSalary)}
                      readOnly
                      className="w-full px-4 py-3 border-2 border-green-500 rounded-lg bg-green-50 text-green-700 font-bold text-xl"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={salaryData.notes}
                      onChange={(e) => setSalaryData({...salaryData, notes: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUpdateSalary}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    Update Salary
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
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

      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {isPaymentModalOpen && selectedSalary && selectedPhotographer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsPaymentModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaWallet />
                      Add Payment
                    </h2>
                    <p className="text-purple-100 mt-1">{selectedPhotographer.name}</p>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-purple-50 rounded-xl p-4">
                  {(() => {
                    const payments = getSalaryPayments(selectedSalary.id)
                    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
                    const remaining = parseFloat(selectedSalary.netSalary || 0) - totalPaid
                    
                    return (
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Net Salary</p>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(selectedSalary.netSalary)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Already Paid</p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Remaining</p>
                          <p className="text-lg font-bold text-orange-600">{formatCurrency(remaining)}</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm({...paymentForm, paymentDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID / Reference
                  </label>
                  <input
                    type="text"
                    value={paymentForm.transactionId}
                    onChange={(e) => setPaymentForm({...paymentForm, transactionId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter transaction ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows="2"
                    placeholder="Add any notes..."
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddPayment}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    Add Payment
                  </button>
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
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

      {/* PAYMENT HISTORY MODAL */}
      <AnimatePresence>
        {isHistoryModalOpen && selectedSalary && selectedPhotographer && (
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
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaHistory />
                      Payment History
                    </h2>
                    <p className="text-orange-100 mt-1">
                      {selectedPhotographer.name} - {monthNames[parseInt(selectedSalary.month)]} {selectedSalary.year}
                    </p>
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
                  const payments = getSalaryPayments(selectedSalary.id)
                  
                  if (payments.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No payment history found</p>
                      </div>
                    )
                  }

                  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
                  const remaining = parseFloat(selectedSalary.netSalary || 0) - totalPaid

                  return (
                    <>
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Net Salary</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(selectedSalary.netSalary)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                            <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Remaining</p>
                            <p className="text-xl font-bold text-orange-600">{formatCurrency(remaining)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {payments.map((payment, index) => {
                          const MethodIcon = getPaymentMethodIcon(payment.paymentMethod)
                          
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="p-3 bg-white rounded-lg shadow-sm">
                                    {MethodIcon}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                        {payment.paymentMethod}
                                      </span>
                                      <span className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</span>
                                    </div>
                                    {payment.transactionId && (
                                      <p className="text-xs text-gray-500 mb-2">
                                        Txn ID: {payment.transactionId}
                                      </p>
                                    )}
                                    {payment.notes && (
                                      <p className="text-sm text-gray-600 italic">"{payment.notes}"</p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(payment.amount)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </>
                  )
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW SALARY SLIP MODAL */}
      <AnimatePresence>
        {isViewModalOpen && selectedSalary && selectedPhotographer && (
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
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaFileInvoice />
                      Salary Slip
                    </h2>
                    <p className="text-indigo-100 mt-1">
                      {monthNames[parseInt(selectedSalary.month)]} {selectedSalary.year}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      title="Print Slip"
                    >
                      <FaPrint className="text-xl" />
                    </button>
                    <button
                      onClick={() => setIsViewModalOpen(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>

              <div id="salary-slip-content" className="p-8">
                <div className="text-center mb-8 pb-6 border-b-4 border-indigo-600">
                  <h1 className="text-3xl font-bold text-indigo-600 mb-2">RN PHOTOFILMS</h1>
                  <p className="text-gray-600 text-sm">Professional Photography & Videography Services</p>
                  <h2 className="text-xl font-semibold text-gray-700 mt-4">SALARY SLIP</h2>
                  <p className="text-gray-600 text-sm">
                    For the month of {monthNames[parseInt(selectedSalary.month)]} {selectedSalary.year}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-indigo-600 mb-4">Employee Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold">{selectedPhotographer.name}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">ID</p>
                      <p className="font-semibold">{selectedPhotographer.id}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Working Days</p>
                      <p className="font-semibold">{selectedSalary.workingDays}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Daily Rate</p>
                      <p className="font-semibold">{formatCurrency(selectedSalary.dailyRate)}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-green-600 mb-4">Earnings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between bg-gray-50 p-3 rounded">
                      <span>Basic Salary</span>
                      <span className="font-semibold">{formatCurrency(selectedSalary.basicSalary)}</span>
                    </div>
                    {parseFloat(selectedSalary.bonus || 0) > 0 && (
                      <div className="flex justify-between bg-gray-50 p-3 rounded">
                        <span>Bonus</span>
                        <span className="font-semibold text-green-600">+{formatCurrency(selectedSalary.bonus)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {parseFloat(selectedSalary.deductions || 0) > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-red-600 mb-4">Deductions</h3>
                    <div className="flex justify-between bg-gray-50 p-3 rounded">
                      <span>Total Deductions</span>
                      <span className="font-semibold text-red-600">-{formatCurrency(selectedSalary.deductions)}</span>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl text-center mb-6">
                  <p className="text-lg mb-2">Net Salary</p>
                  <p className="text-4xl font-bold">{formatCurrency(selectedSalary.netSalary)}</p>
                </div>

                {selectedSalary.notes && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Notes</h3>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <p className="text-gray-700 text-sm">{selectedSalary.notes}</p>
                    </div>
                  </div>
                )}

                <div className="mt-16 pt-8 border-t-2 flex justify-between">
                  <div className="text-center">
                    <div className="w-48 border-t-2 border-gray-800 pt-2">
                      <p className="text-sm font-semibold">Employee Signature</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-48 border-t-2 border-gray-800 pt-2">
                      <p className="text-sm font-semibold">Authorized Signatory</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-300 text-center">
                  <p className="text-xs text-gray-500">
                    This is a computer-generated salary slip and does not require a signature.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Generated on {new Date().toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default SalaryProcessor
