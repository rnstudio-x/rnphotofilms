import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaChartBar, FaDownload, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa'

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState('month')
  const [loading, setLoading] = useState(false)

  const reportData = {
    totalRevenue: 450000,
    totalExpenses: 125000,
    netProfit: 325000,
    profitMargin: 72.2,
    totalEvents: 24,
    completedEvents: 18,
    pendingPayments: 85000,
    monthlyGrowth: 18.5
  }

  const monthlyData = [
    { month: 'Jan', revenue: 45000, expenses: 15000 },
    { month: 'Feb', revenue: 52000, expenses: 18000 },
    { month: 'Mar', revenue: 48000, expenses: 16000 },
    { month: 'Apr', revenue: 65000, expenses: 22000 },
    { month: 'May', revenue: 58000, expenses: 19000 },
    { month: 'Jun', revenue: 72000, expenses: 24000 }
  ]

  const exportReport = () => {
    alert('Report export functionality will be implemented with Google Sheets integration!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-charcoal mb-2">Reports & Analytics</h2>
          <p className="text-gray-600">Business performance insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">This Year</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportReport}
            className="bg-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
          >
            <FaDownload /> Export
          </motion.button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-500 mb-2">Total Revenue</p>
          <h3 className="text-3xl font-bold text-green-600 mb-2">₹{reportData.totalRevenue.toLocaleString()}</h3>
          <p className="text-xs text-green-500">↑ {reportData.monthlyGrowth}% from last period</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-500 mb-2">Total Expenses</p>
          <h3 className="text-3xl font-bold text-red-600 mb-2">₹{reportData.totalExpenses.toLocaleString()}</h3>
          <p className="text-xs text-gray-500">Operating costs</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-500 mb-2">Net Profit</p>
          <h3 className="text-3xl font-bold text-blue-600 mb-2">₹{reportData.netProfit.toLocaleString()}</h3>
          <p className="text-xs text-blue-500">{reportData.profitMargin}% margin</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-500 mb-2">Pending Payments</p>
          <h3 className="text-3xl font-bold text-orange-600 mb-2">₹{reportData.pendingPayments.toLocaleString()}</h3>
          <p className="text-xs text-orange-500">Awaiting collection</p>
        </motion.div>
      </div>

      {/* Revenue vs Expenses Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-charcoal mb-6">Revenue vs Expenses</h3>
        <div className="h-80 flex items-end justify-around gap-4">
          {monthlyData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex gap-1 items-end h-64">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.revenue / 72000) * 100}%` }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
                  title={`Revenue: ₹${data.revenue.toLocaleString()}`}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.expenses / 72000) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.05, type: 'spring' }}
                  className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg"
                  title={`Expenses: ₹${data.expenses.toLocaleString()}`}
                />
              </div>
              <span className="text-xs text-gray-600 font-semibold">{data.month}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </div>

      {/* Events Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-charcoal mb-4">Event Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Events</span>
              <span className="text-2xl font-bold text-charcoal">{reportData.totalEvents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="text-2xl font-bold text-green-600">{reportData.completedEvents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="text-2xl font-bold text-orange-600">{reportData.totalEvents - reportData.completedEvents}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gold to-amber-500 rounded-2xl p-6 shadow-lg text-white">
          <h3 className="text-xl font-bold mb-4">Quick Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <FaChartBar />
              <span>Revenue up {reportData.monthlyGrowth}% this month</span>
            </li>
            <li className="flex items-center gap-2">
              <FaMoneyBillWave />
              <span>Average event value: ₹{Math.round(reportData.totalRevenue / reportData.totalEvents).toLocaleString()}</span>
            </li>
            <li className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>Peak season: April-June</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ReportsAnalytics
