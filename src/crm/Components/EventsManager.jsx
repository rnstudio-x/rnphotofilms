import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaCalendarAlt, FaChevronLeft, FaChevronRight, FaFilter, FaClock, 
  FaMapMarkerAlt, FaUser, FaCamera, FaTimes, FaPhone, FaEnvelope, 
  FaCheckCircle, FaExclamationCircle, FaPlus, FaEdit, FaTrash, 
  FaEye, FaList, FaCalendar, FaSave, FaUserTie, FaMoneyBillWave,
  FaInfoCircle
} from 'react-icons/fa'

const EventsManager = () => {
  // ==================== STATE MANAGEMENT ====================
  const [currentDate, setCurrentDate] = useState(new Date())
  const [manualEvents, setManualEvents] = useState([])
  const [convertedLeads, setConvertedLeads] = useState([])
  const [allEvents, setAllEvents] = useState([]) // Combined events + leads
  const [photographers, setPhotographers] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('calendar')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [filterType, setFilterType] = useState('All')
  const [hoveredDay, setHoveredDay] = useState(null)
  
  // Modal States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDayEventsModalOpen, setIsDayEventsModalOpen] = useState(false)
  const [dayEventsData, setDayEventsData] = useState({ day: null, events: [] })
  
  // Form State
  const [eventForm, setEventForm] = useState({
    clientName: '',
    phone: '',
    email: '',
    eventType: 'Wedding',
    eventDate: '',
    eventTime: '',
    venue: '',
    venueAddress: '',
    photographerId: '',
    budget: '',
    notes: '',
    status: 'Scheduled'
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzYVCIDlUljIZq96CG_YuxWjPL7cS-yHWZxXibNwF8O0lzAIfKgj8QNrFs6cfGoCpuFqg/exec'

  // ==================== DATA FETCHING ====================
  useEffect(() => {
    fetchAllData()
  }, [])

  useEffect(() => {
    // Combine manual events and converted leads
    const combined = [
      ...manualEvents.map(e => ({ ...e, source: 'manual' })),
      ...convertedLeads.map(lead => ({
        id: lead.id,
        eventId: lead['Lead ID'],
        clientName: lead['Client Name'],
        phone: lead.Phone,
        email: lead.Email,
        eventType: lead['Event Type'],
        eventDate: lead['Event Date'],
        eventTime: lead['Event Time'] || '',
        venue: lead.Venue || '',
        venueAddress: lead['Venue Address'] || '',
        photographer: lead['Assigned Photographer'] || '',
        budget: lead.Budget || '',
        status: lead.Status === 'Event Completed' ? 'Completed' : 'Scheduled',
        notes: lead.Notes || lead['Custom Requirements'] || '',
        source: 'lead'
      }))
    ]
    setAllEvents(combined)
  }, [manualEvents, convertedLeads])

  useEffect(() => {
    applyFilters()
  }, [allEvents, filterType])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      // Fetch Manual Events
      const eventsResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getEvents' })
      })
      const eventsResult = await eventsResponse.json()
      
      // Fetch Leads (for converted leads as events)
      const leadsResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getLeads' })
      })
      const leadsResult = await leadsResponse.json()
      
      // Fetch Photographers
      const photoResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getPhotographers' })
      })
      const photoResult = await photoResponse.json()

      if (eventsResult.success) {
        setManualEvents(eventsResult.events || [])
      }
      
      if (leadsResult.success) {
        const converted = leadsResult.leads.filter(
          lead => (lead.Status === 'Converted' || lead.Status === 'Event Completed') && lead['Event Date']
        )
        setConvertedLeads(converted)
      }
      
      if (photoResult.success) {
        setPhotographers(photoResult.photographers || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to load data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    if (filterType === 'All') {
      setFilteredEvents(allEvents)
    } else {
      setFilteredEvents(allEvents.filter(e => e.eventType === filterType))
    }
  }

  // ==================== EVENT CRUD OPERATIONS ====================
  const handleAddEvent = async () => {
    if (!eventForm.clientName || !eventForm.eventDate) {
      alert('⚠️ Please fill all required fields!')
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'addEvent',
          eventId: 'EVT-' + new Date().getTime(),
          clientName: eventForm.clientName,
          phone: eventForm.phone,
          email: eventForm.email,
          eventType: eventForm.eventType,
          eventDate: eventForm.eventDate,
          eventTime: eventForm.eventTime,
          venue: eventForm.venue,
          venueAddress: eventForm.venueAddress,
          photographer: eventForm.photographerId,
          budget: eventForm.budget,
          status: eventForm.status,
          notes: eventForm.notes
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Event added successfully!')
        setIsAddModalOpen(false)
        resetEventForm()
        fetchAllData()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error adding event:', error)
      alert('Failed to add event')
    }
  }

  const handleUpdateEvent = async () => {
    if (selectedEvent.source === 'lead') {
      alert('⚠️ Cannot edit lead-based events. Please update from Leads Manager.')
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateEvent',
          id: selectedEvent.id,
          ...eventForm
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Event updated successfully!')
        setIsEditModalOpen(false)
        fetchAllData()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Failed to update event')
    }
  }

  const handleDeleteEvent = async (event) => {
    if (event.source === 'lead') {
      alert('⚠️ Cannot delete lead-based events. Please update from Leads Manager.')
      return
    }

    if (!confirm(`Are you sure you want to delete event for ${event.clientName}?`)) {
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'deleteEvent',
          id: event.id
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Event deleted successfully')
        fetchAllData()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event')
    }
  }

  const markEventComplete = async (event) => {
    if (event.source === 'lead') {
      alert('ℹ️ Please mark event complete from Leads Manager.')
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateEvent',
          id: event.id,
          status: 'Completed'
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Event marked as completed!')
        fetchAllData()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error completing event:', error)
      alert('Failed to complete event')
    }
  }

  const assignPhotographer = async (event, photographerId) => {
    try {
      const action = event.source === 'lead' ? 'updateLead' : 'updateEvent'
      const updateData = {
        action,
        id: event.id
      }

      if (event.source === 'lead') {
        updateData['Assigned Photographer'] = photographerId
      } else {
        updateData.photographer = photographerId
      }

      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Photographer assigned successfully!')
        fetchAllData()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error assigning photographer:', error)
      alert('Failed to assign photographer')
    }
  }

  const resetEventForm = () => {
    setEventForm({
      clientName: '',
      phone: '',
      email: '',
      eventType: 'Wedding',
      eventDate: '',
      eventTime: '',
      venue: '',
      venueAddress: '',
      photographerId: '',
      budget: '',
      notes: '',
      status: 'Scheduled'
    })
  }

  const openEditModal = (event) => {
    if (event.source === 'lead') {
      alert('⚠️ Lead-based events must be edited from Leads Manager')
      return
    }

    setSelectedEvent(event)
    setEventForm({
      clientName: event.clientName || '',
      phone: event.phone || '',
      email: event.email || '',
      eventType: event.eventType || 'Wedding',
      eventDate: event.eventDate || '',
      eventTime: event.eventTime || '',
      venue: event.venue || '',
      venueAddress: event.venueAddress || '',
      photographerId: event.photographer || '',
      budget: event.budget || '',
      notes: event.notes || '',
      status: event.status || 'Scheduled'
    })
    setIsEditModalOpen(true)
  }

  // ==================== CALENDAR HELPERS ====================
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return filteredEvents.filter(event => event.eventDate === dateStr)
  }

  const openDayEventsModal = (day) => {
    const events = getEventsForDay(day)
    if (events.length > 0) {
      setDayEventsData({ day, events })
      setIsDayEventsModalOpen(true)
    }
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
      'Product Shoot': 'bg-teal-500',
      'Other': 'bg-orange-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Converted': 'bg-purple-100 text-purple-800',
      'Event Completed': 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPhotographerName = (photographerId) => {
    const photographer = photographers.find(p => p.id === photographerId)
    return photographer ? photographer.name : 'Unassigned'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const eventTypes = ['All', 'Wedding', 'Pre-Wedding', 'Birthday', 'Anniversary', 'Corporate', 'Product Shoot', 'Other']

  // ==================== STATISTICS ====================
  const stats = {
    total: allEvents.length,
    manual: manualEvents.length,
    fromLeads: convertedLeads.length,
    thisMonth: allEvents.filter(e => {
      try {
        const eventDate = new Date(e.eventDate)
        const now = new Date()
        return eventDate.getMonth() === now.getMonth() && 
               eventDate.getFullYear() === now.getFullYear()
      } catch {
        return false
      }
    }).length,
    completed: allEvents.filter(e => e.status === 'Completed' || e.status === 'Event Completed').length,
    upcoming: allEvents.filter(e => {
      try {
        const eventDate = new Date(e.eventDate)
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        return eventDate >= now && e.status !== 'Completed' && e.status !== 'Cancelled' && e.status !== 'Event Completed'
      } catch {
        return false
      }
    }).length
  }

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  // ==================== RENDER ====================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <FaCalendarAlt className="text-blue-600" />
          Events Manager
        </h1>
        <p className="text-gray-600">Manage manual events and converted leads</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaCalendarAlt className="text-3xl opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.total}</h3>
          <p className="text-blue-100 text-sm">Total Events</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaPlus className="text-3xl opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.manual}</h3>
          <p className="text-indigo-100 text-sm">Manual Events</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaUser className="text-3xl opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.fromLeads}</h3>
          <p className="text-purple-100 text-sm">From Leads</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaClock className="text-3xl opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.thisMonth}</h3>
          <p className="text-teal-100 text-sm">This Month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaCheckCircle className="text-3xl opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.completed}</h3>
          <p className="text-green-100 text-sm">Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaExclamationCircle className="text-3xl opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.upcoming}</h3>
          <p className="text-orange-100 text-sm">Upcoming</p>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaCalendar />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaList />
              List
            </button>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaPlus />
              Add Event
            </button>
          </div>
        </div>

        {viewMode === 'calendar' && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronLeft className="text-xl" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronRight className="text-xl" />
            </button>
          </div>
        )}
      </div>

      {/* ==================== CALENDAR VIEW ==================== */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const daysInMonth = getDaysInMonth(currentDate)
              const firstDay = getFirstDayOfMonth(currentDate)
              const days = []

              for (let i = 0; i < firstDay; i++) {
                days.push(
                  <div key={`empty-${i}`} className="min-h-[120px] bg-gray-50 rounded-lg"></div>
                )
              }

              for (let day = 1; day <= daysInMonth; day++) {
                const dayEvents = getEventsForDay(day)
                const isCurrentDay = isToday(day)
                const isPast = isPastDate(day)

                days.push(
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => dayEvents.length > 0 && openDayEventsModal(day)}
                    className={`min-h-[120px] p-2 rounded-lg border-2 cursor-pointer ${
                      isCurrentDay
                        ? 'border-blue-500 bg-blue-50'
                        : isPast
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    } transition-all relative group`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold ${
                        isCurrentDay ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-1.5 rounded ${getEventTypeColor(event.eventType)} text-white truncate relative group/event`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate flex-1">{event.clientName}</span>
                            {event.source === 'lead' && (
                              <FaUser className="ml-1 text-xs opacity-70" title="From Lead" />
                            )}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 text-center font-medium">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>

                    {/* Hover tooltip */}
                    {hoveredDay === day && dayEvents.length > 0 && (
                      <div className="absolute bottom-full left-0 mb-2 z-10 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="font-semibold mb-1">{dayEvents.length} Event{dayEvents.length !== 1 ? 's' : ''}</div>
                        {dayEvents.slice(0, 3).map((e, i) => (
                          <div key={i} className="text-gray-300">• {e.clientName} - {e.eventType}</div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-gray-400 mt-1">Click to see all</div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )
              }

              return days
            })()}
          </div>
        </div>
      )}

      {/* ==================== LIST VIEW ==================== */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No events found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Event Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Venue</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Photographer</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEvents
                    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
                    .map((event, index) => (
                    <motion.tr
                      key={event.id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {event.source === 'lead' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                            <FaUser /> Lead
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            <FaPlus /> Manual
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{event.clientName}</div>
                        {event.phone && (
                          <div className="text-xs text-gray-500">{event.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-white text-xs ${getEventTypeColor(event.eventType)}`}>
                          {event.eventType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{formatDateShort(event.eventDate)}</div>
                        <div className="text-xs text-gray-500">{event.eventTime || 'Time TBD'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{event.venue || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={event.photographer || ''}
                          onChange={(e) => assignPhotographer(event, e.target.value)}
                          className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Assign...</option>
                          {photographers.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        {event.photographer && (
                          <div className="text-xs text-gray-500 mt-1">{getPhotographerName(event.photographer)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedEvent(event)
                              setIsViewModalOpen(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {event.source === 'manual' && (
                            <>
                              <button
                                onClick={() => openEditModal(event)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit Event"
                              >
                                <FaEdit />
                              </button>
                              {event.status !== 'Completed' && (
                                <button
                                  onClick={() => markEventComplete(event)}
                                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                  title="Mark Complete"
                                >
                                  <FaCheckCircle />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteEvent(event)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Event"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                          {event.source === 'lead' && (
                            <span className="text-xs text-gray-500 italic">Edit in Leads</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== DAY EVENTS MODAL ==================== */}
      <AnimatePresence>
        {isDayEventsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsDayEventsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Events on {dayEventsData.day} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <p className="text-blue-100 mt-1">{dayEventsData.events.length} event{dayEventsData.events.length !== 1 ? 's' : ''} scheduled</p>
                  </div>
                  <button
                    onClick={() => setIsDayEventsModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {dayEventsData.events.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-white text-sm ${getEventTypeColor(event.eventType)}`}>
                            {event.eventType}
                          </span>
                          {event.source === 'lead' && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                              From Lead
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.clientName}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          {event.eventTime && (
                            <div className="flex items-center gap-2">
                              <FaClock className="text-gray-400" />
                              {event.eventTime}
                            </div>
                          )}
                          {event.venue && (
                            <div className="flex items-center gap-2">
                              <FaMapMarkerAlt className="text-gray-400" />
                              {event.venue}
                            </div>
                          )}
                          {event.photographer && (
                            <div className="flex items-center gap-2">
                              <FaCamera className="text-gray-400" />
                              {getPhotographerName(event.photographer)}
                            </div>
                          )}
                          {event.budget && (
                            <div className="flex items-center gap-2">
                              <FaMoneyBillWave className="text-gray-400" />
                              {event.budget}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedEvent(event)
                            setIsDayEventsModalOpen(false)
                            setIsViewModalOpen(true)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {event.source === 'manual' && (
                          <>
                            <button
                              onClick={() => {
                                setIsDayEventsModalOpen(false)
                                openEditModal(event)
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            {event.status !== 'Completed' && (
                              <button
                                onClick={() => {
                                  setIsDayEventsModalOpen(false)
                                  markEventComplete(event)
                                }}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Complete"
                              >
                                <FaCheckCircle />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Event Modal - Same as before, keeping it short here */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Add Event Form - Same as previous code */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaPlus />
                    Add New Event
                  </h2>
                  <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      value={eventForm.clientName}
                      onChange={(e) => setEventForm({...eventForm, clientName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={eventForm.phone}
                      onChange={(e) => setEventForm({...eventForm, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={eventForm.email}
                      onChange={(e) => setEventForm({...eventForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                    <select
                      value={eventForm.eventType}
                      onChange={(e) => setEventForm({...eventForm, eventType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Product Shoot">Product Shoot</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                    <input
                      type="date"
                      value={eventForm.eventDate}
                      onChange={(e) => setEventForm({...eventForm, eventDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
                    <input
                      type="time"
                      value={eventForm.eventTime}
                      onChange={(e) => setEventForm({...eventForm, eventTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                    <input
                      type="text"
                      value={eventForm.venue}
                      onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign Photographer</label>
                    <select
                      value={eventForm.photographerId}
                      onChange={(e) => setEventForm({...eventForm, photographerId: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      {photographers.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <input
                      type="text"
                      value={eventForm.budget}
                      onChange={(e) => setEventForm({...eventForm, budget: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={eventForm.status}
                      onChange={(e) => setEventForm({...eventForm, status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue Address</label>
                  <input
                    type="text"
                    value={eventForm.venueAddress}
                    onChange={(e) => setEventForm({...eventForm, venueAddress: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={eventForm.notes}
                    onChange={(e) => setEventForm({...eventForm, notes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddEvent}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    Add Event
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EventsManager
