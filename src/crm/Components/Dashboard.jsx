import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaUsers, FaCalendarAlt, FaMoneyBillWave, FaChartLine,
  FaArrowUp, FaArrowDown, FaUserTie, FaClipboardCheck 
} from 'react-icons/fa'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 45,
    leadsGrowth: 12,
    activeEvents: 8,
    eventsGrowth: -3,
    monthlyRevenue: 125000,
    revenueGrowth: 18,
    photographers: 5,
    photographersGrowth: 0,
    pendingPayments: 15000,
    totalExpenses: 32000,
    profitMargin: 74.4,
    attendance: 92
  })

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'lead', message: 'New wedding inquiry from Priya & Rahul', time: '2 hours ago', icon: FaUsers, color: 'text-blue-500' },
    { id: 2, type: 'event', message: 'Pre-wedding shoot completed successfully', time: '5 hours ago', icon: FaCalendarAlt, color: 'text-green-500' },
    { id: 3, type: 'payment', message: 'Payment received: ₹35,000', time: '1 day ago', icon: FaMoneyBillWave, color: 'text-gold' },
    { id: 4, type: 'photographer', message: 'New photographer added: Vikram Singh', time: '2 days ago', icon: FaUserTie, color: 'text-purple-500' }
  ])

  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, name: 'Anjali & Rohit Wedding', date: '2025-10-15', type: 'Wedding', status: 'confirmed' },
    { id: 2, name: 'Corporate Event - TechCorp', date: '2025-10-18', type: 'Corporate', status: 'pending' },
    { id: 3, name: 'Sneha Maternity Shoot', date: '2025-10-22', type: 'Maternity', status: 'confirmed' }
  ])

  const StatCard = ({ icon: Icon, label, value, growth, color }) => (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}>
          <Icon className={`text-2xl ${color}`} />
        </div>
        {growth !== 0 && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {growth > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-charcoal">{value}</h3>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold via-amber-500 to-orange-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-white/90">Here's what's happening with your business today</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FaUsers}
          label="Total Leads"
          value={stats.totalLeads}
          growth={stats.leadsGrowth}
          color="text-blue-500"
        />
        <StatCard
          icon={FaCalendarAlt}
          label="Active Events"
          value={stats.activeEvents}
          growth={stats.eventsGrowth}
          color="text-green-500"
        />
        <StatCard
          icon={FaMoneyBillWave}
          label="Monthly Revenue"
          value={`₹${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
          growth={stats.revenueGrowth}
          color="text-gold"
        />
        <StatCard
          icon={FaUserTie}
          label="Photographers"
          value={stats.photographers}
          growth={stats.photographersGrowth}
          color="text-purple-500"
        />
      </div>

      {/* Charts & Activity Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-charcoal">Revenue Overview</h3>
            <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 6 months</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-around gap-2">
            {[65, 85, 45, 92, 78, 88, 95].map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                className="flex-1 bg-gradient-to-t from-gold to-amber-400 rounded-t-lg min-w-8 cursor-pointer hover:opacity-80 transition-opacity"
                title={`Day ${index + 1}: ₹${(height * 1000).toFixed(0)}`}
              />
            ))}
          </div>
          <div className="flex justify-around mt-4 text-xs text-gray-500">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg space-y-4"
        >
          <h3 className="text-xl font-bold text-charcoal mb-4">Quick Stats</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Pending Payments</span>
              <span className="font-bold text-red-500">₹{(stats.pendingPayments / 1000).toFixed(0)}K</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-600 text-sm">Total Expenses</span>
              <span className="font-bold text-orange-500">₹{(stats.totalExpenses / 1000).toFixed(0)}K</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-600 text-sm">Profit Margin</span>
              <span className="font-bold text-green-500">{stats.profitMargin}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '74%' }} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-600 text-sm">Attendance Rate</span>
              <span className="font-bold text-blue-500">{stats.attendance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities & Upcoming Events */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-charcoal mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                  <activity.icon />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-charcoal">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-charcoal mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gold transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-charcoal">{event.name}</h4>
                  <p className="text-sm text-gray-500">{event.date} • {event.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.status === 'confirmed' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {event.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
