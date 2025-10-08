import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaTachometerAlt, FaUsers, FaCalendarAlt, FaUserTie, 
  FaClipboardCheck, FaMoneyBillWave, FaCalculator, 
  FaChartLine, FaCog, FaBars, FaTimes, FaHome 
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const CRMLayout = ({ children, activeModule }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { id: 'home', label: 'Back to Website', icon: <FaHome />, path: '/', external: true },
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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
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
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                activeModule === item.id
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
                RN
              </div>
              <div>
                <p className="font-semibold text-sm">Admin</p>
                <p className="text-xs text-gray-400">rn.photo.films</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gold rounded-full mx-auto flex items-center justify-center font-bold text-charcoal">
              RN
            </div>
          )}
        </div>
      </motion.aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-br from-charcoal via-gray-800 to-gray-900 text-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-white text-2xl"
              >
                <FaTimes />
              </button>

              {/* Logo */}
              <div className="p-6 border-b border-gray-700">
                <h1 className="text-2xl font-playfair font-bold text-gold">RN PhotoFilms</h1>
                <p className="text-xs text-gray-400">Business Manager</p>
              </div>

              {/* Navigation */}
              <nav className="py-6 space-y-1 px-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeModule === item.id
                        ? 'bg-gold text-charcoal shadow-lg'
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-semibold">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-2xl text-charcoal"
            >
              <FaBars />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-charcoal">
                {menuItems.find(item => item.id === activeModule)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500">Manage your photography business</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-charcoal">Admin User</p>
              <p className="text-xs text-gray-500">Last login: Today, 9:30 AM</p>
            </div>
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center font-bold text-charcoal">
              RN
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}

export default CRMLayout
