import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaTrash, FaTimes, FaMoneyBillWave } from 'react-icons/fa'
import googleSheetsAPI from '../Utils/googleSheets'

const ExpensesManager = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Equipment',
    description: '',
    amount: '',
    paymentMode: 'Cash',
    remarks: ''
  })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const response = await googleSheetsAPI.getExpenses()
      if (response.success) {
        setExpenses(response.data)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await googleSheetsAPI.addExpense(formData)
      setShowAddModal(false)
      fetchExpenses()
      resetForm()
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  const handleDelete = async (expenseId) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await googleSheetsAPI.deleteExpense(expenseId)
        fetchExpenses()
      } catch (error) {
        console.error('Error deleting expense:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: 'Equipment',
      description: '',
      amount: '',
      paymentMode: 'Cash',
      remarks: ''
    })
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
          <h3 className="text-3xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowAddModal(true)}
          className="bg-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
        >
          <FaPlus /> Add Expense
        </motion.button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Description</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Payment</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-charcoal">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No expenses found</td>
              </tr>
            ) : (
              expenses.map((expense, index) => (
                <tr key={expense.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{expense.date}</td>
                  <td className="px-6 py-4 text-sm">{expense.category}</td>
                  <td className="px-6 py-4 text-sm">{expense.description}</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">₹{parseFloat(expense.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{expense.paymentMode}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
            >
              <div className="bg-gold text-white px-6 py-4 flex justify-between rounded-t-2xl">
                <h3 className="text-2xl font-bold">Add Expense</h3>
                <button onClick={() => setShowAddModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="w-full px-4 py-3 border rounded-xl focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl focus:border-gold"
                    >
                      <option value="Equipment">Equipment</option>
                      <option value="Travel">Travel</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Salary">Salary</option>
                      <option value="Rent">Rent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description *</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Amount (₹) *</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      className="w-full px-4 py-3 border rounded-xl focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Payment Mode</label>
                    <select
                      name="paymentMode"
                      value={formData.paymentMode}
                      onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl focus:border-gold"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-gold text-white rounded-xl font-semibold">
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExpensesManager
