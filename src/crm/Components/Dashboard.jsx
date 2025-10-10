import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FaUsers, FaMoneyBillWave, FaCalendarCheck, FaClock,
  FaChartLine, FaTrophy, FaFire, FaExclamationTriangle,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaCamera
} from 'react-icons/fa'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contacted: 0,
    converted: 0,
    eventCompleted: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    conversionRate: 0
  })
  
  const [recentLeads, setRecentLeads] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwKBxSj_Qb0_Zoo4OZ7EA9tlZhGBRjXfoCwGpmwUFqKhLxV52AcTUmwzkgfecOc3ZT8dg/exec' // Replace with your actual URL

  useEffect(() => {
    fetchDashboardData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 300000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all leads
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getLeads' })
      })

      const result = await response.json()
      
      if (result.success && result.leads) {
        calculateStats(result.leads)
        
        // Get recent leads (last 5)
        const recent = result.leads
          .sort((a, b) => new Date(b['Created At']) - new Date(a['Created At']))
          .slice(0, 5)
        setRecentLeads(recent)
        
        // Get upcoming events (next 7 days)
        const today = new Date()
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        
        const upcoming = result.leads.filter(lead => {
          if (!lead['Event Date']) return false
          const eventDate = new Date(lead['Event Date'])
          return eventDate >= today && eventDate <= nextWeek
        }).sort((a, b) => new Date(a['Event Date']) - new Date(b['Event Date']))
        
        setUpcomingEvents(upcoming)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (leads) => {
    const newStats = {
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.Status === 'New Lead').length,
      contacted: leads.filter(l => l.Status === 'Contacted').length,
      converted: leads.filter(l => l.Status === 'Converted' || l.Status === 'Event Completed').length,
      eventCompleted: leads.filter(l => l.Status === 'Event Completed').length,
      totalRevenue: 0, // Can be calculated from budget if needed
      pendingPayments: 0,
      conversionRate: leads.length > 0 
        ? Math.round((leads.filter(l => l.Status === 'Converted' || l.Status === 'Event Completed').length / leads.length) * 100)
        : 0
    }
    
    setStats(newStats)
  }

  const getStatusColor = (status) => {
    const colors = {
      'New Lead': 'text-blue-600 bg-blue-50',
      'Contacted': 'text-yellow-600 bg-yellow-50',
      'Proposal Sent': 'text-purple-600 bg-purple-50',
      'Negotiating': 'text-orange-600 bg-orange-50',
      'Converted': 'text-green-600 bg-green-50',
      'Lost': 'text-red-600 bg-red-50',
      'Event Completed': 'text-teal-600 bg-teal-50'
    }
    return colors[status] || 'text-gray-600 bg-gray-50'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getDaysUntilEvent = (eventDate) => {
    if (!eventDate) return null
    const today = new Date()
    const event = new Date(eventDate)
    const diffTime = event - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your business overview</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FaUsers className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm mb-1">Total Leads</p>
                <h3 className="text-4xl font-bold">{stats.totalLeads}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <FaChartLine />
              <span>All time leads</span>
            </div>
          </motion.div>

          {/* New Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FaClock className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-yellow-100 text-sm mb-1">New Leads</p>
                <h3 className="text-4xl font-bold">{stats.newLeads}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-yellow-100 text-sm">
              <FaFire />
              <span>Needs attention</span>
            </div>
          </motion.div>

          {/* Converted */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FaTrophy className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm mb-1">Converted</p>
                <h3 className="text-4xl font-bold">{stats.converted}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-100 text-sm">
              <FaCalendarCheck />
              <span>{stats.eventCompleted} completed</span>
            </div>
          </motion.div>

          {/* Conversion Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FaChartLine className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-purple-100 text-sm mb-1">Conversion Rate</p>
                <h3 className="text-4xl font-bold">{stats.conversionRate}%</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-purple-100 text-sm">
              <FaMoneyBillWave />
              <span>Performance metric</span>
            </div>
          </motion.div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Leads */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Leads</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                {recentLeads.length} New
              </span>
            </div>

            <div className="space-y-4">
              {recentLeads.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent leads</p>
              ) : (
                recentLeads.map((lead, index) => (
                  <motion.div
                    key={lead['Lead ID'] || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {lead['Client Name']?.charAt(0) || '?'}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {lead['Client Name']}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaPhone className="text-xs" />
                        <span className="truncate">{lead.Phone}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.Status)}`}>
                        {lead.Status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {lead['Event Type']}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <button
              onClick={fetchDashboardData}
              className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
            >
              Refresh Data
            </button>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
                Next 7 Days
              </span>
            </div>

            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12">
                  <FaCalendarCheck className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming events in next 7 days</p>
                </div>
              ) : (
                upcomingEvents.map((event, index) => {
                  const daysUntil = getDaysUntilEvent(event['Event Date'])
                  return (
                    <motion.div
                      key={event['Lead ID'] || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="relative p-4 rounded-xl border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-transparent hover:shadow-md transition-shadow"
                    >
                      {daysUntil !== null && daysUntil <= 2 && (
                        <div className="absolute top-2 right-2">
                          <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                            <FaExclamationTriangle />
                            Urgent
                          </span>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex flex-col items-center justify-center text-white">
                          <span className="text-2xl font-bold">
                            {new Date(event['Event Date']).getDate()}
                          </span>
                          <span className="text-xs uppercase">
                            {new Date(event['Event Date']).toLocaleString('en', { month: 'short' })}
                          </span>
                        </div>

                        <div className="flex-grow">
                          <h3 className="font-bold text-gray-800 mb-1">
                            {event['Client Name']}
                          </h3>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaCamera className="text-xs text-green-600" />
                              <span>{event['Event Type']}</span>
                            </div>
                            
                            {event.Venue && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaMapMarkerAlt className="text-xs text-red-500" />
                                <span className="truncate">{event.Venue}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-sm">
                              <FaClock className="text-xs text-orange-500" />
                              <span className="font-semibold text-gray-800">
                                {daysUntil === 0 ? 'Today!' : 
                                 daysUntil === 1 ? 'Tomorrow' : 
                                 `In ${daysUntil} days`}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <a
                              href={`tel:${event.Phone}`}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Call
                            </a>
                            <a
                              href={`mailto:${event.Email}`}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Email
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Contacted</p>
              <p className="text-3xl font-bold">{stats.contacted}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Events This Month</p>
              <p className="text-3xl font-bold">{upcomingEvents.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Response Rate</p>
              <p className="text-3xl font-bold">{stats.totalLeads > 0 ? Math.round((stats.contacted / stats.totalLeads) * 100) : 0}%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Success Rate</p>
              <p className="text-3xl font-bold">{stats.conversionRate}%</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Dashboard
