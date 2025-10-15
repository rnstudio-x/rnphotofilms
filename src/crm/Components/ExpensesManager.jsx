import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaReceipt, FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaFilter, FaDownload, FaChartPie, FaMoneyBillWave,
  FaTimes, FaSave, FaCalendarAlt, FaFileInvoice,
  FaCamera, FaGasPump, FaCoffee, FaTools, FaShoppingBag,
  FaBolt, FaWifi, FaPhone, FaHome, FaChevronLeft, FaChevronRight
} from 'react-icons/fa'

const ExpensesManager = () => {
  const [expenses, setExpenses] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  
  const [formData, setFormData] = useState({
    category: 'Equipment',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    vendor: '',
    notes: ''
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyCFoBNyXT8fmTmlG9RwMO7QVgcuaVpgEUynu-hbG4Hl-zVJf09ArlCbSXNhBX9jDUcpg/exec'

  const categories = [
    { name: 'Equipment', icon: FaCamera, color: 'from-blue-500 to-blue-600' },
    { name: 'Travel', icon: FaGasPump, color: 'from-green-500 to-green-600' },
    { name: 'Food', icon: FaCoffee, color: 'from-orange-500 to-orange-600' },
    { name: 'Maintenance', icon: FaTools, color: 'from-purple-500 to-purple-600' },
    { name: 'Marketing', icon: FaShoppingBag, color: 'from-pink-500 to-pink-600' },
    { name: 'Utilities', icon: FaBolt, color: 'from-yellow-500 to-yellow-600' },
    { name: 'Internet', icon: FaWifi, color: 'from-indigo-500 to-indigo-600' },
    { name: 'Phone', icon: FaPhone, color: 'from-teal-500 to-teal-600' },
    { name: 'Rent', icon: FaHome, color: 'from-red-500 to-red-600' },
    { name: 'Other', icon: FaReceipt, color: 'from-gray-500 to-gray-600' }
  ]

  useEffect(() => {
    fetchExpenses()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [expenses, searchTerm, categoryFilter, currentMonth])

  // ==================== FETCH (READ) ====================
  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getExpenses' })
      })

      const result = await response.json()
      
      if (result.success && result.expenses) {
        setExpenses(result.expenses)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      alert('Failed to fetch expenses. Please check console.')
    } finally {
      setLoading(false)
    }
  }

  // ==================== CREATE ====================
  const handleAddExpense = async () => {
    if (!formData.amount || !formData.description) {
      alert('⚠️ Amount and Description are required!')
      return
    }

    try {
      const expenseData = {
        action: 'addExpense',
        ...formData,
        id: 'EXP-' + new Date().getTime(),
        createdAt: new Date().toISOString()
      }

      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(expenseData)
      })

      const result = await response.json()
      
      if (result.success) {
        alert('✅ Expense added successfully!')
        setIsAddModalOpen(false)
        resetForm()
        fetchExpenses()
      } else {
        alert('❌ Failed to add expense: ' + result.error)
      }
    } catch (error) {
      console.error('Error adding expense:', error)
      alert('❌ Error adding expense. Check console.')
    }
  }

  // ==================== UPDATE ====================
  const handleUpdateExpense = async () => {
    if (!formData.amount || !formData.description) {
      alert('⚠️ Amount and Description are required!')
      return
    }

    try {
      const updateData = {
        action: 'updateExpense',
        id: selectedExpense.id,
        ...formData,
        updatedAt: new Date().toISOString()
      }

      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()
      
      if (result.success) {
        alert('✅ Expense updated successfully!')
        setIsEditModalOpen(false)
        resetForm()
        fetchExpenses()
      } else {
        alert('❌ Failed to update expense: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating expense:', error)
      alert('❌ Error updating expense. Check console.')
    }
  }

  // ==================== DELETE ====================
  const handleDeleteExpense = async (expense) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete this expense?\n\n${expense.description}\nAmount: ₹${expense.amount}\n\nThis action cannot be undone!`
    )

    if (!confirmed) return

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'deleteExpense',
          id: expense.id
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('✅ Expense deleted successfully!')
        fetchExpenses()
      } else {
        alert('❌ Failed to delete expense: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('❌ Error deleting expense. Check console.')
    }
  }

  // ==================== HELPERS ====================
  const applyFilters = () => {
    let filtered = expenses

    // Month filter
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    filtered = filtered.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= monthStart && expenseDate <= monthEnd
    })

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(expense => expense.category === categoryFilter)
    }

    setFilteredExpenses(filtered)
  }

  const resetForm = () => {
    setFormData({
      category: 'Equipment',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      vendor: '',
      notes: ''
    })
    setSelectedExpense(null)
  }

  const openEditModal = (expense) => {
    setSelectedExpense(expense)
    setFormData({
      category: expense.category || 'Equipment',
      amount: expense.amount || '',
      description: expense.description || '',
      date: expense.date || new Date().toISOString().split('T')[0],
      paymentMethod: expense.paymentMethod || 'Cash',
      vendor: expense.vendor || '',
      notes: expense.notes || ''
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (expense) => {
    setSelectedExpense(expense)
    setIsViewModalOpen(true)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCurrency = (amount) => {
    return '₹' + parseFloat(amount || 0).toLocaleString('en-IN')
  }

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(c => c.name === categoryName)
    return category ? category.icon : FaReceipt
  }

  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName)
    return category ? category.color : 'from-gray-500 to-gray-600'
  }

  // Calculate stats
  const totalExpense = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)
  const categoryStats = {}
  filteredExpenses.forEach(exp => {
    const cat = exp.category || 'Other'
    categoryStats[cat] = (categoryStats[cat] || 0) + parseFloat(exp.amount || 0)
  })

  const changeMonth = (delta) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1))
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Description', 'Amount', 'Vendor', 'Payment Method', 'Notes']
    const rows = filteredExpenses.map(exp => [
      exp.date,
      exp.category,
      exp.description,
      exp.amount,
      exp.vendor,
      exp.paymentMethod,
      exp.notes
    ])

    let csvContent = headers.join(',') + '\n'
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell || ''}"`).join(',') + '\n'
    })

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Expenses_${monthNames[currentMonth.getMonth()]}_${currentMonth.getFullYear()}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading expenses...</p>
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
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Expenses Manager</h1>
              <p className="text-gray-600">Track and manage business expenses</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaDownload /> Export
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
              >
                <FaPlus /> Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => changeMonth(-1)}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronLeft className="text-xl" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            
            <button
              onClick={() => changeMonth(1)}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronRight className="text-xl" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <FaMoneyBillWave className="text-4xl opacity-80" />
            </div>
            <p className="text-red-100 text-sm mb-1">Total Expenses</p>
            <h3 className="text-3xl font-bold">{formatCurrency(totalExpense)}</h3>
            <p className="text-xs text-red-100 mt-2">{filteredExpenses.length} transactions</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <p className="text-gray-500 text-sm mb-1">Avg Expense</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {formatCurrency(filteredExpenses.length > 0 ? totalExpense / filteredExpenses.length : 0)}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Per transaction</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <p className="text-gray-500 text-sm mb-1">Highest Expense</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {formatCurrency(
                filteredExpenses.length > 0 
                  ? Math.max(...filteredExpenses.map(e => parseFloat(e.amount || 0)))
                  : 0
              )}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Single transaction</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <p className="text-gray-500 text-sm mb-1">Categories</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {Object.keys(categoryStats).length}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Active categories</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.keys(categoryStats).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaChartPie className="text-purple-600" />
              Category Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(categoryStats)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount], index) => {
                  const percentage = ((amount / totalExpense) * 100).toFixed(1)
                  const Icon = getCategoryIcon(category)
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="text-gray-500" />
                          <span className="font-semibold text-gray-700">{category}</span>
                        </div>
                        <span className="font-bold text-gray-800">{formatCurrency(amount)} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`bg-gradient-to-r ${getCategoryColor(category)} h-full rounded-full`}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Expenses Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">All Expenses</h3>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="text-center py-20">
              <FaReceipt className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No expenses found for this period</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Expense
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExpenses.map((expense, index) => {
                    const Icon = getCategoryIcon(expense.category)
                    
                    return (
                      <motion.tr
                        key={expense.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {new Date(expense.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 bg-gradient-to-br ${getCategoryColor(expense.category)} rounded-full flex items-center justify-center text-white`}>
                              <Icon size={14} />
                            </div>
                            <span className="font-medium text-gray-800">{expense.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">{expense.description}</p>
                          {expense.notes && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">{expense.notes}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {expense.vendor || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-800 text-lg">
                            {formatCurrency(expense.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {expense.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openViewModal(expense)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => openEditModal(expense)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
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

      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <ExpenseFormModal
            isOpen={isAddModalOpen || isEditModalOpen}
            isEdit={isEditModalOpen}
            formData={formData}
            categories={categories}
            onInputChange={handleInputChange}
            onSave={isEditModalOpen ? handleUpdateExpense : handleAddExpense}
            onClose={() => {
              isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false)
              resetForm()
            }}
          />
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedExpense && (
          <ExpenseViewModal
            expense={selectedExpense}
            getCategoryIcon={getCategoryIcon}
            getCategoryColor={getCategoryColor}
            formatCurrency={formatCurrency}
            onClose={() => {
              setIsViewModalOpen(false)
              setSelectedExpense(null)
            }}
            onEdit={() => {
              setIsViewModalOpen(false)
              openEditModal(selectedExpense)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ==================== FORM MODAL ====================
const ExpenseFormModal = ({ isOpen, isEdit, formData, categories, onInputChange, onSave, onClose }) => {
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
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">
              {isEdit ? 'Edit Expense' : 'Add New Expense'}
            </h3>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => onInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount (₹) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => onInputChange('amount', e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => onInputChange('description', e.target.value)}
                placeholder="What was this expense for?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => onInputChange('date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => onInputChange('paymentMethod', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vendor/Supplier (Optional)
              </label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => onInputChange('vendor', e.target.value)}
                placeholder="Who did you pay?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => onInputChange('notes', e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
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
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <FaSave /> {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ==================== VIEW MODAL ====================
const ExpenseViewModal = ({ expense, getCategoryIcon, getCategoryColor, formatCurrency, onClose, onEdit }) => {
  const Icon = getCategoryIcon(expense.category)

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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
      >
        {/* Modal Header */}
        <div className={`bg-gradient-to-r ${getCategoryColor(expense.category)} text-white p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Icon className="text-3xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{expense.category}</h3>
                <p className="text-white/80">{expense.description}</p>
              </div>
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
          
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <p className="text-sm text-gray-500 mb-2">Amount Spent</p>
            <p className="text-4xl font-bold text-gray-800">{formatCurrency(expense.amount)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(expense.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="font-semibold text-gray-800">{expense.paymentMethod}</p>
            </div>
          </div>

          {expense.vendor && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Vendor/Supplier</p>
              <p className="font-semibold text-gray-800">{expense.vendor}</p>
            </div>
          )}

          {expense.notes && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 font-semibold mb-2">Notes</p>
              <p className="text-gray-700">{expense.notes}</p>
            </div>
          )}

          {expense.createdAt && (
            <div className="text-center text-xs text-gray-500">
              Created on: {new Date(expense.createdAt).toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <FaEdit /> Edit Expense
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExpensesManager
