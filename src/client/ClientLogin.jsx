import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPhone, FaEnvelope, FaLock, FaUser, FaSpinner } from 'react-icons/fa'

const ClientLogin = () => {
  const navigate = useNavigate()
  const [loginMethod, setLoginMethod] = useState('phone') // 'phone' or 'email'
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzWJS6fKlFs-K5oU23TgtI6kcu9TVAlsQq4sQac79_IdTh09z-qOAPcx2uZhB-pKzFlRA/exec' // Replace with your actual GAS URL

const handleLogin = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'authenticateClient',
        phone: loginMethod === 'phone' ? phone : '',
        email: loginMethod === 'email' ? email : ''
      })
    })

    const responseText = await response.text()
    console.log('✅ Response received:', responseText)
    
    const result = JSON.parse(responseText)
    console.log('✅ Parsed result:', result)

    if (result && result.success === true) {
      console.log('✅ Login successful!')
      
      // Store data
      localStorage.setItem('clientToken', result.token)
      localStorage.setItem('clientData', JSON.stringify(result.client))
      
      console.log('✅ Data saved to localStorage')
      console.log('Token:', result.token)
      console.log('Client:', result.client)
       console.log('Saved client ID:', result.client.id)
      
      // Navigate to dashboard
      console.log('✅ Navigating to dashboard...')
      navigate('/client/dashboard', { replace: true })
      
    } else {
      console.error('❌ Login failed:', result?.message)
      setError(result?.message || 'Login failed. Please check your details.')
    }
  } catch (error) {
    console.error('❌ Login error:', error)
    setError('Connection error: ' + error.message)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <FaUser className="text-3xl text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Client Portal</h1>
          <p className="text-gray-600">RN PhotoFilms</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back!
          </h2>

          {/* Login Method Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                loginMethod === 'phone'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaPhone className="inline mr-2" />
              Phone
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                loginMethod === 'email'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaEnvelope className="inline mr-2" />
              Email
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginMethod === 'phone' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <FaLock />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Use the phone number or email you provided when booking your event.
            </p>
            <p className="mt-2">
              Need help?{' '}
              <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ClientLogin
