import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaCalendarAlt, FaMapMarkerAlt, FaClock, FaCamera,
  FaArrowLeft, FaCheckCircle, FaHourglassHalf, FaTimesCircle,
  FaUser, FaPhone, FaEnvelope, FaVideo, FaImage
} from 'react-icons/fa'
import moment from 'moment'

const ClientEvents = () => {
  const navigate = useNavigate()
  const [clientData, setClientData] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, completed

  const GAS_URL = 'https://script.google.com/macros/s/AKfycby6Ph2hqgkYfoeMu_rIrvPvf0dU-NoG8N8vXACD8O9pWqGvdxFbXZ176XZRhukvaBDUFg/exec'

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('clientToken')
    const data = localStorage.getItem('clientData')
    
    if (!token || !data) {
      navigate('/client/login')
      return
    }
    
    try {
      const parsed = JSON.parse(data)
      setClientData(parsed)
      fetchEvents(parsed.id, token)
    } catch (error) {
      console.error('Auth error:', error)
      navigate('/client/login')
    }
  }

  const fetchEvents = async (clientId, token) => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'getClientData',
          clientId: clientId,
          token: token
        })
      })

      const responseText = await response.text()
      const result = JSON.parse(responseText)

      if (result.success) {
        setEvents(result.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'event completed':
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'upcoming':
      case 'confirmed':
        return 'bg-blue-100 text-blue-700'
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'event completed':
      case 'completed':
        return <FaCheckCircle className="text-green-600" />
      case 'upcoming':
      case 'confirmed':
        return <FaHourglassHalf className="text-blue-600" />
      default:
        return <FaClock className="text-gray-600" />
    }
  }

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true
    if (filter === 'upcoming') {
      return event.status?.toLowerCase() === 'upcoming' || 
             event.status?.toLowerCase() === 'confirmed'
    }
    if (filter === 'completed') {
      return event.status?.toLowerCase() === 'completed' ||
             event.status?.toLowerCase() === 'event completed'
    }
    return true
  })

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-auto">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/client/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaArrowLeft className="text-xl text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
                <p className="text-sm text-gray-600">
                  {clientData?.name}'s event history
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Upcoming ({events.filter(e => e.status?.toLowerCase() === 'upcoming' || e.status?.toLowerCase() === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              filter === 'completed'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Completed ({events.filter(e => e.status?.toLowerCase() === 'completed' || e.status?.toLowerCase() === 'event completed').length})
          </button>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Events Found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You don't have any events yet."
                : `No ${filter} events found.`}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
              >
                {/* Event Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(event.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                        {event.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.eventType || 'Event'}</h3>
                  <p className="text-sm opacity-90">ID: {event.id}</p>
                </div>

                {/* Event Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <FaCalendarAlt className="text-blue-600 text-lg mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Event Date</p>
                      <p className="font-semibold text-gray-900">
                        {event.eventDate 
                          ? moment(event.eventDate).format('MMMM DD, YYYY')
                          : 'To be decided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-red-600 text-lg mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Venue</p>
                      <p className="font-semibold text-gray-900">
                        {event.venue || 'To be decided'}
                      </p>
                    </div>
                  </div>

                  {event.photographer && (
                    <div className="flex items-start gap-3">
                      <FaCamera className="text-purple-600 text-lg mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Photographer</p>
                        <p className="font-semibold text-gray-900">{event.photographer}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Event Actions */}
                <div className="px-6 pb-6 flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 font-semibold">
                    <FaImage />
                    Gallery
                  </button>
                  <button className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 font-semibold">
                    <FaVideo />
                    Videos
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientEvents
