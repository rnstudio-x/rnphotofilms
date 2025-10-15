import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaMoneyBillWave, FaCheckCircle, FaExclamationTriangle, FaClock, FaSearch, 
  FaFilter, FaPlus, FaEye, FaDownload, FaReceipt, FaCreditCard, FaUniversity, 
  FaMobileAlt, FaWallet, FaHistory, FaChartLine, FaUser, FaCalendar, FaTimes,
  FaEdit, FaTrash, FaBell, FaFileInvoice, FaPrint
} from 'react-icons/fa'

const PaymentTracker = () => {
  // State Management
  const [leads, setLeads] = useState([])
  const [payments, setPayments] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)
  const [selectedPayments, setSelectedPayments] = useState([])
  
  // Modal States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  
  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentType: 'Advance',
    paymentMethod: 'UPI',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    notes: ''
  })

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalReceived: 0,
    totalPending: 0,
    fullyPaid: 0,
    partialPaid: 0,
    noPaid: 0,
    overduePayments: 0
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyCFoBNyXT8fmTmlG9RwMO7QVgcuaVpgEUynu-hbG4Hl-zVJf09ArlCbSXNhBX9jDUcpg/exec'

  // Fetch Data
  useEffect(() => {
    fetchAllData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [leads, payments, searchTerm, statusFilter])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      // Fetch Leads
      const leadsResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getLeads' })
      })
      const leadsResult = await leadsResponse.json()
      
      // Fetch Payments
      const paymentsResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getPayments' })
      })
      const paymentsResult = await paymentsResponse.json()

      if (leadsResult.success && leadsResult.leads) {
        // Only show converted or event completed leads
        const paymentLeads = leadsResult.leads.filter(lead => 
          lead.Status === 'Converted' || lead.Status === 'Event Completed'
        )
        setLeads(paymentLeads)
      }

      if (paymentsResult.success && paymentsResult.payments) {
        setPayments(paymentsResult.payments)
      }

      calculateStats(leadsResult.leads || [], paymentsResult.payments || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (leadsData, paymentsData) => {
    const stats = {
      totalRevenue: 0,
      totalReceived: 0,
      totalPending: 0,
      fullyPaid: 0,
      partialPaid: 0,
      noPaid: 0,
      overduePayments: 0
    }

    leadsData.forEach(lead => {
      if (lead.Status !== 'Converted' && lead.Status !== 'Event Completed') return

      const budget = parseBudget(lead.Budget)
      if (budget > 0) {
        stats.totalRevenue += budget
      }

      // Get all payments for this lead
      const leadPayments = paymentsData.filter(p => p.leadId === lead.id)
      const totalPaid = leadPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

      stats.totalReceived += totalPaid
      stats.totalPending += (budget - totalPaid)

      // Categorize payment status
      if (totalPaid >= budget) {
        stats.fullyPaid++
      } else if (totalPaid > 0) {
        stats.partialPaid++
      } else {
        stats.noPaid++
      }

      // Check overdue
      if (lead['Balance Due Date'] && totalPaid < budget) {
        const dueDate = new Date(lead['Balance Due Date'])
        if (dueDate < new Date()) {
          stats.overduePayments++
        }
      }
    })

    setStats(stats)
  }

  const parseBudget = (budgetString) => {
    if (!budgetString) return 0
    const budgetStr = String(budgetString)
    const cleaned = budgetStr.replace(/[₹,]/g, '').trim()
    return parseFloat(cleaned) || 0
  }

  const applyFilters = () => {
    let filtered = leads

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead['Client Name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.Phone?.includes(searchTerm) ||
        lead.Email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(lead => {
        const budget = parseBudget(lead.Budget)
        const leadPayments = payments.filter(p => p.leadId === lead.id)
        const totalPaid = leadPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

        switch (statusFilter) {
          case 'Fully Paid':
            return totalPaid >= budget
          case 'Partial Paid':
            return totalPaid > 0 && totalPaid < budget
          case 'Pending':
            return totalPaid === 0
          case 'Overdue':
            if (!lead['Balance Due Date']) return false
            const dueDate = new Date(lead['Balance Due Date'])
            return dueDate < new Date() && totalPaid < budget
          default:
            return true
        }
      })
    }

    setFilteredLeads(filtered)
  }

  const getPaymentSummary = (lead) => {
    const budget = parseBudget(lead.Budget)
    const leadPayments = payments.filter(p => p.leadId === lead.id)
    const totalPaid = leadPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
    const pending = budget - totalPaid

    let status, color, icon

    if (totalPaid >= budget) {
      status = 'Fully Paid'
      color = 'bg-green-100 text-green-800'
      icon = FaCheckCircle
    } else if (totalPaid > 0) {
      status = 'Partial Paid'
      color = 'bg-yellow-100 text-yellow-800'
      icon = FaClock
    } else {
      status = 'Pending'
      color = 'bg-red-100 text-red-800'
      icon = FaExclamationTriangle
    }

    // Check overdue
    if (lead['Balance Due Date'] && totalPaid < budget) {
      const dueDate = new Date(lead['Balance Due Date'])
      if (dueDate < new Date()) {
        status = 'Overdue'
        color = 'bg-red-100 text-red-800'
        icon = FaExclamationTriangle
      }
    }

    return {
      budget,
      totalPaid,
      pending,
      status,
      color,
      icon,
      paymentCount: leadPayments.length
    }
  }

  const handleAddPayment = async () => {
    if (!selectedLead || !paymentForm.amount) {
      alert('Please fill all required fields')
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'addPayment',
          leadId: selectedLead.id,
          clientName: selectedLead['Client Name'],
          amount: parseFloat(paymentForm.amount),
          paymentType: paymentForm.paymentType,
          paymentMethod: paymentForm.paymentMethod,
          paymentDate: paymentForm.paymentDate,
          transactionId: paymentForm.transactionId,
          notes: paymentForm.notes
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('Payment added successfully!')
        setIsPaymentModalOpen(false)
        resetPaymentForm()
        fetchAllData()
      } else {
        alert('Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error adding payment:', error)
      alert('Failed to add payment')
    }
  }

  const resetPaymentForm = () => {
    setPaymentForm({
      amount: '',
      paymentType: 'Advance',
      paymentMethod: 'UPI',
      paymentDate: new Date().toISOString().split('T')[0],
      transactionId: '',
      notes: ''
    })
  }

  const openPaymentModal = (lead) => {
    setSelectedLead(lead)
    const summary = getPaymentSummary(lead)
    
    // Auto-fill suggested amount (remaining balance)
    setPaymentForm({
      ...paymentForm,
      amount: summary.pending > 0 ? summary.pending.toString() : '',
      paymentType: summary.totalPaid === 0 ? 'Advance' : 'Balance'
    })
    
    setIsPaymentModalOpen(true)
  }

  const openHistoryModal = (lead) => {
    setSelectedLead(lead)
    const leadPayments = payments.filter(p => p.leadId === lead.id)
    setSelectedPayments(leadPayments)
    setIsHistoryModalOpen(true)
  }

  const formatCurrency = (amount) => {
    return '₹' + parseFloat(amount).toLocaleString('en-IN')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <FaMoneyBillWave className="text-blue-600" />
          Payment Tracker
        </h1>
        <p className="text-gray-600">Manage payments, track dues, and monitor revenue</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaChartLine className="text-3xl opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{formatCurrency(stats.totalRevenue)}</h3>
          <p className="text-blue-100 text-sm">Total Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaCheckCircle className="text-3xl opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Received</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{formatCurrency(stats.totalReceived)}</h3>
          <p className="text-green-100 text-sm">{stats.fullyPaid} Fully Paid</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaClock className="text-3xl opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Pending</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{formatCurrency(stats.totalPending)}</h3>
          <p className="text-orange-100 text-sm">{stats.partialPaid} Partial + {stats.noPaid} Unpaid</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaExclamationTriangle className="text-3xl opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Alert</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.overduePayments}</h3>
          <p className="text-red-100 text-sm">Overdue Payments</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="All">All Payments</option>
              <option value="Fully Paid">Fully Paid</option>
              <option value="Partial Paid">Partial Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No payment records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Paid</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Pending</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead, index) => {
                  const summary = getPaymentSummary(lead)
                  const StatusIcon = summary.icon

                  return (
                    <motion.tr
                      key={lead.id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{lead['Client Name']}</div>
                          <div className="text-sm text-gray-500">{lead.Phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{lead['Event Type']}</div>
                          <div className="text-sm text-gray-500">{formatDate(lead['Event Date'])}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        {formatCurrency(summary.budget)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold text-green-600">
                          {formatCurrency(summary.totalPaid)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {summary.paymentCount} payment{summary.paymentCount !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-semibold ${summary.pending > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                          {formatCurrency(summary.pending)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${summary.color}`}>
                            <StatusIcon />
                            {summary.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openPaymentModal(lead)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Add Payment"
                          >
                            <FaPlus />
                          </button>
                          <button
                            onClick={() => openHistoryModal(lead)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="View History"
                          >
                            <FaHistory />
                          </button>
                          <button
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Generate Receipt"
                          >
                            <FaReceipt />
                          </button>
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

      {/* Add Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaMoneyBillWave />
                      Add Payment
                    </h2>
                    <p className="text-blue-100 mt-1">{selectedLead?.['Client Name']}</p>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Payment Summary */}
                {selectedLead && (() => {
                  const summary = getPaymentSummary(selectedLead)
                  return (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(summary.budget)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Already Paid</p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(summary.totalPaid)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Remaining</p>
                          <p className="text-lg font-bold text-orange-600">{formatCurrency(summary.pending)}</p>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* Payment Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={paymentForm.amount}
                          onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Type *
                      </label>
                      <select
                        value={paymentForm.paymentType}
                        onChange={(e) => setPaymentForm({ ...paymentForm, paymentType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Advance">Advance</option>
                        <option value="Balance">Balance</option>
                        <option value="Full Payment">Full Payment</option>
                        <option value="Partial">Partial Payment</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method *
                      </label>
                      <select
                        value={paymentForm.paymentMethod}
                        onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        Payment Date *
                      </label>
                      <input
                        type="date"
                        value={paymentForm.paymentDate}
                        onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter transaction ID or reference number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={paymentForm.notes}
                      onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Add any additional notes..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddPayment}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle />
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

      {/* Payment History Modal */}
      <AnimatePresence>
        {isHistoryModalOpen && (
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
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaHistory />
                      Payment History
                    </h2>
                    <p className="text-green-100 mt-1">{selectedLead?.['Client Name']}</p>
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
                {selectedPayments.length === 0 ? (
                  <div className="text-center py-12">
                    <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No payment history found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedPayments.map((payment, index) => (
                      <motion.div
                        key={payment.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{payment.paymentType}</h3>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {payment.paymentMethod}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {formatDate(payment.paymentDate)}
                              </p>
                              {payment.transactionId && (
                                <p className="text-xs text-gray-500">
                                  Txn ID: {payment.transactionId}
                                </p>
                              )}
                              {payment.notes && (
                                <p className="text-sm text-gray-600 mt-2 italic">
                                  "{payment.notes}"
                                </p>
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
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PaymentTracker
