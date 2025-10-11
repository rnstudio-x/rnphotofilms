import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FaChartLine, FaChartPie, FaChartBar, FaDownload,
  FaCalendarAlt, FaFilter, FaMoneyBillWave, FaUsers,
  FaTrophy, FaPercentage, FaArrowUp, FaArrowDown,
  FaFileExcel, FaFilePdf, FaPrint, FaCamera, FaCheckCircle
} from 'react-icons/fa'

// SAFE parseBudget function - defined OUTSIDE component
const parseBudget = (budgetValue) => {
  if (!budgetValue) return 0
  
  // Ensure it's a string
  const budgetStr = typeof budgetValue === 'string' ? budgetValue : String(budgetValue)
  
  // Remove ₹, commas, spaces and parse
  const cleaned = budgetStr.replace(/[₹,\s]/g, '').trim()
  const parsed = parseFloat(cleaned)
  
  return isNaN(parsed) ? 0 : parsed
}

const ReportsAnalytics = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('all')
  const [analytics, setAnalytics] = useState({
    totalLeads: 0,
    converted: 0,
    revenue: 0,
    conversionRate: 0,
    avgDealSize: 0,
    eventsByType: {},
    monthlyTrend: [],
    topPackages: [],
    sourceAnalysis: {}
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzX0rollFXcrI5d8qKhWlLslCX71JDSnlwAVtLLsqmDze2Jhi9_FbpMg-wIvELxe83fZQ/exec'

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  useEffect(() => {
    if (leads.length > 0) {
      calculateAnalytics()
    }
  }, [leads, dateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getLeads' })
      })

      const result = await response.json()
      
      if (result.success && result.leads) {
        setLeads(result.leads)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = () => {
    let filteredLeads = leads

    // Apply date filter
    if (dateRange === 'month') {
      const today = new Date()
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
      filteredLeads = leads.filter(lead => {
        if (!lead['Created At']) return false
        const createdDate = new Date(lead['Created At'])
        return createdDate >= lastMonth
      })
    } else if (dateRange === 'week') {
      const today = new Date()
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredLeads = leads.filter(lead => {
        if (!lead['Created At']) return false
        const createdDate = new Date(lead['Created At'])
        return createdDate >= lastWeek
      })
    }

    // Calculate metrics
    const totalLeads = filteredLeads.length
    const converted = filteredLeads.filter(l => 
      l.Status === 'Converted' || l.Status === 'Event Completed'
    ).length

    // Calculate revenue - USE SAFE parseBudget
    let totalRevenue = 0
    filteredLeads.forEach(lead => {
      if (lead.Status === 'Converted' || lead.Status === 'Event Completed') {
        try {
          const budget = parseBudget(lead.Budget)
          totalRevenue += budget
        } catch (err) {
          console.warn('Budget parse error:', err)
        }
      }
    })

    const conversionRate = totalLeads > 0 ? (converted / totalLeads * 100).toFixed(1) : 0
    const avgDealSize = converted > 0 ? Math.round(totalRevenue / converted) : 0

    // Events by type
    const eventsByType = {}
    filteredLeads.forEach(lead => {
      const type = lead['Event Type'] || 'Other'
      eventsByType[type] = (eventsByType[type] || 0) + 1
    })

    // Source analysis
    const sourceAnalysis = {}
    filteredLeads.forEach(lead => {
      const source = lead.Source || 'Direct'
      sourceAnalysis[source] = (sourceAnalysis[source] || 0) + 1
    })

    // Top packages
    const packageCounts = {}
    filteredLeads.forEach(lead => {
      if (lead['Package Category']) {
        const pkg = lead['Package Category']
        packageCounts[pkg] = (packageCounts[pkg] || 0) + 1
      }
    })
    const topPackages = Object.entries(packageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    // Monthly trend (last 6 months)
    const monthlyTrend = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleString('en', { month: 'short' })
      
      const monthLeads = leads.filter(lead => {
        if (!lead['Created At']) return false
        const leadDate = new Date(lead['Created At'])
        return leadDate.getMonth() === date.getMonth() && 
               leadDate.getFullYear() === date.getFullYear()
      }).length

      monthlyTrend.push({ month: monthName, leads: monthLeads })
    }

    setAnalytics({
      totalLeads,
      converted,
      revenue: totalRevenue,
      conversionRate: parseFloat(conversionRate),
      avgDealSize,
      eventsByType,
      monthlyTrend,
      topPackages,
      sourceAnalysis
    })
  }

  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN')
  }

  const exportToCSV = () => {
    const headers = ['Lead ID', 'Client Name', 'Email', 'Phone', 'Event Type', 'Event Date', 'Status', 'Budget', 'Package']
    const rows = leads.map(lead => [
      lead['Lead ID'],
      lead['Client Name'],
      lead.Email,
      lead.Phone,
      lead['Event Type'],
      lead['Event Date'],
      lead.Status,
      lead.Budget,
      lead['Package Category']
    ])

    let csvContent = headers.join(',') + '\n'
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell || ''}"`).join(',') + '\n'
    })

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RN_PhotoFilms_Report_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const printReport = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading analytics...</p>
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
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Reports & Analytics</h1>
              <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaFileExcel /> Export CSV
              </button>
              <button
                onClick={printReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaPrint /> Print Report
              </button>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <FaCalendarAlt className="text-gray-400 text-xl" />
            <span className="text-gray-700 font-semibold">Time Period:</span>
            
            <div className="flex gap-2">
              {['all', 'month', 'week'].map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    dateRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range === 'all' ? 'All Time' : range === 'month' ? 'Last Month' : 'Last Week'}
                </button>
              ))}
            </div>

            <button
              onClick={fetchAnalyticsData}
              className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <FaUsers className="text-4xl opacity-80" />
              <FaArrowUp className="text-2xl" />
            </div>
            <p className="text-blue-100 text-sm mb-1">Total Leads</p>
            <h3 className="text-4xl font-bold">{analytics.totalLeads}</h3>
            <p className="text-xs text-blue-100 mt-2">All enquiries received</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <FaPercentage className="text-4xl opacity-80" />
              <FaTrophy className="text-2xl" />
            </div>
            <p className="text-green-100 text-sm mb-1">Conversion Rate</p>
            <h3 className="text-4xl font-bold">{analytics.conversionRate}%</h3>
            <p className="text-xs text-green-100 mt-2">{analytics.converted} converted</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <FaMoneyBillWave className="text-4xl opacity-80" />
              <FaChartLine className="text-2xl" />
            </div>
            <p className="text-purple-100 text-sm mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold">{formatCurrency(analytics.revenue)}</h3>
            <p className="text-xs text-purple-100 mt-2">From converted leads</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <FaChartBar className="text-4xl opacity-80" />
              <FaCheckCircle className="text-2xl" />
            </div>
            <p className="text-orange-100 text-sm mb-1">Avg Deal Size</p>
            <h3 className="text-3xl font-bold">{formatCurrency(analytics.avgDealSize)}</h3>
            <p className="text-xs text-orange-100 mt-2">Per converted lead</p>
          </motion.div>
        </div>

        {/* Charts Grid - Simplified */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Monthly Trend */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaChartLine className="text-blue-600" />
              Monthly Lead Trend
            </h3>
            
            <div className="space-y-4">
              {analytics.monthlyTrend.map((item, index) => {
                const maxLeads = Math.max(...analytics.monthlyTrend.map(m => m.leads), 1)
                const percentage = (item.leads / maxLeads) * 100
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{item.month}</span>
                      <span className="text-sm font-bold text-blue-600">{item.leads} leads</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Event Types */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaChartPie className="text-purple-600" />
              Events by Type
            </h3>
            
            <div className="space-y-4">
              {Object.entries(analytics.eventsByType)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count], index) => {
                  const total = Object.values(analytics.eventsByType).reduce((a, b) => a + b, 0)
                  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0
                  
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">{type}</span>
                        <span className="text-sm font-bold text-purple-600">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ReportsAnalytics
