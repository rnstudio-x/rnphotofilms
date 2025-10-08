import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

const AdminLogin = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Set your admin password here (in production, use environment variables)
  const ADMIN_PASSWORD = 'RNPhoto@2025' // Change this to your password

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate checking password
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store admin session
        localStorage.setItem('adminAuth', 'true')
        localStorage.setItem('adminLoginTime', new Date().toISOString())
        
        // Navigate to CRM
        navigate('/crm')
        onClose()
      } else {
        setError('Invalid password! Please try again.')
        setPassword('')
      }
      setLoading(false)
    }, 500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-charcoal to-gray-800 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
            >
              <FaTimes />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center">
                <FaLock className="text-3xl text-charcoal" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Admin Login</h2>
                <p className="text-sm text-gray-300">Enter password to access CRM</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-2"
                >
                  <span>❌</span> {error}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-gold via-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Verifying...
                </>
              ) : (
                <>
                  <FaLock /> Access CRM
                </>
              )}
            </motion.button>

            <p className="text-xs text-center text-gray-500">
              🔒 Authorized access only. All activities are logged.
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AdminLogin
