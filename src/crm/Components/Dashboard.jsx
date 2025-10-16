import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaUsers, FaMoneyBillWave, FaCalendarCheck, FaClock,
  FaChartLine, FaTrophy, FaFire, FaExclamationTriangle,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaCamera,
  FaFileInvoice, FaCheckCircle, FaBell, FaDownload,
  FaPlus, FaArrowUp, FaArrowDown, FaTimes
} from 'react-icons/fa'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts'

const Dashboard = ({ onNavigate }) => {
  const navigate = useNavigate()
  
  // ==================== STATE MANAGEMENT ====================
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contacted: 0,
    converted: 0,
    eventCompleted: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    receivedPayments: 0,
    conversionRate: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalPhotographers: 0,
    activePhotographers: 0
  })

  const [recentLeads, setRecentLeads] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [recentPayments, setRecentPayments] = useState([])
  const [chartData, setChartData] = useState({
    revenue: [],
    leadsByType: [],
    paymentStatus: []
  })
  const [loading, setLoading] = useState(true)
  const [quickAddModal, setQuickAddModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventDetailsModal, setEventDetailsModal] = useState(false)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyCFoBNyXT8fmTmlG9RwMO7QVgcuaVpgEUynu-hbG4Hl-zVJf09ArlCbSXNhBX9jDUcpg/exec'

  // ==================== DATA FETCHING ====================
  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 300000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const [leadsRes, eventsRes, paymentsRes, photographersRes] = await Promise.all([
        fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'getLeads' })
        }),
        fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'getEvents' })
        }),
        fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'getPayments' })
        }),
        fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'getPhotographers' })
        })
      ])

      const leads = await leadsRes.json()
      const events = await eventsRes.json()
      const payments = await paymentsRes.json()
      const photographers = await photographersRes.json()

      if (leads.success && events.success && payments.success) {
        processData(
          leads.leads || [],
          events.events || [],
          payments.payments || [],
          photographers.photographers || []
        )
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const processData = (leads, events, payments, photographers) => {
    const totalRevenue = payments
      .filter(p => p.status === 'Received')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

    const pendingPayments = payments
      .filter(p => p.status === 'Pending')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    
    // Get upcoming from Events sheet
    const upcomingFromEvents = events.filter(e => {
      if (!e.eventDate) return false
      const eventDate = new Date(e.eventDate)
      return eventDate >= today && eventDate <= nextMonth
    }).map(e => ({
      ...e,
      source: 'events',
      status: e.status || 'Scheduled'
    }))
    
    // Get upcoming from Leads sheet
    const upcomingFromLeads = leads.filter(lead => {
      if (!['Converted', 'Event Completed'].includes(lead.Status)) return false
      if (!lead['Event Date']) return false
      const eventDate = new Date(lead['Event Date'])
      return eventDate >= today && eventDate <= nextMonth
    }).map(lead => ({
      id: lead.id,
      clientName: lead['Client Name'],
      eventType: lead['Event Type'],
      eventDate: lead['Event Date'],
      venue: lead.Venue || '',
      phone: lead.Phone,
      email: lead.Email,
      amount: lead.Amount || 0,
      photographer: lead.Photographer || '',
      source: 'leads',
      status: lead.Status,
      notes: lead.Notes || ''
    }))
    
    // Merge both
    const allUpcomingEvents = [...upcomingFromEvents, ...upcomingFromLeads]
    
    // Remove duplicates
    const uniqueEvents = allUpcomingEvents.filter((event, index, self) => {
      return index === self.findIndex(e => 
        e.clientName === event.clientName && 
        e.eventDate === event.eventDate
      )
    })
    
    uniqueEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))

    setStats({
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.Status === 'New Lead').length,
      contacted: leads.filter(l => l.Status === 'Contacted').length,
      converted: leads.filter(l => l.Status === 'Converted' || l.Status === 'Event Completed').length,
      eventCompleted: leads.filter(l => l.Status === 'Event Completed').length,
      totalRevenue: totalRevenue,
      pendingPayments: pendingPayments,
      receivedPayments: payments.filter(p => p.status === 'Received').length,
      conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.Status === 'Converted' || l.Status === 'Event Completed').length / leads.length) * 100) : 0,
      totalEvents: events.length,
      upcomingEvents: uniqueEvents.length,
      totalPhotographers: photographers.length,
      activePhotographers: photographers.filter(p => p.status === 'Active').length
    })

    const recent = leads
      .sort((a, b) => new Date(b['Created At']) - new Date(a['Created At']))
      .slice(0, 5)
    setRecentLeads(recent)

    setUpcomingEvents(uniqueEvents.slice(0, 10))

    const recentPay = payments
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
    setRecentPayments(recentPay)

    generateChartData(leads, events, payments)
  }
  const generateChartData = (leads, events, payments) => {
    const months = []
    const today = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en-IN', { month: 'short' })
      
      const monthPayments = payments.filter(p => {
        const payDate = new Date(p.date)
        return payDate.getMonth() === date.getMonth() &&
               payDate.getFullYear() === date.getFullYear() &&
               p.status === 'Received'
      })
      
      const revenue = monthPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
      
      months.push({
        month: monthName,
        revenue: revenue,
        events: events.filter(e => {
          const eventDate = new Date(e.eventDate)
          return eventDate.getMonth() === date.getMonth() &&
                 eventDate.getFullYear() === date.getFullYear()
        }).length
      })
    }

    const eventTypes = {}
    leads.forEach(lead => {
      const type = lead['Event Type'] || 'Other'
      eventTypes[type] = (eventTypes[type] || 0) + 1
    })

    const leadsByType = Object.keys(eventTypes).map(type => ({
      name: type,
      value: eventTypes[type]
    }))

    const paymentStatus = [
      { name: 'Received', value: payments.filter(p => p.status === 'Received').length },
      { name: 'Pending', value: payments.filter(p => p.status === 'Pending').length },
      { name: 'Overdue', value: payments.filter(p => p.status === 'Overdue').length }
    ]

    setChartData({
      revenue: months,
      leadsByType: leadsByType,
      paymentStatus: paymentStatus
    })
  }

  // ==================== HELPER FUNCTIONS ====================
  const formatCurrency = (amount) => {
    return '₹' + parseFloat(amount || 0).toLocaleString('en-IN')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      })
    } catch {
      return dateString
    }
  }

  const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']

  // ==================== QUICK ADD HANDLERS ====================
  const handleQuickAction = (action) => {
    setQuickAddModal(false)
    
    switch(action) {
      case 'lead':
        navigate('/crm/leads')
        break
      case 'event':
        navigate('/crm/events')
        break
      case 'payment':
        navigate('/crm/payments')
        break
      case 'photographer':
        navigate('/crm/photographers')
        break
      case 'attendance':
        navigate('/crm/attendance')
        break
      default:
        break
    }
  }

  // ==================== QUICK ADD MODAL ====================
  const QuickAddMenu = () => (
    <AnimatePresence>
      {quickAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setQuickAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Quick Add</h2>
              <button
                onClick={() => setQuickAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleQuickAction('lead')}
                className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white transition-all transform hover:scale-105 shadow-lg"
              >
                <FaUsers className="text-3xl mb-3 mx-auto" />
                <p className="font-semibold">Add Lead</p>
                <p className="text-xs text-blue-100 mt-1">New client inquiry</p>
              </button>

              <button
                onClick={() => handleQuickAction('event')}
                className="p-6 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white transition-all transform hover:scale-105 shadow-lg"
              >
                <FaCalendarCheck className="text-3xl mb-3 mx-auto" />
                <p className="font-semibold">Add Event</p>
                <p className="text-xs text-green-100 mt-1">Schedule shoot</p>
              </button>

              <button
                onClick={() => handleQuickAction('payment')}
                className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl text-white transition-all transform hover:scale-105 shadow-lg"
              >
                <FaMoneyBillWave className="text-3xl mb-3 mx-auto" />
                <p className="font-semibold">Add Payment</p>
                <p className="text-xs text-purple-100 mt-1">Record transaction</p>
              </button>

              <button
                onClick={() => handleQuickAction('photographer')}
                className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl text-white transition-all transform hover:scale-105 shadow-lg"
              >
                <FaCamera className="text-3xl mb-3 mx-auto" />
                <p className="font-semibold">Add Photographer</p>
                <p className="text-xs text-orange-100 mt-1">Team member</p>
              </button>

              <button
                onClick={() => handleQuickAction('attendance')}
                className="p-6 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-xl text-white transition-all transform hover:scale-105 shadow-lg col-span-2"
              >
                <FaCheckCircle className="text-3xl mb-3 mx-auto" />
                <p className="font-semibold">Mark Attendance</p>
                <p className="text-xs text-teal-100 mt-1">Daily check-in</p>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Quick access to common actions
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  // ==================== RENDER ====================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <FaDownload />
              Export Report
            </button>
            <button 
              onClick={() => setQuickAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
            >
              <FaPlus />
              Quick Add
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FaMoneyBillWave className="text-2xl" />
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">This Month</span>
          </div>
          <h3 className="text-3xl font-bold mb-2">{formatCurrency(stats.totalRevenue)}</h3>
          <p className="text-blue-100">Total Revenue</p>
          <div className="mt-3 flex items-center text-sm">
            <FaArrowUp className="mr-1" />
            <span>12% from last month</span>
          </div>
        </motion.div>

        {/* Total Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaUsers className="text-2xl text-purple-600" />
            </div>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
              {stats.newLeads} New
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.totalLeads}</h3>
          <p className="text-gray-600">Total Leads</p>
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <FaFire className="text-orange-500 mr-1" />
            <span>{stats.conversionRate}% conversion rate</span>
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaCalendarCheck className="text-2xl text-green-600" />
            </div>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
              This Week
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.upcomingEvents}</h3>
          <p className="text-gray-600">Upcoming Events</p>
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <FaClock className="text-yellow-500 mr-1" />
            <span>{stats.totalEvents} total events</span>
          </div>
        </motion.div>

        {/* Pending Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
              Action Needed
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">{formatCurrency(stats.pendingPayments)}</h3>
          <p className="text-gray-600">Pending Payments</p>
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <FaCheckCircle className="text-green-500 mr-1" />
            <span>{stats.receivedPayments} received</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Revenue Overview</h3>
            <div className="flex gap-2">
              <button className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-lg font-medium">
                6M
              </button>
              <button className="text-sm px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg">
                1Y
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4F46E5" 
                strokeWidth={3}
                dot={{ fill: '#4F46E5', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Events Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Events by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="events" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Lead Distribution by Type</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.leadsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.leadsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Payment Status</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.paymentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#F59E0B" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Recent Leads</h3>
            <FaBell className="text-blue-600" />
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FaUsers className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{lead['Client Name']}</p>
                  <p className="text-sm text-gray-600">{lead['Event Type']}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(lead['Created At'])}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  lead.Status === 'New Lead' ? 'bg-blue-100 text-blue-600' :
                  lead.Status === 'Contacted' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {lead.Status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events - ENHANCED */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Upcoming Events</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                {upcomingEvents.length}
              </span>
              <FaCalendarCheck className="text-green-600" />
            </div>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3 overflow-y-auto flex-1" style={{ maxHeight: '400px' }}>
              {upcomingEvents.map((event, index) => {
                const eventDate = new Date(event.eventDate)
                const today = new Date()
                const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedEvent(event)
                      setEventDetailsModal(true)
                    }}
                    className="flex items-center gap-3 p-3 bg-white border-2 border-gray-100 rounded-xl hover:border-green-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    {/* Date Badge */}
                    <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl min-w-[65px] text-center border border-green-300">
                      <p className="text-2xl font-bold text-green-700">
                        {eventDate.getDate()}
                      </p>
                      <p className="text-xs text-green-600 uppercase font-medium">
                        {eventDate.toLocaleDateString('en-IN', { month: 'short' })}
                      </p>
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                          {event.clientName}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          event.source === 'leads' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {event.source === 'leads' ? 'Lead' : 'Event'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mb-2">
                        📸 {event.eventType}
                      </p>
                      
                      {/* Timing Badge */}
                      <span className={`inline-flex text-xs px-2 py-1 rounded-full font-medium ${
                        daysUntil === 0 ? 'bg-red-100 text-red-700' :
                        daysUntil <= 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {daysUntil === 0 ? '🔥 Today!' : 
                         daysUntil === 1 ? '⏰ Tomorrow' : 
                         `📅 ${daysUntil} days`}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
              <FaCalendarCheck className="text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium mb-1">No upcoming events</p>
              <p className="text-sm text-gray-400 mb-4">Convert leads or schedule events</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate('/crm/leads')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                >
                  View Leads
                </button>
                <span className="text-gray-300">•</span>
                <button 
                  onClick={() => navigate('/crm/events')}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium hover:underline"
                >
                  Add Event
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Recent Payments</h3>
            <FaMoneyBillWave className="text-purple-600" />
          </div>
          <div className="space-y-3">
            {recentPayments.map((payment, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FaFileInvoice className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{payment.clientName}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(payment.amount)}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(payment.date)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  payment.status === 'Received' ? 'bg-green-100 text-green-600' :
                  payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddMenu />

      {/* Event Details Modal */}
      <AnimatePresence>
        {eventDetailsModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setEventDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEvent.clientName}</h2>
                    <p className="text-green-100 text-sm mt-1">{selectedEvent.eventType}</p>
                  </div>
                  <button
                    onClick={() => setEventDetailsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Event Date */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FaCalendarCheck className="text-blue-600 text-xl" />
                  <div>
                    <p className="text-xs text-gray-600">Event Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedEvent.eventDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Venue */}
                {selectedEvent.venue && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <FaMapMarkerAlt className="text-purple-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-600">Venue</p>
                      <p className="font-semibold text-gray-900">{selectedEvent.venue}</p>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {selectedEvent.phone && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <FaPhone className="text-green-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{selectedEvent.phone}</p>
                    </div>
                  </div>
                )}

                {/* Email */}
                {selectedEvent.email && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <FaEnvelope className="text-orange-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900 text-sm">{selectedEvent.email}</p>
                    </div>
                  </div>
                )}

                {/* Photographer */}
                {selectedEvent.photographer && (
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <FaCamera className="text-indigo-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-600">Photographer</p>
                      <p className="font-semibold text-gray-900">{selectedEvent.photographer}</p>
                    </div>
                  </div>
                )}

                {/* Amount */}
                {selectedEvent.amount && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <FaMoneyBillWave className="text-yellow-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-600">Amount</p>
                      <p className="font-semibold text-gray-900">₹{parseFloat(selectedEvent.amount).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                )}

                {/* Status & Source */}
                <div className="flex gap-2">
                  <span className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium ${
                    selectedEvent.status === 'Event Completed' ? 'bg-green-100 text-green-700' :
                    selectedEvent.status === 'Converted' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedEvent.status}
                  </span>
                  <span className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium ${
                    selectedEvent.source === 'leads' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    From {selectedEvent.source === 'leads' ? 'Leads' : 'Events'}
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-4 rounded-b-2xl flex gap-3">
                <button
                  onClick={() => {
                    setEventDetailsModal(false)
                    navigate(selectedEvent.source === 'leads' ? '/crm/leads' : '/crm/events')
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium"
                >
                  View in {selectedEvent.source === 'leads' ? 'Leads' : 'Events'}
                </button>
                <button
                  onClick={() => setEventDetailsModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Dashboard
