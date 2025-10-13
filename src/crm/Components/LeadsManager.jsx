import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPhone, 
  FaEnvelope, FaCalendar, FaMapMarkerAlt, FaTimes, FaCheck, 
  FaClock, FaMoneyBillWave, FaUser, FaBell, FaFileInvoice,
  FaPaperPlane, FaChartLine, FaExclamationCircle, FaSave
} from 'react-icons/fa'

const LeadsManager = () => {
  // State Management
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)
  
  // Modal States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false)

  // Edit Form State
  const [editForm, setEditForm] = useState({})

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzYVCIDlUljIZq96CG_YuxWjPL7cS-yHWZxXibNwF8O0lzAIfKgj8QNrFs6cfGoCpuFqg/exec'

  // Status configuration
  const statusConfig = {
    'New Lead': { 
      color: 'bg-blue-100 text-blue-800', 
      icon: FaUser,
      nextActions: ['Contacted', 'Lost']
    },
    'Contacted': { 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: FaPhone,
      nextActions: ['Proposal Sent', 'Negotiating', 'Lost']
    },
    'Proposal Sent': { 
      color: 'bg-purple-100 text-purple-800', 
      icon: FaPaperPlane,
      nextActions: ['Negotiating', 'Converted', 'Lost']
    },
    'Negotiating': { 
      color: 'bg-orange-100 text-orange-800', 
      icon: FaMoneyBillWave,
      nextActions: ['Converted', 'Lost']
    },
    'Converted': { 
      color: 'bg-green-100 text-green-800', 
      icon: FaCheck,
      nextActions: ['Event Completed']
    },
    'Event Completed': { 
      color: 'bg-teal-100 text-teal-800', 
      icon: FaCheck,
      nextActions: []
    },
    'Lost': { 
      color: 'bg-red-100 text-red-800', 
      icon: FaTimes,
      nextActions: ['New Lead', 'Contacted']
    }
  }

  // Fetch leads
  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getLeads' })
      })

      const result = await response.json()

      if (result.success && result.leads) {
        setLeads(result.leads)
      } else {
        console.error('Failed to fetch leads:', result.message)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
      alert('Failed to load leads. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // Update lead status with proper ID handling
  const updateLeadStatus = async (lead, newStatus) => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateLead',
          id: lead.id, // Using internal ID, not 'Lead ID'
          Status: newStatus,
          'Updated At': new Date().toISOString()
        })
      })

      const result = await response.json()

      if (result.success) {
        // Update local state
        setLeads(leads.map(l => 
          l.id === lead.id 
            ? { ...l, Status: newStatus, 'Updated At': new Date().toISOString() } 
            : l
        ))
        
        alert(`✅ Status updated to: ${newStatus}`)
        
        // If converted, show success message
        if (newStatus === 'Converted') {
          alert('🎉 Lead converted! Booking confirmation email will be sent.')
        }
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  // Update full lead details
  const handleUpdateLead = async () => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateLead',
          id: editForm.id,
          ...editForm
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Lead updated successfully!')
        setIsEditModalOpen(false)
        fetchLeads()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error updating lead:', error)
      alert('Failed to update lead')
    }
  }

  // Delete lead
  const handleDeleteLead = async (lead) => {
    if (!confirm(`Are you sure you want to delete lead for ${lead['Client Name']}?`)) {
      return
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'deleteLead',
          id: lead.id
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Lead deleted successfully')
        fetchLeads()
      } else {
        alert('❌ Error: ' + result.message)
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
      alert('Failed to delete lead')
    }
  }

  // Open edit modal
  const openEditModal = (lead) => {
    setEditForm({ ...lead })
    setSelectedLead(lead)
    setIsEditModalOpen(true)
  }

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead['Client Name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Phone?.includes(searchTerm) ||
      lead['Event Type']?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'All' || lead.Status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate statistics
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.Status === 'New Lead').length,
    contacted: leads.filter(l => l.Status === 'Contacted').length,
    converted: leads.filter(l => l.Status === 'Converted').length,
    lost: leads.filter(l => l.Status === 'Lost').length,
    conversionRate: leads.length > 0 
      ? Math.round((leads.filter(l => l.Status === 'Converted').length / leads.length) * 100) 
      : 0
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <FaUser className="text-blue-600" />
          Leads Manager
        </h1>
        <p className="text-gray-600">Manage and track all your photography leads</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaChartLine className="text-3xl opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.total}</h3>
          <p className="text-blue-100 text-sm">Total Leads</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaBell className="text-3xl opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.new}</h3>
          <p className="text-yellow-100 text-sm">New Leads</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaPhone className="text-3xl opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.contacted}</h3>
          <p className="text-orange-100 text-sm">Contacted</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaCheck className="text-3xl opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.converted}</h3>
          <p className="text-green-100 text-sm">Converted</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <FaChartLine className="text-3xl opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.conversionRate}%</h3>
          <p className="text-purple-100 text-sm">Conversion Rate</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or event type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="All">All Status</option>
              <option value="New Lead">New Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Negotiating">Negotiating</option>
              <option value="Converted">Converted</option>
              <option value="Event Completed">Event Completed</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lead ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead, index) => {
                  const config = statusConfig[lead.Status] || statusConfig['New Lead']
                  const StatusIcon = config.icon

                  return (
                    <motion.tr
                      key={lead.id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-600">
                          {lead['Lead ID']?.substring(0, 15)}...
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{lead['Client Name']}</div>
                          <div className="text-sm text-gray-500">{lead.Email}</div>
                          <div className="text-sm text-gray-500">{lead.Phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{lead['Event Type']}</div>
                          <div className="text-sm text-gray-500">{lead['Package Category']}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(lead['Event Date'])}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <select
                            value={lead.Status}
                            onChange={(e) => updateLeadStatus(lead, e.target.value)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color} cursor-pointer border-none focus:ring-2 focus:ring-blue-500`}
                          >
                            <option value={lead.Status}>{lead.Status}</option>
                            {config.nextActions.map(action => (
                              <option key={action} value={action}>{action}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedLead(lead)
                              setIsViewModalOpen(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => openEditModal(lead)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Lead"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Lead"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedLead['Client Name']}</h2>
                    <p className="text-blue-100 mt-1">{selectedLead['Lead ID']}</p>
                  </div>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 flex items-center gap-2 mt-1">
                      <FaEnvelope className="text-blue-600" />
                      {selectedLead.Email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900 flex items-center gap-2 mt-1">
                      <FaPhone className="text-green-600" />
                      {selectedLead.Phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Event Type</label>
                    <p className="text-gray-900 mt-1">{selectedLead['Event Type']}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Event Date</label>
                    <p className="text-gray-900 flex items-center gap-2 mt-1">
                      <FaCalendar className="text-purple-600" />
                      {formatDate(selectedLead['Event Date'])}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Package</label>
                    <p className="text-gray-900 mt-1">{selectedLead['Package Category'] || 'Not selected'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Budget</label>
                    <p className="text-gray-900 flex items-center gap-2 mt-1">
                      <FaMoneyBillWave className="text-green-600" />
                      {selectedLead.Budget || 'Not specified'}
                    </p>
                  </div>
                </div>

                {selectedLead.Venue && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Venue</label>
                    <p className="text-gray-900 flex items-center gap-2 mt-1">
                      <FaMapMarkerAlt className="text-red-600" />
                      {selectedLead.Venue}
                    </p>
                  </div>
                )}

                {selectedLead['Custom Requirements'] && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Requirements</label>
                    <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">
                      {selectedLead['Custom Requirements']}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && editForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaEdit />
                      Edit Lead
                    </h2>
                    <p className="text-green-100 mt-1">{editForm['Client Name']}</p>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                    <input
                      type="text"
                      value={editForm['Client Name'] || ''}
                      onChange={(e) => setEditForm({...editForm, 'Client Name': e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.Email || ''}
                      onChange={(e) => setEditForm({...editForm, Email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editForm.Phone || ''}
                      onChange={(e) => setEditForm({...editForm, Phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                    <select
                      value={editForm['Event Type'] || ''}
                      onChange={(e) => setEditForm({...editForm, 'Event Type': e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Product Shoot">Product Shoot</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                    <input
                      type="date"
                      value={editForm['Event Date'] || ''}
                      onChange={(e) => setEditForm({...editForm, 'Event Date': e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <input
                      type="text"
                      value={editForm.Budget || ''}
                      onChange={(e) => setEditForm({...editForm, Budget: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editForm.Status || ''}
                      onChange={(e) => setEditForm({...editForm, Status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Negotiating">Negotiating</option>
                      <option value="Converted">Converted</option>
                      <option value="Event Completed">Event Completed</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
                    <select
                      value={editForm['Package Category'] || ''}
                      onChange={(e) => setEditForm({...editForm, 'Package Category': e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Package</option>
                      <option value="Basic">Basic</option>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={editForm.Notes || ''}
                    onChange={(e) => setEditForm({...editForm, Notes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows="3"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUpdateLead}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
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

export default LeadsManager
