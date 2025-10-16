import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { motion, AnimatePresence } from 'framer-motion'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import {
  FaCalendar, FaList, FaClock, FaFilter, FaPlus,
  FaTimes, FaEdit, FaTrash, FaUser, FaUserTie, FaMapMarkerAlt,
  FaPhone, FaEnvelope, FaCamera, FaMoneyBillWave,
  FaChevronLeft, FaChevronRight, FaCheckCircle,
  FaExclamationTriangle, FaEye, FaCalendarDay,
  FaCalendarWeek, FaThLarge, FaBars
} from 'react-icons/fa'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar)

const ScheduleCalendar = () => {
  // ==================== STATE MANAGEMENT ====================
  const [events, setEvents] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [photographers, setPhotographers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // View States
  const [currentView, setCurrentView] = useState('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Filter States
  const [filterPhotographer, setFilterPhotographer] = useState('all')
  const [filterType, setFilterType] = useState('all')
  
  // Modal States
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedEvent, setDraggedEvent] = useState(null)
  const [selectedPhotographers, setSelectedPhotographers] = useState([])
  const [showAvailabilityView, setShowAvailabilityView] = useState(false)
  const [photographerWorkload, setPhotographerWorkload] = useState({})

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyCFoBNyXT8fmTmlG9RwMO7QVgcuaVpgEUynu-hbG4Hl-zVJf09ArlCbSXNhBX9jDUcpg/exec'

  // ==================== DATA FETCHING ====================
  useEffect(() => {
    fetchCalendarData()
  }, [])

  const fetchCalendarData = async () => {
  try {
    setLoading(true)

    console.log('🔄 Fetching calendar data from:', GAS_URL)

    const [eventsRes, leadsRes, photographersRes] = await Promise.all([
      fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getEvents' })
      }),
      fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getLeads' })
      }),
      fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getPhotographers' })
      })
    ])

    // Check responses
    if (!eventsRes.ok || !leadsRes.ok || !photographersRes.ok) {
      throw new Error('API request failed')
    }

    // Parse JSON
    let events, leads, photographers

    try {
      const eventsText = await eventsRes.text()
      events = JSON.parse(eventsText)
    } catch (e) {
      console.error('❌ Failed to parse Events JSON:', e)
      throw new Error('Invalid Events response')
    }

    try {
      const leadsText = await leadsRes.text()
      leads = JSON.parse(leadsText)
    } catch (e) {
      console.error('❌ Failed to parse Leads JSON:', e)
      throw new Error('Invalid Leads response')
    }

    try {
      const photographersText = await photographersRes.text()
      photographers = JSON.parse(photographersText)
    } catch (e) {
      console.error('❌ Failed to parse Photographers JSON:', e)
      throw new Error('Invalid Photographers response')
    }

    console.log('✅ All data fetched')
    console.log('📸 Photographers:', photographers.photographers)
    console.log('📅 Events:', events.events?.length)
    console.log('👥 Leads:', leads.leads?.length)

    if (events.success && leads.success && photographers.success) {
      // ✅ SET PHOTOGRAPHERS STATE
      const photographersList = photographers.photographers || []
      console.log('💾 Setting photographers state:', photographersList)
      setPhotographers(photographersList)
      
      // Process calendar events
      processCalendarEvents(
        events.events || [],
        leads.leads || [],
        photographersList
      )
    } else {
      console.error('❌ API error:', { events, leads, photographers })
      alert('Failed to load data')
    }
  } catch (error) {
    console.error('❌ Error:', error)
    alert(`Error: ${error.message}`)
  } finally {
    setLoading(false)
  }
}

  const processCalendarEvents = (eventsData, leadsData, photographersData) => {
  console.log('📋 Processing calendar events...')
  
  // ✅ CREATE PHOTOGRAPHER ID-TO-NAME MAP
  const photographerMap = {}
  photographersData.forEach(p => {
    photographerMap[p.id] = p.name
    console.log(`Photographer Map: ${p.id} → ${p.name}`)
  })
  
  console.log('📸 Photographer Map:', photographerMap)
  
  // Process Events from Events sheet
  const processedEvents = eventsData.map(event => {
    const photographerId = event.photographer || event.Photographer
    const photographerName = photographerMap[photographerId] || 'Unassigned'
    
    console.log(`Event: ${event.clientName} | Photographer ID: ${photographerId} | Name: ${photographerName}`)
    
    return {
      id: event.id,
      title: event.clientName,
      start: new Date(event.eventDate),
      end: new Date(event.eventDate),
      resource: {
        ...event,
        source: 'events',
        type: event.eventType,
        photographer: photographerName,  // ✅ Store name, not ID
        photographerId: photographerId,   // ✅ Keep ID for reference
        venue: event.venue,
        status: event.status || 'Scheduled'
      }
    }
  })

  // Process Converted Leads
  const convertedLeads = leadsData
    .filter(lead => ['Converted', 'Event Completed', 'New Lead', 'Proposal Sent', 'Contacted', 'Scheduled'].includes(lead.Status) && lead['Event Date'])
    .map(lead => {
      const photographerId = lead['Assigned Photographer'] || lead.Photographer
      const photographerName = photographerMap[photographerId] || 'Unassigned'
      
      console.log(`Lead: ${lead['Client Name']} | Photographer ID: ${photographerId} | Name: ${photographerName}`)
      
      return {
        id: `lead-${lead.id}`,
        title: lead['Client Name'],
        start: new Date(lead['Event Date']),
        end: new Date(lead['Event Date']),
        resource: {
          id: lead.id,
          clientName: lead['Client Name'],
          eventType: lead['Event Type'],
          eventDate: lead['Event Date'],
          venue: lead.Venue || '',
          phone: lead.Phone,
          email: lead.Email,
          photographer: photographerName,  // ✅ Store name, not ID
          photographerId: photographerId,  // ✅ Keep ID for reference
          source: 'leads',
          status: lead.Status,
          amount: lead.Amount || 0
        }
      }
    })

  const combinedEvents = [...processedEvents, ...convertedLeads]
  
  console.log('✅ Total Events:', combinedEvents.length)
  console.log('📊 Events by Photographer:')
  Object.keys(photographerMap).forEach(id => {
    const count = combinedEvents.filter(e => e.resource.photographerId === id).length
    console.log(`  ${photographerMap[id]}: ${count} events`)
  })
  
  setAllEvents(combinedEvents)
  setEvents(combinedEvents)
}

  // ==================== FILTERING ====================
// ==================== FILTERING ====================
useEffect(() => {
  let filtered = [...allEvents]

  // ✅ FIXED: Only filter if photographers are selected AND it's not initial state
  if (selectedPhotographers.length > 0 && photographers.length > 0) {
    filtered = filtered.filter(e => 
      selectedPhotographers.includes(e.resource.photographer) ||
      !e.resource.photographer // Show unassigned events
    )
  }

  // Apply other filters
  if (filterPhotographer !== 'all') {
    filtered = filtered.filter(e => e.resource.photographer === filterPhotographer)
  }

  if (filterType !== 'all') {
    filtered = filtered.filter(e => e.resource.type === filterType || e.resource.eventType === filterType)
  }

  setEvents(filtered)
}, [filterPhotographer, filterType, selectedPhotographers, allEvents, photographers])

  // ==================== EVENT HANDLERS ====================
  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource)
    setIsEventModalOpen(true)
  }

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo)
    setIsAddModalOpen(true)
  }

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate)
  }

  const handleViewChange = (newView) => {
    setCurrentView(newView)
  }

  // ==================== EVENT STYLING ====================
  const eventStyleGetter = (event) => {
    const photographer = event.resource.photographer
    
    // Color coding by photographer
    const photographerColors = {
      'Photographer 1': { backgroundColor: '#4F46E5', color: 'white' },
      'Photographer 2': { backgroundColor: '#10B981', color: 'white' },
      'Photographer 3': { backgroundColor: '#F59E0B', color: 'white' },
      'Photographer 4': { backgroundColor: '#EF4444', color: 'white' }
    }

    // Default color for unassigned
    let style = {
      backgroundColor: '#6B7280',
      color: 'white',
      borderRadius: '6px',
      padding: '2px 6px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'grab'
    }

    // Apply photographer color
    if (photographer && photographerColors[photographer]) {
      style = { ...style, ...photographerColors[photographer] }
    }

    // Special styling for leads
    if (event.resource.source === 'leads') {
      style.borderLeft = '4px solid #3B82F6'
      style.borderTop = 'none'
      style.borderRight = 'none'
      style.borderBottom = 'none'
    } else {style.border = 'none'}
    if (isDragging && draggedEvent && draggedEvent.id === event.id) {
    style.opacity = 0.5
    style.cursor = 'grabbing'
  }

    return { style }
  }

  // ==================== CONFLICT DETECTION ====================
  const checkConflicts = (newEvent) => {
    const conflicts = events.filter(event => {
      const isSameDate = moment(event.start).isSame(newEvent.start, 'day')
      const isSamePhotographer = event.resource.photographer === newEvent.photographer
      return isSameDate && isSamePhotographer && event.id !== newEvent.id
    })
    return conflicts
  }

  // ==================== DRAG & DROP HANDLERS ====================
const handleEventDrop = async ({ event, start, end }) => {
  try {
    console.log('🎯 Event dropped:', event)
    console.log('📅 New date:', start)
    
    setIsDragging(true)
    setDraggedEvent(event)

    // Check conflicts at new date
    const conflicts = checkConflicts({
      start: start,
      photographer: event.resource.photographer,
      id: event.id
    })

    // Show confirmation if conflicts exist
    if (conflicts.length > 0) {
      const confirmMove = window.confirm(
        `⚠️ Warning: ${event.resource.photographer} has ${conflicts.length} other event(s) on ${moment(start).format('MMMM D, YYYY')}.\n\nDo you want to proceed?`
      )
      if (!confirmMove) {
        setIsDragging(false)
        setDraggedEvent(null)
        // ✅ Reload to restore original position
        fetchCalendarData()
        return
      }
    }

    const newDateStr = moment(start).format('YYYY-MM-DD')
    console.log('📝 Formatted date:', newDateStr)

    // ✅ Update in backend FIRST
    await updateEventDate(event.resource, newDateStr)

    // ✅ Then update local state
    const updatedEvent = {
      ...event,
      start: start,
      end: end,
      resource: {
        ...event.resource,
        eventDate: newDateStr
      }
    }

    const updatedEvents = allEvents.map(e => 
      e.id === event.id ? updatedEvent : e
    )
    
    setAllEvents(updatedEvents)
    setEvents(updatedEvents)

    // ✅ Success notification
    console.log('✅ Event rescheduled successfully')
    alert(`✅ Event rescheduled to ${moment(start).format('MMMM D, YYYY')}`)
    
  } catch (error) {
    console.error('❌ Error rescheduling event:', error)
    alert(`❌ Failed to reschedule: ${error.message}`)
    
    // ✅ Reload to restore original state
    fetchCalendarData()
  } finally {
    setIsDragging(false)
    setDraggedEvent(null)
  }
}

const updateEventDate = async (event, newDate) => {
  try {
    console.log('📤 Updating event:', event)
    console.log('📅 New date:', newDate)
    
    const action = event.source === 'leads' ? 'updateLead' : 'updateEvent'
    
    // ✅ FIXED: Proper data structure for GAS
    const updateData = {
      action: action,
      id: event.id,
      data: event.source === 'leads' 
        ? {
            id: event.id,
            'Event Date': newDate,  // ✅ For Leads sheet
            'Updated At': new Date().toISOString()
          }
        : {
            id: event.id,
            eventDate: newDate,     // ✅ For Events sheet
            updatedAt: new Date().toISOString()
          }
    }

    console.log('📨 Sending to GAS:', updateData)

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(updateData)
    })

    const result = await response.json()
    console.log('📬 GAS Response:', result)
    
    if (!result.success) {
      throw new Error(result.message || 'Update failed')
    }

    return result
  } catch (error) {
    console.error('❌ Error updating event date:', error)
    throw error
  }
}


const handleEventResize = ({ event, start, end }) => {
  // For future: handle multi-day events
  console.log('Event resize:', event, start, end)
}


  // ==================== HELPER FUNCTIONS ====================
  const formatDate = (date) => {
    return moment(date).format('dddd, MMMM D, YYYY')
  }

  const formatTime = (date) => {
    return moment(date).format('h:mm A')
  }

  const getEventTypes = () => {
    const types = new Set()
    allEvents.forEach(e => {
      const type = e.resource.type || e.resource.eventType
      if (type) types.add(type)
    })
    return Array.from(types)
  }

  // ==================== PHOTOGRAPHER AVAILABILITY ====================
const calculatePhotographerWorkload = useCallback(() => {
  const workload = {}
  
  console.log('🔍 Calculating workload...')
  console.log('📸 Total Photographers:', photographers.length)
  console.log('📅 Total Events:', allEvents.length)
  
  photographers.forEach(photographer => {
    // ✅ Match by NAME (since we converted ID to name in processCalendarEvents)
    const photographerEvents = allEvents.filter(e => {
      const match = e.resource.photographer === photographer.name
      return match
    })
    
    console.log(`✓ ${photographer.name} (ID: ${photographer.id}): ${photographerEvents.length} events`)
    
    workload[photographer.name] = {
      total: photographerEvents.length,
      thisWeek: photographerEvents.filter(e => {
        const eventDate = moment(e.start)
        const weekStart = moment().startOf('week')
        const weekEnd = moment().endOf('week')
        return eventDate.isBetween(weekStart, weekEnd, null, '[]')
      }).length,
      thisMonth: photographerEvents.filter(e => {
        const eventDate = moment(e.start)
        return eventDate.month() === moment().month()
      }).length,
      events: photographerEvents
    }
  })
  
  console.log('📊 Final Workload:', workload)
  return workload
}, [photographers, allEvents])


useEffect(() => {
  if (photographers.length > 0) {
    const workload = calculatePhotographerWorkload()
    setPhotographerWorkload(workload)
    
    // ✅ Initialize all photographers as selected
    if (selectedPhotographers.length === 0) {
      const allPhotographerNames = photographers.map(p => p.name)
      setSelectedPhotographers(allPhotographerNames)
    }
  }
}, [photographers, allEvents, calculatePhotographerWorkload, selectedPhotographers.length])


const togglePhotographer = (photographerName) => {
  setSelectedPhotographers(prev => {
    if (prev.includes(photographerName)) {
      return prev.filter(name => name !== photographerName)
    } else {
      return [...prev, photographerName]
    }
  })
}

const isPhotographerVisible = (photographerName) => {
  return selectedPhotographers.includes(photographerName)
}


  // ==================== CUSTOM TOOLBAR ====================
  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('PREV')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaChevronLeft />
          </button>
          
          <button
            onClick={() => onNavigate('TODAY')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Today
          </button>
          
          <button
            onClick={() => onNavigate('NEXT')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaChevronRight />
          </button>
          
          <h2 className="text-xl font-bold text-gray-800 ml-4">{label}</h2>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView('month')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              currentView === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaThLarge />
            <span className="hidden sm:inline">Month</span>
          </button>
          
          <button
            onClick={() => onView('week')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              currentView === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaCalendarWeek />
            <span className="hidden sm:inline">Week</span>
          </button>
          
          <button
            onClick={() => onView('day')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              currentView === 'day'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaCalendarDay />
            <span className="hidden sm:inline">Day</span>
          </button>
          
          <button
            onClick={() => onView('agenda')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              currentView === 'agenda'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaBars />
            <span className="hidden sm:inline">Agenda</span>
          </button>
        </div>
      </div>
    </div>
  )
  // ==================== EVENT DETAILS MODAL ====================
  const EventDetailsModal = () => (
    <AnimatePresence>
      {isEventModalOpen && selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsEventModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedEvent.clientName}</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    {selectedEvent.eventType || selectedEvent.type}
                  </p>
                </div>
                <button
                  onClick={() => setIsEventModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <FaCalendar className="text-blue-600 text-xl" />
                  <div>
                    <p className="text-xs text-gray-600">Event Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedEvent.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <FaClock className="text-purple-600 text-xl" />
                  <div>
                    <p className="text-xs text-gray-600">Source</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {selectedEvent.source}
                    </p>
                  </div>
                </div>
              </div>

              {/* Venue */}
              {selectedEvent.venue && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <FaMapMarkerAlt className="text-green-600 text-xl" />
                  <div>
                    <p className="text-xs text-gray-600">Venue</p>
                    <p className="font-semibold text-gray-900">{selectedEvent.venue}</p>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedEvent.phone && (
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                    <FaPhone className="text-orange-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{selectedEvent.phone}</p>
                    </div>
                  </div>
                )}

                {selectedEvent.email && (
                  <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
                    <FaEnvelope className="text-pink-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900 text-sm">{selectedEvent.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Photographer & Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedEvent.photographer && (
                  <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
                    <FaCamera className="text-indigo-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-600">Photographer</p>
                      <p className="font-semibold text-gray-900">{selectedEvent.photographer}</p>
                    </div>
                  </div>
                )}

                {selectedEvent.amount && (
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                    <FaMoneyBillWave className="text-yellow-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-600">Amount</p>
                      <p className="font-semibold text-gray-900">
                        ₹{parseFloat(selectedEvent.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedEvent.status === 'Event Completed' ? 'bg-green-100 text-green-700' :
                  selectedEvent.status === 'Converted' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {selectedEvent.status}
                </span>
              </div>

              {/* Conflict Warning */}
              {(() => {
                const conflicts = checkConflicts({
                  start: new Date(selectedEvent.eventDate),
                  photographer: selectedEvent.photographer,
                  id: selectedEvent.id
                })
                return conflicts.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <FaExclamationTriangle />
                      <p className="font-semibold">Conflict Detected!</p>
                    </div>
                    <p className="text-sm text-red-600 mt-2">
                      {selectedEvent.photographer} has {conflicts.length} other event(s) on this day
                    </p>
                  </div>
                )
              })()}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 rounded-b-2xl">
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    )
  }

  // ==================== MAIN RENDER ====================
  return (
      <DndProvider backend={HTML5Backend}>
         <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <FaCalendar className="text-blue-600" />
              Schedule Calendar
            </h1>
            <p className="text-gray-600">Visual scheduling & team coordination</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <FaEye />
              <span>{events.length} Events</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-600" />
            <span className="font-medium text-gray-700">Filters:</span>
          </div>

          {/* Photographer Filter */}
          <select
            value={filterPhotographer}
            onChange={(e) => setFilterPhotographer(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Photographers</option>
            {photographers.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          {/* Event Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            {getEventTypes().map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(filterPhotographer !== 'all' || filterType !== 'all') && (
            <button
              onClick={() => {
                setFilterPhotographer('all')
                setFilterType('all')
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>    

      {/* Photographer Availability Panel */}
<div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <FaUserTie className="text-blue-600 text-xl" />
      <h3 className="font-semibold text-gray-800">Photographer Availability</h3>
    </div>
    <button
      onClick={() => setShowAvailabilityView(!showAvailabilityView)}
      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
    >
      {showAvailabilityView ? 'Hide Details' : 'Show Details'}
    </button>
  </div>

  {/* Photographer Toggles */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {photographers.map((photographer, index) => {
      const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']
      const workload = photographerWorkload[photographer.name] || { total: 0, thisWeek: 0, thisMonth: 0 }
      const isVisible = isPhotographerVisible(photographer.name)
      
      return (
        <motion.button
          key={photographer.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => togglePhotographer(photographer.name)}
          className={`p-4 rounded-xl border-2 transition-all ${
            isVisible
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-gray-50 opacity-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <p className="font-semibold text-gray-900 text-sm truncate">
              {photographer.name}
            </p>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-medium">{workload.total}</span>
            </div>
            <div className="flex justify-between">
              <span>This Week:</span>
              <span className="font-medium text-blue-600">{workload.thisWeek}</span>
            </div>
            <div className="flex justify-between">
              <span>This Month:</span>
              <span className="font-medium text-green-600">{workload.thisMonth}</span>
            </div>
          </div>
          
          {!isVisible && (
            <div className="mt-2 text-xs text-gray-500">
              Click to show
            </div>
          )}
        </motion.button>
      )
    })}
  </div>

  {/* ✅ Availability Timeline (if showAvailabilityView is true) */}
  <AnimatePresence>
    {showAvailabilityView && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-4 pt-4 border-t border-gray-200"
      >
        <h4 className="font-semibold text-gray-800 mb-3">This Week's Schedule</h4>
        <div className="space-y-2">
          {photographers.map((photographer, index) => {
            const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']
            const weekEvents = allEvents.filter(e => {
              const eventDate = moment(e.start)
              const weekStart = moment().startOf('week')
              const weekEnd = moment().endOf('week')
              return e.resource.photographer === photographer.name &&
                     eventDate.isBetween(weekStart, weekEnd, null, '[]')
            }).sort((a, b) => moment(a.start) - moment(b.start))
            
            return (
              <div key={photographer.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{photographer.name}</p>
                  {weekEvents.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {weekEvents.map((event, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white px-2 py-1 rounded border border-gray-200"
                        >
                          {moment(event.start).format('ddd DD')}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-green-600 mt-1">✓ Available all week</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">{weekEvents.length}</p>
                  <p className="text-xs text-gray-500">events</p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
        {/* ==================== CALENDAR ==================== */}

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 350px)', minHeight: '600px' }}
          view={currentView}
          onView={handleViewChange}
          date={currentDate}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          
          // ✅ DRAG & DROP PROPS
          draggableAccessor={() => true}
          resizable
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar
          }}
          formats={{
            agendaDateFormat: 'ddd MMM DD',
            dayHeaderFormat: 'dddd MMM DD'
          }}
        />
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Color Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-sm text-gray-700">From Leads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span className="text-sm text-gray-700">Unassigned</span>
          </div>
          {photographers.slice(0, 4).map((p, i) => {
            const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']
            return (
              <div key={p.id} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[i] }}></div>
                <span className="text-sm text-gray-700">{p.name}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal />
    </div>
    </DndProvider>  
  )
}


export default ScheduleCalendar
