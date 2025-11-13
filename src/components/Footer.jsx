import React, { useState, useEffect } from 'react'
import { FaHeart, FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLock, FaUser, FaUserFriends, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AdminLogin from '../crm/Components/AdminLogin'

const Footer = () => {
  const navigate = useNavigate()
  
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  
  // ✅ ADDED: Guest portal states
  const [showGuestEventSelector, setShowGuestEventSelector] = useState(false)
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [loadingEvents, setLoadingEvents] = useState(false)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyCFoBNyXT8fmTmlG9RwMO7QVgcuaVpgEUynu-hbG4Hl-zVJf09ArlCbSXNhBX9jDUcpg/exec'

  // Secret click handler - click 5 times on copyright to reveal admin button
  const handleSecretClick = () => {
    setClickCount(prev => prev + 1)
    if (clickCount + 1 >= 5) {
      // Reset after 10 seconds
      setTimeout(() => setClickCount(0), 10000)
    }
  }

  // ✅ UPDATED: Guest Portal Handler with proper event selection
  const handleGuestPortal = () => {
    const guestToken = localStorage.getItem('guestToken')
    const guestData = localStorage.getItem('guestData')
    
    if (guestToken && guestData) {
      // User already registered, go directly to gallery
      try {
        const data = JSON.parse(guestData)
        navigate(`/guest/gallery/${data.eventId}`)
      } catch (error) {
        // Invalid data, clear and show event selector
        localStorage.removeItem('guestToken')
        localStorage.removeItem('guestData')
        setShowGuestEventSelector(true)
        fetchEvents()
      }
    } else {
      // New guest, show event selector
      setShowGuestEventSelector(true)
      fetchEvents()
    }
  }

  // ✅ ADDED: Fetch events from both Leads and Events sheets
  const fetchEvents = async () => {
    setLoadingEvents(true)
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getPublicEvents' }) // Only active/public events
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Merge and sort by date
        const allEvents = [...result.leads, ...result.events]
          .filter(event => event.status !== 'Completed') // Only show upcoming/active events
          .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate))
        
        setEvents(allEvents)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      alert('Failed to load events. Please try again.')
    } finally {
      setLoadingEvents(false)
    }
  }

  // ✅ ADDED: Navigate to guest registration with selected event
  const handleEventSelection = () => {
    if (!selectedEvent) {
      alert('Please select an event')
      return
    }
    
    setShowGuestEventSelector(false)
    navigate(`/guest/register/${selectedEvent}`)
  }

  return (
    <>
      {/* Admin Login Modal */}
      <AdminLogin isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} />

      {/* ✅ ADDED: Guest Event Selector Modal */}
      <AnimatePresence>
        {showGuestEventSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGuestEventSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FaUserFriends className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Guest Portal</h3>
                    <p className="text-sm text-gray-600">Select your event</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuestEventSelector(false)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>

              {/* Event Selection */}
              <div className="mb-6">
                {loadingEvents ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm">Loading events...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-2">No upcoming events found</p>
                    <p className="text-sm text-gray-500">Please contact us for access</p>
                  </div>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose Event:
                    </label>
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                    >
                      <option value="">-- Select Event --</option>
                      {events.map(event => (
                        <option key={event.id} value={event.id}>
                          {event.eventType} - {event.clientName} 
                          ({new Date(event.eventDate).toLocaleDateString()})
                        </option>
                      ))}
                    </select>

                    <p className="text-xs text-gray-500 mt-2">
                      💡 Select the event you attended to find your photos
                    </p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              {events.length > 0 && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowGuestEventSelector(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEventSelection}
                    disabled={!selectedEvent}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                RN PhotoFilms
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Capturing your precious moments with artistic excellence and technical perfection.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <FaFacebookF />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <FaInstagram />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <FaTwitter />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Wedding Photography</li>
                <li>Pre-Wedding Shoots</li>
                <li>Event Coverage</li>
                <li>Maternity Photography</li>
                <li>Corporate Events</li>
              </ul>
            </div>

            {/* Portals */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Portals</h4>
              <div className="space-y-3">
                {/* Client Portal */}
                <button
                  onClick={() => navigate('/client/login')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <FaUser />
                  <span>Client Login</span>
                </button>

                {/* ✅ UPDATED: Guest Portal Button */}
                <button
                  onClick={handleGuestPortal}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <FaUserFriends />
                  <span>Guest Portal</span>
                </button>

                {/* Admin Portal (Hidden until secret click) */}
                {clickCount >= 5 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setShowAdminLogin(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    <FaLock />
                    <span>Admin Login</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p 
                className="text-gray-400 text-sm cursor-pointer"
                onClick={handleSecretClick}
              >
                © 2025 RN PhotoFilms. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
                Made with <FaHeart className="text-red-500 mx-1" /> in India
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
