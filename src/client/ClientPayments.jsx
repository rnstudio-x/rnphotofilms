import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaArrowLeft, FaMoneyBillWave, FaCheckCircle, FaExclamationCircle,
  FaClock, FaDownload, FaReceipt, FaCreditCard, FaMobileAlt,
  FaUniversity, FaCalendarAlt, FaFileInvoice, FaChartLine
} from 'react-icons/fa'
import moment from 'moment'

const ClientPayments = () => {
  const navigate = useNavigate()
  const [clientData, setClientData] = useState(null)
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, received, pending
  const [selectedPayment, setSelectedPayment] = useState(null)

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
      fetchPayments(parsed.id, token)
    } catch (error) {
      console.error('Auth error:', error)
      navigate('/client/login')
    }
  }

  const fetchPayments = async (clientId, token) => {
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

      if (result.success) {
        setPayments(result.payments || [])
        setStats(result.stats || {})
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'received':
      case 'paid':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'overdue':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'received':
      case 'paid':
        return <FaCheckCircle className="text-green-600" />
      case 'pending':
        return <FaClock className="text-yellow-600" />
      case 'overdue':
        return <FaExclamationCircle className="text-red-600" />
      default:
        return <FaClock className="text-gray-600" />
    }
  }

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'cash':
        return <FaMoneyBillWave className="text-green-600" />
      case 'card':
      case 'credit card':
      case 'debit card':
        return <FaCreditCard className="text-blue-600" />
      case 'upi':
      case 'online':
        return <FaMobileAlt className="text-purple-600" />
      case 'bank transfer':
      case 'neft':
      case 'rtgs':
        return <FaUniversity className="text-indigo-600" />
      default:
        return <FaReceipt className="text-gray-600" />
    }
  }

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true
    if (filter === 'received') return payment.status?.toLowerCase() === 'received'
    if (filter === 'pending') return payment.status?.toLowerCase() === 'pending'
    return true
  })

  const downloadInvoice = (payment) => {
    // Placeholder for invoice download functionality
    alert(`Invoice ${payment.invoiceNumber} download will be implemented with backend integration`)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
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
                <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
                <p className="text-sm text-gray-600">Track all your payments & invoices</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 mb-1">Total Amount</p>
                <p className="text-3xl font-bold">
                  ₹{((stats?.totalPaid || 0) + (stats?.pendingAmount || 0)).toLocaleString('en-IN')}
                </p>
              </div>
              <FaChartLine className="text-4xl opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 mb-1">Amount Paid</p>
                <p className="text-3xl font-bold">
                  ₹{(stats?.totalPaid || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <FaCheckCircle className="text-4xl opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 mb-1">Pending Amount</p>
                <p className="text-3xl font-bold">
                  ₹{(stats?.pendingAmount || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <FaExclamationCircle className="text-4xl opacity-50" />
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Payments ({payments.length})
          </button>
          <button
            onClick={() => setFilter('received')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              filter === 'received'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Received ({payments.filter(p => p.status?.toLowerCase() === 'received').length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              filter === 'pending'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pending ({payments.filter(p => p.status?.toLowerCase() === 'pending').length})
          </button>
        </div>

        {/* Payments Timeline */}
        {filteredPayments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Payments Found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "No payment records available."
                : `No ${filter} payments found.`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment, index) => (
              <motion.div
                key={payment.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Payment Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                        {getPaymentMethodIcon(payment.paymentMode)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">
                            ₹{parseFloat(payment.amount || 0).toLocaleString('en-IN')}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            {payment.status || 'Pending'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="text-blue-600" />
                            <span>
                              {payment.date 
                                ? moment(payment.date).format('MMM DD, YYYY')
                                : 'Date not set'}
                            </span>
                          </div>

                          {payment.paymentMode && (
                            <div className="flex items-center gap-2 text-gray-600">
                              {getPaymentMethodIcon(payment.paymentMode)}
                              <span className="capitalize">{payment.paymentMode}</span>
                            </div>
                          )}

                          {payment.invoiceNumber && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaFileInvoice className="text-purple-600" />
                              <span>Invoice: {payment.invoiceNumber}</span>
                            </div>
                          )}
                        </div>

                        {payment.clientName && (
                          <p className="text-sm text-gray-500 mt-2">
                            Client: {payment.clientName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-shrink-0">
                      {payment.invoiceNumber && (
                        <button
                          onClick={() => downloadInvoice(payment)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2 font-semibold"
                        >
                          <FaDownload />
                          <span className="hidden sm:inline">Invoice</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2 font-semibold"
                      >
                        <FaReceipt />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Progress Bar */}
                {payment.status?.toLowerCase() === 'pending' && (
                  <div className="px-6 pb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 w-0 animate-pulse"></div>
                    </div>
                    <p className="text-xs text-orange-600 mt-2 font-semibold">
                      Payment Pending - Please complete soon
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
            onClick={() => setSelectedPayment(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Payment Details</h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Amount</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{parseFloat(selectedPayment.amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">
                    {moment(selectedPayment.date).format('MMMM DD, YYYY')}
                  </span>
                </div>

                {selectedPayment.paymentMode && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-semibold capitalize">{selectedPayment.paymentMode}</span>
                  </div>
                )}

                {selectedPayment.invoiceNumber && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Invoice Number</span>
                    <span className="font-semibold">{selectedPayment.invoiceNumber}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => downloadInvoice(selectedPayment)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <FaDownload />
                  Download Invoice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ClientPayments
