import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaTachometerAlt, FaUsers, FaCalendarAlt, FaUserTie, 
  FaClipboardCheck, FaMoneyBillWave, FaCalculator, 
  FaChartLine, FaCog, FaHome 
} from 'react-icons/fa'

const CRMSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt />, path: '/crm' },
    { id: 'leads', label: 'Leads', icon: <FaUsers />, path: '/crm/leads', badge: 5 },
    { id: 'events', label: 'Events', icon: <FaCalendarAlt />, path: '/crm/events' },
    { id: 'photographers', label: 'Photographers', icon: <FaUserTie />, path: '/crm/photographers' },
    { id: 'attendance', label: 'Attendance', icon: <FaClipboardCheck />, path: '/crm/attendance' },
    { id: 'expenses', label: 'Expenses', icon: <FaMoneyBillWave />, path: '/crm/expenses' },
    { id: 'salary', label: 'Salary', icon: <FaCalculator />, path: '/crm/salary' },
    { id: 'reports', label: 'Reports', icon: <FaChartLine />, path: '/crm/reports' },
    { id: 'settings', label: 'Settings', icon: <FaCog />, path: '/crm/settings' },
  ]

  const isActive = (path) => {
    if (path === '/crm') {
      return location.pathname === '/crm'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 280 : 80 }}
      className="hidden md:flex flex-col bg-gradient-to-br from-charcoal via-gray-800 to-gray-900 text-white shadow-2xl relative z-20"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-3">
          {sidebarOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <h1 className="text-2xl font-playfair font-bold text-gold">RN PhotoFilms</h1>
              <p className="text-xs text-gray-400">Business Manager</p>
            </motion.div>
          ) : (
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center font-bold text-charcoal">
              RN
            </div>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-20 bg-gold text-charcoal w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {sidebarOpen ? '←' : '→'}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300"
        >
          <FaHome className="text-xl" />
          {sidebarOpen && <span className="font-semibold">Back to Website</span>}
        </Link>

        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
              isActive(item.path)
                ? 'bg-gold text-charcoal shadow-lg'
                : 'hover:bg-gray-800 text-gray-300 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold"
              >
                {item.label}
              </motion.span>
            )}
            {item.badge && sidebarOpen && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        {sidebarOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center font-bold text-charcoal">
              AD
            </div>
            <div>
              <p className="font-semibold text-sm">Admin</p>
              <p className="text-xs text-gray-400">Full Access</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gold rounded-full mx-auto flex items-center justify-center font-bold text-charcoal">
            AD
          </div>
        )}
      </div>
    </motion.aside>
  )
}

export default CRMSidebar
