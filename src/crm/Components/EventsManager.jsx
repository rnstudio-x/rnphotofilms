import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, FaSearch, FaCalendarAlt, FaEdit, FaTrash, FaEye,
  FaTimes, FaMapMarkerAlt, FaMoneyBillWave, FaCheckCircle, FaUserTie 
} from 'react-icons/fa'
import googleSheetsAPI from '../Utils/googleSheets'

const EventsManager = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [photographers, setPhotographers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [formData, setFormData] = useState({
    eventName: '',
    clientName: '',
    clientPhone: '',
    eventDate: '',
    eventType: 'Wedding',
    location: '',
    price: '',
    advance: '',
    photographer: '',
    status: 'Confirmed',
    notes: ''
  })

  useEffect(() => {
    fetchEvents()
    fetchPhotographers()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [searchTerm, filterStatus, events])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await googleSheetsAPI.getEvents()
      if (response.success) {
        setEvents(response.data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
    setLoading(false)
  }

  const fetchPhotographers = async () => {
    try {
      const response = await googleSheetsAPI.getPhotographers()
      if (response.success) {
        setPhotographers(response.data)
      }
    } catch (error) {
      console.error('Error fetching photographers:', error)
    }
  }

  const filterEvents = () => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(event => event.status === filterStatus)
    }

    setFilteredEvents(filtered)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await googleSheetsAPI.addEvent(formData)
      if (response.success) {
        setShowAddModal(false)
        fetchEvents()
        resetForm()
      }
    } catch (error) {
      console.error('Error adding event:', error)
    }
  }

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await googleSheetsAPI.deleteEvent(eventId)
        fetchEvents()
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      eventName: '',
      clientName: '',
      clientPhone: '',
      eventDate: '',
      eventType: 'Wedding',
      location: '',
      price: '',
      advance: '',
      photographer: '',
      status: 'Confirmed',
      notes: ''
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'bg-green-100 text-green-600',
      'Pending': 'bg-yellow-100 text-yellow-600',
      'Completed': 'bg-blue-100 text-blue-600',
      'Cancelled': 'bg-red-100 text-red-600'
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  const calculateBalance = (price, advance) => {
    return parseFloat(price || 0) - parseFloat(advance || 0)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by name or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
          >
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gold text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <FaPlus /> Add Event
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {['All', 'Confirmed', 'Pending', 'Completed'].map((status) => (
          <motion.div
            key={status}
            whileHover={{ y: -5 }}
            className={`bg-white rounded-xl p-4 shadow-lg cursor-pointer ${filterStatus === status ? 'ring-2 ring-gold' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            <p className="text-sm text-gray-600 mb-1">{status}</p>
            <h3 className="text-2xl font-bold text-charcoal">
              {status === 'All' ? events.length : events.filter(e => e.status === status).length}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              Loading events...
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No events found
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <motion.div
              key={event.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-charcoal mb-1">{event.eventName}</h3>
                  <p className="text-sm text-gray-600">{event.clientName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>

              {/* Event Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaCalendarAlt className="text-gold" />
                  <span>{new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaMapMarkerAlt className="text-gold" />
                  <span className="truncate">{event.location || 'Location TBD'}</span>
                </div>

                {event.photographer && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FaUserTie className="text-gold" />
                    <span>{event.photographer}</span>
                  </div>
                )}
              </div>

              {/* Financial Summary */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Total Price</p>
                    <p className="font-bold text-green-600">₹{parseFloat(event.price || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Balance</p>
                    <p className="font-bold text-orange-600">
                      ₹{calculateBalance(event.price, event.advance).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedEvent(event)
                    setShowViewModal(true)
                  }}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FaEye /> View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(event.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FaTrash /> Delete
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-2xl font-bold text-charcoal">Add New Event</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Event Name *</label>
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                      placeholder="Priya & Rahul Wedding"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Client Name *</label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                      placeholder="Priya Sharma"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Client Phone *</label>
                    <input
                      type="tel"
                      name="clientPhone"
                      value={formData.clientPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Event Date *</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Event Type *</label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Maternity">Maternity</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                    placeholder="The Grand Hotel, Mumbai"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Total Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Advance Paid (₹)</label>
                    <input
                      type="number"
                      name="advance"
                      value={formData.advance}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                      placeholder="10000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Assign Photographer</label>
                  <select
                    name="photographer"
                    value={formData.photographer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                  >
                    <option value="">Select Photographer</option>
                    {photographers.map((p, i) => (
                      <option key={i} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold resize-none"
                    placeholder="Additional details..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-charcoal font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-3 bg-gold text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Add Event
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Event Modal */}
      <AnimatePresence>
        {showViewModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl"
            >
              <div className="bg-gradient-to-r from-gold to-amber-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-2xl font-bold">Event Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-charcoal mb-2">{selectedEvent.eventName}</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedEvent.status)}`}>
                    {selectedEvent.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Client Name</p>
                    <p className="text-lg font-semibold text-charcoal">{selectedEvent.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Client Phone</p>
                    <a href={`tel:${selectedEvent.clientPhone}`} className="text-lg text-gold hover:underline">
                      {selectedEvent.clientPhone}
                    </a>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Event Date</p>
                    <p className="text-lg font-semibold text-charcoal">
                      {new Date(selectedEvent.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Event Type</p>
                    <p className="text-lg font-semibold text-charcoal">{selectedEvent.eventType}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-lg text-charcoal flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gold" /> {selectedEvent.location}
                  </p>
                </div>

                {selectedEvent.photographer && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Photographer</p>
                    <p className="text-lg text-charcoal flex items-center gap-2">
                      <FaUserTie className="text-gold" /> {selectedEvent.photographer}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Price</span>
                    <span className="text-xl font-bold text-green-600">₹{parseFloat(selectedEvent.price || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Advance Paid</span>
                    <span className="text-xl font-bold text-blue-600">₹{parseFloat(selectedEvent.advance || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-gray-800 font-semibold">Balance Due</span>
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{calculateBalance(selectedEvent.price, selectedEvent.advance).toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedEvent.notes && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{selectedEvent.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-3 bg-gray-100 text-charcoal rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Close
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
