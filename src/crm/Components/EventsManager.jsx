import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCalendarAlt, FaChevronLeft, FaChevronRight, FaFilter,
  FaClock, FaMapMarkerAlt, FaUser, FaCamera, FaTimes,
  FaPhone, FaEnvelope, FaCheckCircle, FaExclamationCircle,
  FaPlus, FaEdit, FaTrash, FaEye
} from 'react-icons/fa'

const EventsManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('month') // month, list
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState('All')

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzX0rollFXcrI5d8qKhWlLslCX71JDSnlwAVtLLsqmDze2Jhi9_FbpMg-wIvELxe83fZQ/exec' // Replace with your actual URL

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [events, filterType])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getLeads' })
      })

      const result = await response.json()
      
      if (result.success && result.leads) {
        // Filter only converted/completed events with dates
        const eventLeads = result.leads.filter(lead => 
          (lead.Status === 'Converted' || lead.Status === 'Event Completed') &&
          lead['Event Date']
        )
        setEvents(eventLeads)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    if (filterType === 'All') {
      setFilteredEvents(events)
    } else {
      setFilteredEvents(events.filter(e => e['Event Type'] === filterType))
    }
  }

  // Calendar calculations
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return filteredEvents.filter(event => event['Event Date'] === dateStr)
  }

  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1))
  }

  const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear()
  }

  const isPastDate = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const getEventTypeColor = (type) => {
    const colors = {
      'Wedding': 'bg-pink-500',
      'Pre-Wedding': 'bg-purple-500',
      'Birthday': 'bg-blue-500',
      'Anniversary': 'bg-red-500',
      'Corporate': 'bg-gray-700',
      'Other': 'bg-teal-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const eventTypes = ['All', 'Wedding', 'Pre-Wedding', 'Birthday', 'Anniversary', 'Corporate', 'Other']

  // Render Calendar View
  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>)
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day)
      const isCurrentDay = isToday(day)
      const isPast = isPastDate(day)

      days.push(
        <motion.div
          key={day}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`h-24 border border-gray-200 p-2 overflow-hidden ${
            isPast ? 'bg-gray-50' : 'bg-white'
          } ${isCurrentDay ? 'ring-2 ring-blue-500' : ''} hover:shadow-lg transition-shadow cursor-pointer`}
          onClick={() => {
            if (dayEvents.length > 0) {
              setSelectedEvent(dayEvents[0])
              setIsModalOpen(true)
            }
          }}
        >
          <div className={`text-sm font-semibold mb-1 ${
            isCurrentDay ? 'text-blue-600' : isPast ? 'text-gray-400' : 'text-gray-700'
          }`}>
            {day}
          </div>
          
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className={`${getEventTypeColor(event['Event Type'])} text-white text-xs p-1 rounded truncate`}
              >
                {event['Client Name']}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-600 font-semibold">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </motion.div>
      )
    }

    return days
  }

  // Render List View
  const renderListView = () => {
    const sortedEvents = [...filteredEvents].sort((a, b) => 
      new Date(a['Event Date']) - new Date(b['Event Date'])
    )

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const upcoming = sortedEvents.filter(e => new Date(e['Event Date']) >= today)
    const past = sortedEvents.filter(e => new Date(e['Event Date']) < today)

    return (
      <div className="space-y-8">
        
        {/* Upcoming Events */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" />
            Upcoming Events ({upcoming.length})
          </h3>
          
          {upcoming.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming events</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((event, idx) => (
                <EventCard key={idx} event={event} onView={() => {
                  setSelectedEvent(event)
                  setIsModalOpen(true)
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        {past.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-gray-600" />
              Past Events ({past.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.slice(0, 6).map((event, idx) => (
                <EventCard key={idx} event={event} isPast onView={() => {
                  setSelectedEvent(event)
                  setIsModalOpen(true)
                }} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Events Calendar</h1>
          <p className="text-gray-600">Manage and track all your photography events</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <p className="text-gray-500 text-sm mb-1">Total Events</p>
            <h3 className="text-3xl font-bold text-gray-800">{events.length}</h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <p className="text-gray-500 text-sm mb-1">This Month</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {events.filter(e => {
                const eventDate = new Date(e['Event Date'])
                return eventDate.getMonth() === currentDate.getMonth() &&
                       eventDate.getFullYear() === currentDate.getFullYear()
              }).length}
            </h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <p className="text-gray-500 text-sm mb-1">Completed</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {events.filter(e => e.Status === 'Event Completed').length}
            </h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
          >
            <p className="text-gray-500 text-sm mb-1">Upcoming</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {events.filter(e => new Date(e['Event Date']) > new Date()).length}
            </h3>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Month Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-800 min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronRight className="text-gray-600" />
              </button>

              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Today
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                List
              </button>
            </div>

            {/* Event Type Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchEvents}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Calendar/List View */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {viewMode === 'month' ? (
            <>
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-4 text-center font-semibold text-gray-700">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {renderCalendarView()}
              </div>
            </>
          ) : (
            <div className="p-6">
              {renderListView()}
            </div>
          )}
        </div>

      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedEvent(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Event Card Component
const EventCard = ({ event, isPast, onView }) => {
  const getEventTypeColor = (type) => {
    const colors = {
      'Wedding': 'from-pink-500 to-pink-600',
      'Pre-Wedding': 'from-purple-500 to-purple-600',
      'Birthday': 'from-blue-500 to-blue-600',
      'Anniversary': 'from-red-500 to-red-600',
      'Corporate': 'from-gray-700 to-gray-800',
      'Other': 'from-teal-500 to-teal-600'
    }
    return colors[type] || 'from-gray-500 to-gray-600'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-xl shadow-lg overflow-hidden ${isPast ? 'opacity-75' : ''}`}
    >
      <div className={`bg-gradient-to-r ${getEventTypeColor(event['Event Type'])} p-4 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">{event['Event Type']}</span>
          {isPast && <FaCheckCircle />}
        </div>
        <h3 className="text-lg font-bold">{event['Client Name']}</h3>
      </div>

      <div className="p-4 bg-white space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaCalendarAlt className="text-blue-500" />
          <span>{new Date(event['Event Date']).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}</span>
        </div>

        {event['Event Time'] && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaClock className="text-green-500" />
            <span>{event['Event Time']}</span>
          </div>
        )}

        {event.Venue && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt className="text-red-500" />
            <span className="truncate">{event.Venue}</span>
          </div>
        )}

        <button
          onClick={onView}
          className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaEye /> View Details
        </button>
      </div>
    </motion.div>
  )
}

// Event Modal Component
const EventModal = ({ event, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{event['Client Name']}</h3>
              <p className="text-blue-100">{event['Event Type']}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Event Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaCalendarAlt /> Event Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Event Date</p>
                <p className="font-medium text-gray-800">
                  {new Date(event['Event Date']).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              {event['Event Time'] && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Event Time</p>
                  <p className="font-medium text-gray-800">{event['Event Time']}</p>
                </div>
              )}
              {event.Venue && (
                <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Venue</p>
                  <p className="font-medium text-gray-800">{event.Venue}</p>
                  {event['Venue Address'] && (
                    <p className="text-sm text-gray-600 mt-1">{event['Venue Address']}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaUser /> Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium text-gray-800">{event.Phone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800 truncate">{event.Email}</p>
              </div>
            </div>
          </div>

          {/* Package & Status */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaCamera /> Package Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Package</p>
                <p className="font-medium text-gray-800">{event['Package Category'] || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  event.Status === 'Event Completed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {event.Status}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3">
          <a
            href={`tel:${event.Phone}`}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold flex items-center justify-center gap-2"
          >
            <FaPhone /> Call Client
          </a>
          <a
            href={`mailto:${event.Email}`}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold flex items-center justify-center gap-2"
          >
            <FaEnvelope /> Send Email
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default EventsManager
