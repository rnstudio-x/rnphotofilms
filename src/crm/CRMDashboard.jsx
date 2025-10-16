import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaTachometerAlt, FaUsers, FaCalendarAlt, FaUserTie, 
  FaClipboardCheck, FaMoneyBillWave, FaCalculator, 
  FaChartLine, FaCog, FaBars, FaTimes, FaHome 
} from 'react-icons/fa'

// Import ALL Components
import Dashboard from './Components/Dashboard'
import LeadsManager from './Components/LeadsManager'
import EventsManager from './Components/EventsManager'
import PaymentTracker from './Components/PaymentTracker'
import PhotographersManager from './Components/PhotographersManager'
import AttendanceTracker from './Components/AttendanceTracker'
import ExpensesManager from './Components/ExpensesManager'
import SalaryProcessor from './Components/SalaryProcessor'
import RemindersManager from './Components/RemindersManager'
import ReportsAnalytics from './Components/ReportsAnalytics'
import ContractGenerator from './Components/ContractGenerator'
import InvoiceGenerator from './Components/InvoiceGenerator'
import ProposalGenerator from './Components/ProposalGenerator'
import ScheduleCalendar from './Components/ScheduleCalendar'
import Settings from './Components/Settings'

const CRMDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  // In your App.jsx (or wherever Dashboard is rendered)

const [activeModule, setActiveModule] = useState('dashboard')

// When rendering Dashboard:
{activeModule === 'dashboard' && (
  <Dashboard onNavigate={(module) => setActiveModule(module)} />
)}


  // Check authentication on mount
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
    } else {
      navigate('/')
    }
  }, [navigate])

  // All menu items - ENABLED (removed disabled: true)
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt />, path: '/crm' },
    { id: 'leads', label: 'Leads', icon: <FaUsers />, path: '/crm/leads', badge: 5 },
    { id: 'events', label: 'Events', icon: <FaCalendarAlt />, path: '/crm/events' },
    { id: 'payments', label: 'Payments', icon: <FaMoneyBillWave />, path: '/crm/payments' },
    { id: 'photographers', label: 'Photographers', icon: <FaUserTie />, path: '/crm/photographers' },
    { id: 'attendance', label: 'Attendance', icon: <FaClipboardCheck />, path: '/crm/attendance' },
    { id: 'expenses', label: 'Expenses', icon: <FaMoneyBillWave />, path: '/crm/expenses' },
    { id: 'salary', label: 'Salary', icon: <FaCalculator />, path: '/crm/salary' },
    {id: 'reminders', label: 'Reminders', icon: <FaClipboardCheck />, path: '/crm/reminders' },
    { id: 'reports', label: 'Reports', icon: <FaChartLine />, path: '/crm/reports' },
    {id: 'contracts', label: 'Contracts', icon: <FaClipboardCheck />, path: '/crm/contracts' },
    {id: 'invoices', label: 'Invoices', icon: <FaClipboardCheck />, path: '/crm/invoices' },
    {id: 'proposals', label: 'Proposals', icon: <FaClipboardCheck />, path: '/crm/proposals' },
    {id: 'calendar', label: 'Calendar', icon: <FaCalendarAlt />, path: '/crm/calendar' },
    { id: 'settings', label: 'Settings', icon: <FaCog />, path: '/crm/settings' },
  ]

  // Check if route is active
  const isActive = (path) => {
    if (path === '/crm') {
      return location.pathname === '/crm'
    }
    return location.pathname.startsWith(path)
  }

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => isActive(item.path))
    return currentItem ? currentItem.label : 'Dashboard'
  }

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminLoginTime')
    navigate('/')
  }

  // If not authenticated, show access denied
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold text-charcoal mb-4">🔒 Unauthorized Access</h2>
          <p className="text-gray-600 mb-6">Please login to access the CRM system</p>
          <Link to="/" className="px-6 py-3 bg-gold text-white rounded-xl font-semibold inline-block">
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

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

        {/* User Profile with Logout */}
        <div className="p-4 border-t border-gray-700">
          {sidebarOpen ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center font-bold text-charcoal">
                  AD
                </div>
                <div>
                  <p className="font-semibold text-sm">Admin</p>
                  <p className="text-xs text-gray-400">Full Access</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gold rounded-full mx-auto flex items-center justify-center font-bold text-charcoal">
              AD
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
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-white text-2xl"
              >
                <FaTimes />
              </button>

              <div className="p-6 border-b border-gray-700">
                <h1 className="text-2xl font-playfair font-bold text-gold">RN PhotoFilms</h1>
                <p className="text-xs text-gray-400">Business Manager</p>
              </div>

              <nav className="py-6 space-y-1 px-3">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaHome className="text-xl" />
                  <span className="font-semibold">Back to Website</span>
                </Link>

                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path)
                        ? 'bg-gold text-charcoal'
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

                <button
                  onClick={handleLogout}
                  className="w-full mt-4 bg-red-500/20 text-red-400 px-4 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all"
                >
                  Logout
                </button>
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
              <h2 className="text-2xl font-bold text-charcoal">{getCurrentPageTitle()}</h2>
              <p className="text-sm text-gray-500">Manage your photography business</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-charcoal">Admin User</p>
              <p className="text-xs text-gray-500">Last login: Today</p>
            </div>
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center font-bold text-charcoal">
              AD
            </div>
          </div>
        </header>

        {/* Content Area - ALL ROUTES ADDED */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard onNavigate={(module) => navigate(module)} />} />
            <Route path="/leads" element={<LeadsManager />} />
            <Route path="/events" element={<EventsManager />} />
            <Route path="/payments" element={<PaymentTracker />} />
            <Route path="/photographers" element={<PhotographersManager />} />
            <Route path="/attendance" element={<AttendanceTracker />} />
            <Route path="/expenses" element={<ExpensesManager />} />
            <Route path="/salary" element={<SalaryProcessor />} />
            <Route path="/reminders" element={<RemindersManager />} />
            <Route path="/reports" element={<ReportsAnalytics />} />
            <Route path="/contracts" element={<ContractGenerator />} />
            <Route path="/invoices" element={<InvoiceGenerator />} />
            <Route path="/proposals" element={<ProposalGenerator />} />
            <Route path="/calendar" element={<ScheduleCalendar />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/crm" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default CRMDashboard
