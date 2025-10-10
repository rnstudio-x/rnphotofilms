import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaMoneyBillWave, FaCheckCircle, FaExclamationTriangle, FaClock,
  FaSearch, FaFilter, FaPlus, FaEye, FaDownload, FaReceipt,
  FaCreditCard, FaUniversity, FaMobileAlt, FaWallet, FaHistory,
  FaChartLine, FaUser, FaCalendar, FaTimes
} from 'react-icons/fa'

const PaymentTracker = () => {
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    advanceReceived: 0,
    balancePending: 0,
    fullyPaid: 0,
    pendingAdvance: 0,
    overduePayments: 0
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwKBxSj_Qb0_Zoo4OZ7EA9tlZhGBRjXfoCwGpmwUFqKhLxV52AcTUmwzkgfecOc3ZT8dg/exec' // Replace with your actual URL

  useEffect(() => {
    fetchPaymentData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [leads, searchTerm, statusFilter])

  const fetchPaymentData = async () => {
    try {
      setLoading(true)
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getLeads' })
      })

      const result = await response.json()
      
      if (result.success && result.leads) {
        // Only show converted or event completed leads
        const paymentLeads = result.leads.filter(lead => 
          lead.Status === 'Converted' || lead.Status === 'Event Completed'
        )
        setLeads(paymentLeads)
        calculateStats(paymentLeads)
      }
    } catch (error) {
      console.error('Error fetching payment data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (leadsData) => {
    const stats = {
      totalRevenue: 0,
      advanceReceived: 0,
      balancePending: 0,
      fullyPaid: 0,
      pendingAdvance: 0,
      overduePayments: 0
    }

    leadsData.forEach(lead => {
      // Calculate total revenue from budget
      const budget = parseBudget(lead.Budget)
      if (budget > 0) {
        stats.totalRevenue += budget
      }

      // Calculate advance (15% of budget)
      const advanceAmount = budget * 0.15
      const balanceAmount = budget * 0.85

      // Check advance status
      if (lead['Advance Paid'] === 'TRUE' || lead['Advance Paid'] === true) {
        stats.advanceReceived += advanceAmount
      } else {
        stats.pendingAdvance += advanceAmount
      }

      // Check balance status
      if (lead['Balance Paid'] === 'TRUE' || lead['Balance Paid'] === true) {
        stats.fullyPaid++
      } else {
        stats.balancePending += balanceAmount
        
        // Check if overdue (balance due date passed)
        if (lead['Balance Due Date']) {
          const dueDate = new Date(lead['Balance Due Date'])
          const today = new Date()
          if (dueDate < today) {
            stats.overduePayments++
          }
        }
      }
    })

    setStats(stats)
  }

const parseBudget = (budgetString) => {
  if (!budgetString) return 0
  
  // Convert to string if it's not
  const budgetStr = String(budgetString)
  
  // Remove ₹, commas, and parse as number
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
        const advancePaid = lead['Advance Paid'] === 'TRUE' || lead['Advance Paid'] === true
        const balancePaid = lead['Balance Paid'] === 'TRUE' || lead['Balance Paid'] === true

        switch (statusFilter) {
          case 'Fully Paid':
            return advancePaid && balancePaid
          case 'Advance Paid':
            return advancePaid && !balancePaid
          case 'Pending':
            return !advancePaid || !balancePaid
          case 'Overdue':
            if (!lead['Balance Due Date']) return false
            const dueDate = new Date(lead['Balance Due Date'])
            return dueDate < new Date() && !balancePaid
          default:
            return true
        }
      })
    }

    setFilteredLeads(filtered)
  }

  const getPaymentStatus = (lead) => {
    const advancePaid = lead['Advance Paid'] === 'TRUE' || lead['Advance Paid'] === true
    const balancePaid = lead['Balance Paid'] === 'TRUE' || lead['Balance Paid'] === true

    if (advancePaid && balancePaid) {
      return { label: 'Fully Paid', color: 'bg-green-100 text-green-800', icon: FaCheckCircle }
    } else if (advancePaid && !balancePaid) {
      // Check if overdue
      if (lead['Balance Due Date']) {
        const dueDate = new Date(lead['Balance Due Date'])
        if (dueDate < new Date()) {
          return { label: 'Overdue', color: 'bg-red-100 text-red-800', icon: FaExclamationTriangle }
        }
      }
      return { label: 'Balance Pending', color: 'bg-yellow-100 text-yellow-800', icon: FaClock }
    } else {
      return { label: 'Advance Pending', color: 'bg-orange-100 text-orange-800', icon: FaExclamationTriangle }
    }
  }

  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading payment data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Payment Tracker</h1>
          <p className="text-gray-600">Manage payments, track dues, and monitor revenue</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          
          {/* Total Revenue */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-6 text-white col-span-2"
          >
            <div className="flex items-center justify-between mb-2">
              <FaChartLine className="text-3xl opacity-80" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Total</span>
            </div>
            <p className="text-blue-100 text-sm mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</h3>
          </motion.div>

          {/* Advance Received */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-xl p-6 text-white col-span-2"
          >
            <div className="flex items-center justify-between mb-2">
              <FaCheckCircle className="text-3xl opacity-80" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Received</span>
            </div>
            <p className="text-green-100 text-sm mb-1">Advance Received</p>
            <h3 className="text-3xl font-bold">{formatCurrency(stats.advanceReceived)}</h3>
          </motion.div>

          {/* Balance Pending */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-xl p-6 text-white col-span-2"
          >
            <div className="flex items-center justify-between mb-2">
              <FaClock className="text-3xl opacity-80" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Pending</span>
            </div>
            <p className="text-orange-100 text-sm mb-1">Balance Pending</p>
            <h3 className="text-3xl font-bold">{formatCurrency(stats.balancePending)}</h3>
          </motion.div>

          {/* Fully Paid Count */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <p className="text-gray-500 text-sm mb-1">Fully Paid</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.fullyPaid}</h3>
            <p className="text-xs text-gray-500 mt-1">Clients</p>
          </motion.div>

          {/* Pending Advance */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500"
          >
            <p className="text-gray-500 text-sm mb-1">Pending Advance</p>
            <h3 className="text-3xl font-bold text-gray-800">{formatCurrency(stats.pendingAdvance)}</h3>
            <p className="text-xs text-gray-500 mt-1">To collect</p>
          </motion.div>

          {/* Overdue Payments */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500"
          >
            <p className="text-gray-500 text-sm mb-1">Overdue</p>
            <h3 className="text-3xl font-bold text-red-600">{stats.overduePayments}</h3>
            <p className="text-xs text-gray-500 mt-1">Payments</p>
          </motion.div>

        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Fully Paid">Fully Paid</option>
                <option value="Advance Paid">Advance Paid Only</option>
                <option value="Pending">Any Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchPaymentData}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-20">
              <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No payment records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Total Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Advance (15%)</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Balance (85%)</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.map((lead, index) => {
                    const budget = parseBudget(lead.Budget)
                    const advanceAmount = budget * 0.15
                    const balanceAmount = budget * 0.85
                    const status = getPaymentStatus(lead)
                    const StatusIcon = status.icon

                    return (
                      <motion.tr
                        key={lead['Lead ID'] || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-800">{lead['Client Name']}</p>
                            <p className="text-sm text-gray-500">{lead.Phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">{lead['Event Type']}</p>
                          <p className="text-sm text-gray-500">{formatDate(lead['Event Date'])}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-800">{formatCurrency(budget)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">{formatCurrency(advanceAmount)}</p>
                          {(lead['Advance Paid'] === 'TRUE' || lead['Advance Paid'] === true) && (
                            <span className="flex items-center gap-1 text-xs text-green-600 mt-1">
                              <FaCheckCircle /> Paid
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">{formatCurrency(balanceAmount)}</p>
                          {(lead['Balance Paid'] === 'TRUE' || lead['Balance Paid'] === true) ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 mt-1">
                              <FaCheckCircle /> Paid
                            </span>
                          ) : lead['Balance Due Date'] && (
                            <span className="text-xs text-gray-500 mt-1">
                              Due: {formatDate(lead['Balance Due Date'])}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                            <StatusIcon /> {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedLead(lead)
                              setIsModalOpen(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye />
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

      </div>

      {/* Payment Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedLead && (
          <PaymentDetailModal
            lead={selectedLead}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedLead(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Payment Detail Modal Component
const PaymentDetailModal = ({ lead, onClose }) => {
  const budget = parseBudget(lead.Budget)
  const advanceAmount = budget * 0.15
  const balanceAmount = budget * 0.85
  const advancePaid = lead['Advance Paid'] === 'TRUE' || lead['Advance Paid'] === true
  const balancePaid = lead['Balance Paid'] === 'TRUE' || lead['Balance Paid'] === true

const parseBudget = (budgetString) => {
  if (!budgetString) return 0
  
  // Convert to string if it's not
  const budgetStr = String(budgetString)
  
  // Remove ₹, commas, and parse as number
  const cleaned = budgetStr.replace(/[₹,]/g, '').trim()
  return parseFloat(cleaned) || 0
}

  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

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
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{lead['Client Name']}</h3>
              <p className="text-blue-100">{lead['Event Type']} - {formatDate(lead['Event Date'])}</p>
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
          
          {/* Payment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <FaMoneyBillWave className="text-3xl text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(budget)}</p>
            </div>
            <div className={`${advancePaid ? 'bg-green-50' : 'bg-orange-50'} p-4 rounded-xl text-center`}>
              {advancePaid ? <FaCheckCircle className="text-3xl text-green-600 mx-auto mb-2" /> : <FaClock className="text-3xl text-orange-600 mx-auto mb-2" />}
              <p className="text-sm text-gray-600 mb-1">Advance (15%)</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(advanceAmount)}</p>
              <p className={`text-xs font-semibold mt-1 ${advancePaid ? 'text-green-600' : 'text-orange-600'}`}>
                {advancePaid ? 'Paid ✓' : 'Pending'}
              </p>
            </div>
            <div className={`${balancePaid ? 'bg-green-50' : 'bg-yellow-50'} p-4 rounded-xl text-center`}>
              {balancePaid ? <FaCheckCircle className="text-3xl text-green-600 mx-auto mb-2" /> : <FaClock className="text-3xl text-yellow-600 mx-auto mb-2" />}
              <p className="text-sm text-gray-600 mb-1">Balance (85%)</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(balanceAmount)}</p>
              <p className={`text-xs font-semibold mt-1 ${balancePaid ? 'text-green-600' : 'text-yellow-600'}`}>
                {balancePaid ? 'Paid ✓' : 'Pending'}
              </p>
            </div>
          </div>

          {/* Payment Timeline */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaHistory /> Payment Timeline
            </h4>
            
            <div className="space-y-4">
              {/* Advance Payment */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                <div className={`flex-shrink-0 w-12 h-12 ${advancePaid ? 'bg-green-500' : 'bg-gray-300'} rounded-full flex items-center justify-center text-white`}>
                  {advancePaid ? <FaCheckCircle size={24} /> : <FaClock size={24} />}
                </div>
                <div className="flex-grow">
                  <h5 className="font-semibold text-gray-800">Advance Payment</h5>
                  <p className="text-sm text-gray-600">Amount: {formatCurrency(advanceAmount)}</p>
                  {advancePaid && lead['Advance Payment Date'] && (
                    <p className="text-sm text-green-600 mt-1">
                      Paid on: {formatDate(lead['Advance Payment Date'])}
                    </p>
                  )}
                  {!advancePaid && (
                    <p className="text-sm text-orange-600 mt-1">⚠️ Pending</p>
                  )}
                </div>
              </div>

              {/* Balance Payment */}
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 ${balancePaid ? 'bg-green-500' : 'bg-gray-300'} rounded-full flex items-center justify-center text-white`}>
                  {balancePaid ? <FaCheckCircle size={24} /> : <FaClock size={24} />}
                </div>
                <div className="flex-grow">
                  <h5 className="font-semibold text-gray-800">Balance Payment</h5>
                  <p className="text-sm text-gray-600">Amount: {formatCurrency(balanceAmount)}</p>
                  {balancePaid && lead['Balance Payment Date'] && (
                    <p className="text-sm text-green-600 mt-1">
                      Paid on: {formatDate(lead['Balance Payment Date'])}
                    </p>
                  )}
                  {!balancePaid && lead['Balance Due Date'] && (
                    <p className="text-sm text-yellow-600 mt-1">
                      Due by: {formatDate(lead['Balance Due Date'])}
                    </p>
                  )}
                  {!balancePaid && !lead['Balance Due Date'] && (
                    <p className="text-sm text-gray-500 mt-1">No due date set</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaUser /> Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium text-gray-800">{lead.Phone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800 truncate">{lead.Email}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3">
          <a
            href={`tel:${lead.Phone}`}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
          >
            Call Client
          </a>
          <a
            href={`mailto:${lead.Email}`}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
          >
            Send Reminder
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PaymentTracker
